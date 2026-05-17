# Runway — Architecture & Technical Deep Dive

Everything someone might ask you about how Runway works.

---

## What is Runway?

A browser-based React Native IDE. You write TypeScript/JSX in Monaco, and it renders inside a realistic phone frame in real-time — no installs, no build step, no server.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Tab                              │
│                                                                 │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────────┐   │
│  │ Sidebar  │   │    Monaco    │   │   Phone Frame        │   │
│  │          │   │    Editor    │   │  ┌────────────────┐  │   │
│  │ File     │   │              │   │  │   <iframe>     │  │   │
│  │ Tree     │   │  TypeScript  │   │  │                │  │   │
│  │          │   │  JSX / TSX   │   │  │  Babel runs    │  │   │
│  │ Packages │   │              │   │  │  here, inside  │  │   │
│  │ Panel    │   │              │   │  │  the iframe    │  │   │
│  └──────────┘   └──────────────┘   │  └────────────────┘  │   │
│                        │           └──────────────────────────┘   │
│                        │ onChange (600ms debounce)                │
│                        ▼                                         │
│              App.jsx → generateSrcdoc()                         │
│                        │                                         │
│                        ▼                                         │
│              iframe.srcDoc = htmlString                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Live Preview Pipeline

This is the core of Runway. Here's the exact flow when you type a character:

```
User types in Monaco
        │
        │  onChange fires (IdeEditor)
        ▼
fileContents state updated in App.jsx
        │
        │  useEffect([fileContents]) triggers (600ms debounce)
        ▼
generateSrcdoc(files, fileContents, extraPackages)
        │
        │  Produces a self-contained HTML string
        ▼
setSrcdoc(htmlString)
        │
        │  IdePreviewPane receives new srcdoc prop
        ▼
useEffect([srcdoc]) → setFrameKey(k + 1)
        │
        │  React re-mounts the iframe with new key
        ▼
iframe loads the new srcdoc
        │
        │  Inside the iframe:
        │  1. @babel/standalone loads from unpkg CDN
        │  2. React + ReactDOM load from unpkg CDN
        │  3. Inline RN shim sets up window.ReactNativeWeb
        │  4. <script type="module"> runs async:
        │     a. Load npm packages from esm.sh
        │     b. Transpile each file with Babel (TSX → CommonJS)
        │     c. Execute files in dependency order
        │     d. ReactDOM.createRoot(root).render(<App />)
        ▼
App renders inside phone frame
```

---

## Why `srcDoc` + iframe?

- **Isolation** — user code runs in a completely separate JS context. A crash doesn't kill the IDE.
- **Security** — `sandbox="allow-scripts"` prevents the preview from accessing the parent page's DOM, cookies, or localStorage.
- **Simplicity** — no WebWorkers, no Webpack, no esbuild. The entire bundle is a string.
- **Self-contained** — the srcdoc string has everything it needs. Copy it to a file and it works offline.

---

## The React Native → DOM Shim

React Native components (`View`, `Text`, `Pressable`, etc.) don't exist in a browser. Runway includes an inline shim (`src/utils/livePreview.js`) that maps each RN component to its DOM equivalent:

```
View            → <div style="display:flex; flex-direction:column">
Text            → <span style="display:inline-block; font-size:14px">
ScrollView      → <div style="overflow-y:auto">
Pressable       → <div style="cursor:pointer"> with hover state
SafeAreaView    → <div style="display:flex; flex:1">
FlatList        → <div> + data.map(renderItem)
TextInput       → <input>
Image           → <img>
ActivityIndicator → <div> with CSS spin animation
StatusBar       → null (nothing renders)
StyleSheet      → identity (returns styles as-is)
Platform        → { OS: 'web' }
Animated        → stub (timing/spring calls setValue immediately)
```

### Why not use react-native-web from CDN?

RNW is 2MB+ and requires a build step. The inline shim is ~4KB, loads instantly, and handles 90% of RN patterns. The trade-off: advanced RNW features (Animated with native driver, Gesture Handler, etc.) don't work — but they're not needed for most assessments.

### The `css()` converter

RN styles aren't 1:1 with CSS. The shim has a `css()` function that fixes the known differences:

| RN value | CSS problem | Fix |
|---|---|---|
| `lineHeight: 24` | In RN = 24px. In CSS unitless = 24× font-size | Append `'px'` |
| `borderWidth: 1` | CSS needs `borderStyle` to show borders | Add `borderStyle: 'solid'` |
| `flex: 1` | CSS flex items don't shrink past content size | Add `minWidth: 0; minHeight: 0` |

---

## Module System (CommonJS inside iframe)

Babel transforms each file to CommonJS. A custom `req()` function resolves imports:

```
import axios from 'axios'
    ↓ Babel transforms to ↓
var _axios = _interopRequireDefault(require('axios'));

require('axios')
    ↓ hits req() ↓
    checks: is it 'react'? → return React global
    checks: is it 'react-native'? → return ReactNativeWeb global
    checks: is it in __pkgs (esm.sh loaded)? → return that
    else: resolve relative path in reg[] registry
```

Files are compiled and registered in alphabetical order, with `App.tsx` always last (so all components exist before the entry point tries to import them).

---

## npm Package Support

```
User writes: import axios from 'axios'
        │
        ▼
detectPackages(fileContents)
  — regex scans all files for import/require of non-relative, non-builtin packages
  — returns: ['axios']
        │
        ▼
generateSrcdoc passes ['axios'] into the iframe as allPackages
        │
        ▼
Inside iframe (async module script):
  await import('https://esm.sh/axios?bundle')
        │
        ▼
Result stored in __pkgs['axios']
  — spreads named exports + attaches default
  — marks __esModule: true for Babel interop
        │
        ▼
req('axios') returns __pkgs['axios']
        │
        ▼
window.parent.postMessage({ type:'runway-pkg', status:'loaded', name:'axios' })
        │
        ▼
App.jsx listener logs "packages: loaded axios" in the log panel
```

