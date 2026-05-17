import { useState, useCallback, useEffect, useRef } from "react";
import JSZip from "jszip";

async function buildZip(files, fileContents) {
  const zip = new JSZip();
  for (const file of files) {
    const content = fileContents[file.name] ?? file.code ?? "";
    if (file.name.endsWith("/.gitkeep")) continue;
    zip.file(file.name, content);
  }
  // Add a minimal package.json so the zip is runnable
  zip.file("package.json", JSON.stringify({
    name: "runway-export",
    version: "1.0.0",
    main: "node_modules/expo/AppEntry.js",
    scripts: { start: "expo start", android: "expo run:android", ios: "expo run:ios", web: "expo start --web" },
    dependencies: {
      "expo": "~51.0.0",
      "expo-status-bar": "~1.12.1",
      "react": "18.2.0",
      "react-native": "0.74.5",
    },
    devDependencies: {
      "@babel/core": "^7.24.0",
    },
    private: true,
  }, null, 2));
  return zip.generateAsync({ type: "blob" });
}

export default function ShareModal({ files, fileContents, onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | zipping | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownload = useCallback(async () => {
    try {
      setStatus("zipping");
      const blob = await buildZip(files, fileContents);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "runway-project.zip";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  }, [files, fileContents]);

  const handleSendEmail = useCallback(async () => {
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Enter a valid email address.");
      return;
    }
    try {
      setStatus("zipping");
      const blob = await buildZip(files, fileContents);
      // Download the zip
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "runway-project.zip";
      a.click();
      URL.revokeObjectURL(url);
      // Open mailto with instructions
      const subject = encodeURIComponent("Runway Project Export");
      const body = encodeURIComponent(
        `Hi,\n\nAttaching the Runway project export.\n\nTo run:\n  npx create-expo-app --template\n  or unzip and run: npx expo start\n\nSent via Runway`
      );
      window.open(`mailto:${email}?subject=${subject}&body=${body}`);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  }, [email, files, fileContents]);

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-row">
            <div className="modal-icon">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="14" cy="4" r="2.5" stroke="#7cf7c9" strokeWidth="1.5"/>
                <circle cx="4" cy="9" r="2.5" stroke="#7cf7c9" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="2.5" stroke="#7cf7c9" strokeWidth="1.5"/>
                <line x1="11.6" y1="5.2" x2="6.4" y2="7.8" stroke="#7cf7c9" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="6.4" y1="10.2" x2="11.6" y2="12.8" stroke="#7cf7c9" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="modal-title">Share Project</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          Export your project as a <strong>.zip</strong> — drop it into Expo CLI and run instantly on any device.
        </p>

        <div className="modal-section-label">Send to email</div>
        <div className="modal-input-row">
          <input
            type="email"
            className="modal-input"
            placeholder="candidate@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); setStatus("idle"); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendEmail(); }}
          />
          <button
            type="button"
            className="modal-send-btn"
            onClick={handleSendEmail}
            disabled={status === "zipping"}
          >
            {status === "zipping" ? "Packing…" : "Send"}
          </button>
        </div>
        {errorMsg && <p className="modal-error">{errorMsg}</p>}

        <div className="modal-divider"><span>or</span></div>

        <button
          type="button"
          className="modal-download-btn"
          onClick={handleDownload}
          disabled={status === "zipping"}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          Download .zip
        </button>

        {status === "done" && (
          <p className="modal-success">
            ✓ Zip downloaded! If sending by email, attach it manually.
          </p>
        )}

        <div className="modal-meta">
          <span>📦 {files.filter(f => !f.name.endsWith("/.gitkeep")).length} files</span>
          <span>·</span>
          <span>Expo-ready</span>
        </div>
      </div>
    </div>
  );
}
