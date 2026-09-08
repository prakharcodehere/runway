import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { PREVIEW_PRESETS } from "../data";

// Rounded-rect path in a shared 300×620 coordinate space (matches the
// .device-frame aspect-ratio, so the SVG shell scales without distortion).
function roundedRectPath(x, y, w, h, r) {
  return `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`;
}

const SHELL_OUTER = { x: 2, y: 2, w: 296, h: 616, r: 50 };
const SHELL_RING = 8;
const SHELL_INNER = {
  x: SHELL_OUTER.x + SHELL_RING,
  y: SHELL_OUTER.y + SHELL_RING,
  w: SHELL_OUTER.w - SHELL_RING * 2,
  h: SHELL_OUTER.h - SHELL_RING * 2,
  r: SHELL_OUTER.r - SHELL_RING,
};
const SHELL_OUTER_PATH = roundedRectPath(SHELL_OUTER.x, SHELL_OUTER.y, SHELL_OUTER.w, SHELL_OUTER.h, SHELL_OUTER.r);
// Bezel ring = outer rounded rect minus inner cutout, combined via evenodd —
// the cutout is where the HTML screen overlay sits, so the two stay concentric.
const SHELL_RING_PATH = `${SHELL_OUTER_PATH} ${roundedRectPath(SHELL_INNER.x, SHELL_INNER.y, SHELL_INNER.w, SHELL_INNER.h, SHELL_INNER.r)}`;

function buildQrCells() {
  const size = 21;
  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inFinder = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
      cells.push(inFinder || (r * 7 + c * 11) % 5 === 0 || (r + c) % 9 === 0);
    }
  }
  return cells;
}

