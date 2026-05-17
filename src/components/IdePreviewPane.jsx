import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { PREVIEW_PRESETS } from "../data";

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

            {/* Realistic phone frame */}
            <div className={`device-frame device-${preset}`}>
              {/* Side buttons */}
              <div className="device-btn-vol-up" />
              <div className="device-btn-vol-dn" />
              <div className="device-btn-power" />

              <div className="device-body">
                {/* Status bar */}
                <div className="device-status-bar">
                  <span className="device-time">9:41</span>
                  <div className="device-status-icons">
                    {/* Signal bars */}
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                      <rect x="0" y="5" width="3" height="7" rx="0.6" fill="currentColor" opacity="0.35"/>
                      <rect x="4.5" y="3" width="3" height="9" rx="0.6" fill="currentColor" opacity="0.6"/>
                      <rect x="9" y="1" width="3" height="11" rx="0.6" fill="currentColor" opacity="0.85"/>
                      <rect x="13.5" y="0" width="2.5" height="12" rx="0.6" fill="currentColor"/>
                    </svg>
                    {/* WiFi */}
                    <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
                      <path d="M7.5 8.5 C8.3 8.5 9 9.2 9 10 C9 10.8 8.3 11.5 7.5 11.5 C6.7 11.5 6 10.8 6 10 C6 9.2 6.7 8.5 7.5 8.5Z" fill="currentColor"/>
                      <path d="M4.5 6.5 C5.5 5.4 6.4 4.8 7.5 4.8 C8.6 4.8 9.5 5.4 10.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                      <path d="M2 4 C3.7 2 5.5 0.8 7.5 0.8 C9.5 0.8 11.3 2 13 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" opacity="0.65"/>
                    </svg>
                    {/* Battery */}
                    <div className="device-battery">
                      <div className="device-battery-fill" />
                      <div className="device-battery-tip" />
                    </div>
                  </div>
                </div>

                {/* Dynamic island */}
                <div className="device-punch-hole" />

                {/* Screen content */}
                <div className="device-screen">
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
                </div>

                {/* Home indicator */}
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
