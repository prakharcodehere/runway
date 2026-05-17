# Runway ✈️

> Code mobile apps in your browser. See them live on your phone.

A browser-based React Native IDE — write TypeScript/JSX in Monaco, watch it render inside a realistic phone frame in real-time, then push straight to Expo Go on your real device. No install. No build step. Just open and build.

<div align="center">

<!-- Runway SVG hero -->
<svg width="480" height="120" viewBox="0 0 480 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="480" height="120" rx="12" fill="#07111f"/>
  <!-- Runway strip (perspective) -->
  <polygon points="240,18 180,102 300,102" fill="rgba(20,40,70,0.6)" stroke="rgba(124,247,201,0.15)" stroke-width="1"/>
  <!-- Center dashes -->
  <rect x="238" y="88" width="4" height="10" rx="2" fill="white" fill-opacity="0.8"/>
  <rect x="238.5" y="70" width="3" height="7" rx="1.5" fill="white" fill-opacity="0.5"/>
  <rect x="239" y="56" width="2" height="5" rx="1" fill="white" fill-opacity="0.3"/>
  <!-- Left edge lights -->
  <circle cx="193" cy="98" r="3" fill="#7cf7c9" fill-opacity="0.95"/>
  <circle cx="205" cy="80" r="2.2" fill="#7cf7c9" fill-opacity="0.7"/>
  <circle cx="216" cy="64" r="1.6" fill="#7cf7c9" fill-opacity="0.45"/>
  <!-- Right edge lights -->
  <circle cx="287" cy="98" r="3" fill="#7cf7c9" fill-opacity="0.95"/>
  <circle cx="275" cy="80" r="2.2" fill="#7cf7c9" fill-opacity="0.7"/>
  <circle cx="264" cy="64" r="1.6" fill="#7cf7c9" fill-opacity="0.45"/>
  <!-- Vanishing point glow -->
  <circle cx="240" cy="20" r="8" fill="#7cf7c9" fill-opacity="0.15"/>
  <circle cx="240" cy="20" r="4" fill="#c0f0ff" fill-opacity="0.4"/>
  <!-- Threshold bar -->
  <rect x="180" y="101" width="120" height="4" rx="2" fill="#ffc83d" fill-opacity="0.85"/>
  <!-- Label -->
  <text x="240" y="116" text-anchor="middle" font-family="system-ui,sans-serif" font-size="9" fill="rgba(124,247,201,0.5)" letter-spacing="3">CLEARED FOR TAKEOFF</text>
  <!-- Right side: mini phone outline -->
  <rect x="370" y="20" width="76" height="80" rx="10" fill="none" stroke="rgba(124,247,201,0.3)" stroke-width="1.5"/>
  <rect x="380" y="30" width="56" height="60" rx="6" fill="rgba(124,247,201,0.05)"/>
  <rect x="402" y="25" width="16" height="5" rx="2.5" fill="rgba(255,255,255,0.2)"/>
  <rect x="386" y="38" width="44" height="6" rx="2" fill="rgba(255,255,255,0.12)"/>
  <rect x="386" y="50" width="32" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
  <rect x="386" y="60" width="38" height="4" rx="2" fill="rgba(255,255,255,0.07)"/>
  <rect x="386" y="70" width="28" height="4" rx="2" fill="rgba(124,247,201,0.2)"/>
  <circle cx="408" cy="86" r="3" fill="rgba(124,247,201,0.15)" stroke="rgba(124,247,201,0.4)" stroke-width="1"/>
  <!-- Left side: code lines -->
  <rect x="34" y="30" width="8" height="3" rx="1" fill="#7cf7c9" fill-opacity="0.6"/>
  <rect x="46" y="30" width="48" height="3" rx="1" fill="white" fill-opacity="0.25"/>
  <rect x="42" y="38" width="12" height="3" rx="1" fill="#ff9b71" fill-opacity="0.7"/>
  <rect x="58" y="38" width="36" height="3" rx="1" fill="white" fill-opacity="0.18"/>
  <rect x="50" y="46" width="56" height="3" rx="1" fill="white" fill-opacity="0.18"/>
  <rect x="50" y="54" width="44" height="3" rx="1" fill="#86a8ff" fill-opacity="0.6"/>
  <rect x="42" y="62" width="8" height="3" rx="1" fill="#ff9b71" fill-opacity="0.5"/>
  <rect x="34" y="70" width="8" height="3" rx="1" fill="#7cf7c9" fill-opacity="0.4"/>
  <!-- Arrow from code to phone -->
  <path d="M 108 60 Q 180 60 200 60" stroke="rgba(124,247,201,0.35)" stroke-width="1.5" stroke-dasharray="4 3" fill="none"/>
  <polygon points="198,57 204,60 198,63" fill="rgba(124,247,201,0.5)"/>
</svg>

</div>

## Features

| | |
|---|---|
| **Live preview** | Edits render in the phone frame within 600ms — no build, no reload |
| **Monaco editor** | Full TypeScript + JSX support, Ctrl+S to refresh, syntax highlighting |
| **Phone frame** | Realistic Android-style frame — dynamic island, status bar, hardware buttons |
| **Multi-file projects** | File tree with folder support, create `.tsx / .ts / .js` files on the fly |
| **Expo handoff** | QR code to open the live session in Expo Go on your real phone |
| **Project export** | Download as `.zip` — unzip and run `npx expo start` instantly |
| **Session telemetry** | Live log panel showing metro, preview, and runtime events |

## Stack

- **React 18 + Vite** — host app
- **Monaco Editor** (`@monaco-editor/react`) — code editor with TS ambient types
- **`@babel/standalone`** — in-iframe transpiler for TSX/TS (loaded from CDN inside srcdoc)
- **Inline RN shim** — custom React Native → DOM component map (View, Text, ScrollView, Pressable, FlatList, Animated, StyleSheet, Platform…)
- **JSZip** — client-side project export

## Getting started

```bash
npm install
npm run dev
# open http://localhost:5173
```

## License

MIT
