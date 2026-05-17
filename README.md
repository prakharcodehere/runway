# Runway ✈️

A browser-based React Native IDE. Write code, see it live inside a phone frame, then push straight to Expo Go on your real device.

![Runway IDE](public/preview.html)

## What it does

- **Live preview** — edits reflect in the phone frame within 600ms, no build step
- **Monaco editor** — full TypeScript/JSX support with syntax highlighting
- **Realistic phone frame** — status bar, dynamic island, hardware buttons
- **Expo handoff** — QR code to open your session in Expo Go
- **File tree** — create files and folders, multi-file projects
- **Export** — download your project as a `.zip`, ready for `npx expo start`
- **Runway boot screen** — perspective runway with animated approach lights

## Stack

- React 18 + Vite
- Monaco Editor (`@monaco-editor/react`)
- `@babel/standalone` — transpiles TSX/TS inside the preview iframe
- Inline React Native → DOM shim (no CDN dependency)
- JSZip for project export

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy

Deployed on Vercel. Connect the repo and it auto-detects Vite — no config needed.

## License

MIT
