import { useState, useCallback, useEffect, useRef } from "react";
import JSZip from "jszip";

async function buildZip(files, fileContents, projectName) {
  const zip = new JSZip();
  for (const file of files) {
    const content = fileContents[file.name] ?? file.code ?? "";
    if (file.name.endsWith("/.gitkeep")) continue;
    zip.file(file.name, content);
  }
  zip.file("package.json", JSON.stringify({
    name: projectName,
    version: "1.0.0",
    main: "node_modules/expo/AppEntry.js",
    scripts: { start: "expo start", android: "expo run:android", ios: "expo run:ios", web: "expo start --web" },
    dependencies: {
      "expo": "~51.0.0",
      "expo-status-bar": "~1.12.1",
      "react": "18.2.0",
      "react-native": "0.74.5",
    },
    devDependencies: { "@babel/core": "^7.24.0" },
    private: true,
  }, null, 2));
  return zip.generateAsync({ type: "blob" });
}

export default function ShareModal({ files, fileContents, onClose, projectName, onRenameProject }) {
  const [localName, setLocalName] = useState(projectName);
  const [status, setStatus] = useState("idle"); // idle | zipping | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const overlayRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const safeName = localName.trim().replace(/[^a-zA-Z0-9-_]/g, "-") || "runway-project";

  const handleDownload = useCallback(async () => {
    try {
      setStatus("zipping");
      setErrorMsg("");
      if (localName.trim() && localName.trim() !== projectName) {
        onRenameProject(localName.trim());
      }
      const blob = await buildZip(files, fileContents, safeName);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeName}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("done");
    } catch (e) {
      setErrorMsg(e.message);
      setStatus("error");
    }
  }, [files, fileContents, safeName, localName, projectName, onRenameProject]);

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
            <span className="modal-title">Export Project</span>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>✕</button>
        </div>

        <p className="modal-desc">
          Download your project as a <strong>.zip</strong> — drop it into Expo CLI and run on any device.
        </p>

        <div className="modal-section-label">Project name</div>
        <input
          type="text"
          className="modal-input"
          style={{ marginBottom: 20 }}
          placeholder="my-awesome-app"
          value={localName}
          onChange={(e) => { setLocalName(e.target.value); setStatus("idle"); setErrorMsg(""); }}
          onKeyDown={(e) => { if (e.key === "Enter") handleDownload(); }}
        />

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
          {status === "zipping" ? "Packing…" : `Download ${safeName}.zip`}
        </button>

        {status === "done" && (
          <p className="modal-success">✓ Downloaded! Run with: <code>npx expo start</code></p>
        )}
        {errorMsg && <p className="modal-error">{errorMsg}</p>}

        <div className="modal-meta">
          <span>📦 {files.filter(f => !f.name.endsWith("/.gitkeep")).length} files</span>
          <span>·</span>
          <span>Expo-ready</span>
        </div>
      </div>
    </div>
  );
}