export default function IdePreviewPane({ fileData: file, srcdoc, onRun }) {
  const [activeTab, setActiveTab] = useState("preview");
  const [preset, setPreset] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [frameKey, setFrameKey] = useState(0);
  const qrCells = useMemo(buildQrCells, []);

  // Remount iframe whenever srcdoc changes
  useEffect(() => {
    if (!srcdoc) return;
    setLoading(true);
    setFrameKey((k) => k + 1);
  }, [srcdoc]);

  const handleRefresh = useCallback(() => {
    onRun(); // triggers regeneration in App.jsx
  }, [onRun]);

  return (
    <aside className="ide-preview">
      <div className="preview-tabs">
        <button
          type="button"
          className={`preview-tab${activeTab === "preview" ? " is-active" : ""}`}
          onClick={() => setActiveTab("preview")}
        >
          Preview
        </button>
        <button
          type="button"
          className={`preview-tab${activeTab === "expo" ? " is-active" : ""}`}
          onClick={() => setActiveTab("expo")}
        >
          Expo
        </button>
      </div>

      <div className="preview-body">
        {activeTab === "preview" && (
          <>
            {/* Preset + refresh controls */}
            <div className="preview-controls">
              <div className="preview-presets">
                {PREVIEW_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`preset-btn${p.id === preset ? " is-active" : ""}`}
                    onClick={() => setPreset(p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="refresh-btn"
                onClick={handleRefresh}
                title="Refresh preview"
              >
                ↺
              </button>
            </div>

            {/* Realistic phone frame — SVG titanium shell + HTML screen overlay */}
            <div className={`device-frame device-${preset}`}>
              <svg
                className="device-shell-svg"
                viewBox="0 0 300 620"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  {/* Light from above — bright rim at top, dark mid-body, faint bottom bounce */}
                  <linearGradient id="shellBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7d7f85" />
                    <stop offset="6%" stopColor="#48494e" />
                    <stop offset="18%" stopColor="#232427" />
                    <stop offset="40%" stopColor="#151516" />
                    <stop offset="65%" stopColor="#1a1b1d" />
                    <stop offset="88%" stopColor="#2e2f33" />
                    <stop offset="100%" stopColor="#4c4d53" />
                  </linearGradient>
                  <linearGradient id="shellEdge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a6a8ae" />
                    <stop offset="30%" stopColor="#3a3b3f" />
                    <stop offset="70%" stopColor="#0e0e0f" />
                    <stop offset="100%" stopColor="#38393d" />
                  </linearGradient>
                  {/* Soft highlight following the ring — screen-blended so it reads
                      as a light catch rather than a flat wash */}
                  <radialGradient id="shellSpecular" cx="32%" cy="4%" r="55%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  <linearGradient id="btnFill" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0a0a0b" />
                    <stop offset="50%" stopColor="#4a4c51" />
                    <stop offset="100%" stopColor="#0a0a0b" />
                  </linearGradient>
                </defs>

                {/* Bezel ring — outer shell minus the screen cutout, kept perfectly
                    concentric with the HTML screen overlay via shared geometry */}
                <path d={SHELL_RING_PATH} fillRule="evenodd" fill="url(#shellBody)" />
                <path d={SHELL_RING_PATH} fillRule="evenodd" fill="url(#shellSpecular)" style={{ mixBlendMode: "screen" }} />
                <path d={SHELL_OUTER_PATH} fill="none" stroke="url(#shellEdge)" strokeWidth="1.5" />

                {/* Antenna cutlines, confined to the ring so they don't cross the screen */}
                <rect x={SHELL_OUTER.x} y="358" width={SHELL_RING} height="1" fill="rgba(0,0,0,0.5)" />
                <rect x={SHELL_OUTER.x + SHELL_OUTER.w - SHELL_RING} y="358" width={SHELL_RING} height="1" fill="rgba(0,0,0,0.5)" />

                {/* Side buttons — protrude slightly past the body edge */}
                <rect x="-3" y="128" width="4" height="48" rx="1.5" fill="url(#btnFill)" />
                <rect x="-3" y="192" width="4" height="48" rx="1.5" fill="url(#btnFill)" />
                <rect x="299" y="150" width="4" height="68" rx="1.5" fill="url(#btnFill)" />
              </svg>

              {/* Screen overlay — status bar / island share the screen's own
                  background instead of a separate bezel-colored strip */}
              <div className="device-screen">
                <div className="device-status-scrim" />
                <div className="device-status-bar">
                  <span className="device-time">9:41</span>
                  <div className="device-status-icons">
                    {/* Signal bars — 4 solid ascending bars, bottom-aligned */}
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <rect x="0" y="5" width="3" height="7" rx="0.6" fill="currentColor"/>
                      <rect x="4.5" y="3" width="3" height="9" rx="0.6" fill="currentColor"/>
                      <rect x="9" y="1" width="3" height="11" rx="0.6" fill="currentColor"/>
                      <rect x="13.5" y="0" width="2.5" height="12" rx="0.6" fill="currentColor"/>
                    </svg>
                    {/* WiFi — 2 fan arcs + dot, all fully inside the viewBox
                        (the old dot overflowed its box and got clipped) */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
                    </svg>
                    {/* Battery */}
                    <div className="device-battery">
                      <div className="device-battery-fill" />
                      <div className="device-battery-tip" />
                    </div>
                  </div>
                </div>

                <div className="device-punch-hole">
                  <div className="device-camera-dot" />
                </div>

                {loading && (
                  <div className="screen-loader">
                    <div className="screen-loader-dot" />
                    <div className="screen-loader-dot" />
                    <div className="screen-loader-dot" />
                  </div>
                )}
                {srcdoc && (
                  <iframe
                    key={frameKey}
                    srcDoc={srcdoc}
                    title="Live Preview"
                    sandbox="allow-scripts"
                    onLoad={() => setLoading(false)}
                    style={{ opacity: loading ? 0 : 1, transition: "opacity 300ms" }}
                  />
                )}

                <div className="device-home-bar" />
              </div>
            </div>
          </>
        )}

        {activeTab === "expo" && (
          <div className="expo-panel">
            <div className="expo-status">
              <span className="expo-live-dot" />
              <span className="expo-status-text">Expo Go · Online</span>
            </div>

            {/* Emulator note */}
            <div className="expo-emulator-note">
              <div className="expo-emulator-icon">📱</div>
              <p>
                To run in an Android/iOS emulator, install Expo CLI locally and
                run <code>npx expo start</code>. Runway will add cloud emulator
                support in a future update.
              </p>
            </div>

            {/* QR for Expo Go on a real phone */}
            <div className="expo-qr-section">
              <div className="expo-qr-label">Scan with Expo Go</div>
              <div className="qr-box">
                <div className="qr-grid">
                  {qrCells.map((dark, i) => (
                    <span key={i} className={dark ? "dark" : ""} />
                  ))}
                </div>
              </div>
              <p className="expo-qr-hint">
                Opens the live session on your real device. Reloads automatically when you save.
              </p>
            </div>

            <div className="expo-meta-list">
              {[
                ["Session", "flux-rn-2048"],
                ["Deep link", "runway://flux-rn-2048"],
                ["Reload", "~420 ms"],
                ["Devices", "2 attached"],
              ].map(([label, value]) => (
                <div key={label} className="expo-meta-row">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>

            <button type="button" className="expo-push-btn" onClick={onRun}>
              Push Update to Device
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