Users can also add packages manually via the Packages panel in the sidebar.

---

## Auto-change Detection

There is no file watcher or polling. React state is the source of truth:

```
fileContents: { 'App.tsx': '...', 'components/Button.tsx': '...' }
        │
        │  When user edits in Monaco:
        │  handleFileChange(name, value) → setFileContents(prev => ({...prev, [name]: value}))
        │
        │  useEffect dependency: [fileContents]
        │  Fires on every state update, debounced 600ms
        ▼
generateSrcdoc() runs synchronously and returns the full HTML string
```

The 600ms debounce means the preview doesn't refresh on every keystroke — only after the user pauses typing.

**Run button** bypasses the debounce and calls `generateSrcdoc()` immediately.

---

## Design System

All styles live in `src/styles.css` (single file, ~1700 lines). No CSS-in-JS, no Tailwind.

### Color tokens (CSS variables)

```css
--bg:      #07111f   /* deepest background */
--bg-2:    #0b1929   /* sidebar, topbar */
--bg-3:    #0e1e2e   /* inputs, cards */
--bg-4:    #152436   /* hover states */
--line:    rgba(255,255,255,0.06)   /* dividers */
--line-hi: rgba(255,255,255,0.10)   /* prominent dividers */
--cyan:    #7cf7c9   /* primary accent — approach lights green */
--amber:   #ff9b71   /* secondary accent */
--blue:    #86a8ff   /* tertiary accent */
--text:    #e8f0f8
--text-dim:#93aac3
--muted:   #4a6070
```

### Layout variables

```css
--topbar-h:   42px
--tabs-h:     36px
--sidebar-w:  220px
--preview-w:  340px
--bottom-h:   160px
```

### Key layout structure

```
.root-shell                    (full viewport, cursor spotlight CSS vars)
  .boot-overlay                (fixed, z-index 100, fades out on is-loaded)
  .ide-shell                   (flex column, full height)
    .ide-topbar                (fixed height, flex row)
    .ide-body                  (flex row, fills remaining height)
      .ide-sidebar             (fixed width, flex column)
      .ide-center              (flex: 1, flex column)
        .editor-tabs           (fixed height)
        .editor-area           (flex: 1, Monaco lives here)
        .ide-bottom            (fixed height, log panel)
      .ide-preview             (fixed width, flex column)
```

---

## Phone Frame

Pure CSS + HTML divs. No SVG, no canvas.

```
.device-frame          ← outer wrapper, drop-shadow glow
  .device-btn-vol-up   ← left side button (CSS gradient slab)
  .device-btn-vol-dn   ← left side button
  .device-btn-power    ← right side button
  .device-body         ← titanium gradient + box-shadow chamfer ring
    ::before            ← specular highlight + antenna shimmer
    ::after             ← antenna cutline at 58% height
    .device-status-bar ← time + signal + wifi + battery
    .device-punch-hole ← 88×28px pill (dynamic island)
      ::before          ← camera lens dot
    .device-screen     ← OLED black background
      ::before          ← diagonal glass glare
      ::after           ← edge vignette
      iframe            ← live preview
    .device-home-bar   ← bottom pill indicator
```

Three size presets: `device-mini` (258px), `device-pro` (296px), `device-fold` (336px).

---

## Boot Screen

The boot screen is a CSS perspective runway with animated approach lights:

```
.boot-overlay
  .boot-backdrop         ← starfield (radial-gradient dots)
  .boot-runway-scene     ← CSS perspective container
    .boot-runway-strip   ← rotateX(72deg) — forces perspective
      .boot-runway-dash  ← 10 center dashes, animated scroll toward camera
      .boot-runway-light ← 14 left + 14 right edge lights, pulsing cyan
      .boot-runway-threshold ← yellow bar at bottom (like real runway markings)
  .boot-horizon-glow     ← radial gradient at vanishing point
  .boot-panel            ← floating content, no box/border
```

Boot steps are defined in `src/data.js` as `BOOT_STEPS`. Each step has a label and copy. The boot sequence fires every 900ms via `setInterval` in `App.jsx`.

---

## Share / Export

The Share modal uses `JSZip` to build a `.zip` in the browser:

1. Iterates all files in `fileContents`
2. Skips `.gitkeep` placeholders
3. Adds a generated `package.json` with Expo dependencies
4. `zip.generateAsync({ type: 'blob' })` → triggers download
5. Opens `mailto:` with instructions in the body

No server involved. The zip is built entirely client-side.

---

## File & Folder Creation

Files are stored as a flat array in `App.jsx` state:
```js
files: [{ name: 'components/Button.tsx', label: 'ui', accent: 'aurora', code: '...' }]
fileContents: { 'components/Button.tsx': '...' }
```

Folders are virtual — they exist only as the common prefix of file names. Creating a folder creates a `foldername/.gitkeep` placeholder file, which is filtered out of the visible tree.

---

## Analytics

`@vercel/analytics/react` — the `<Analytics />` component is added to `main.jsx`. It sends page views to Vercel's analytics dashboard. No configuration needed; it auto-detects the Vercel environment.

---

## Deployment

- **Host**: Vercel (auto-deploys from `prakharcodehere/runway` on push to `main`)
- **Build**: Vite (`npm run build` → `dist/`)
- **URL**: runway-ide.vercel.app
- **No environment variables** needed — fully static, no backend
