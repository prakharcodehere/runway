import { memo } from "react";
import IdeSidebar from "./IdeSidebar";
import IdeEditor from "./IdeEditor";
import IdePreviewPane from "./IdePreviewPane";
import IdeBottom from "./IdeBottom";

const IdeShell = memo(function IdeShell({
  files,
  activeFile,
  activeFileData,
  fileContents,
  srcdoc,
  logs,
  onFileSelect,
  onFileChange,
  onNewFile,
  onRun,
  onAction,
  onClearLogs,
  onSave,
}) {
  return (
    <div className="ide-shell">
      <header className="ide-topbar">
        <div className="topbar-brand">
          {/* Runway-in-perspective mark */}
          <svg className="brand-logo" width="30" height="26" viewBox="0 0 30 26" fill="none">
            <defs>
              <linearGradient id="rwy-left" x1="2" y1="25" x2="15" y2="5" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7cf7c9" stopOpacity="1"/>
                <stop offset="100%" stopColor="#a0c4ff" stopOpacity="0.4"/>
              </linearGradient>
              <linearGradient id="rwy-right" x1="28" y1="25" x2="15" y2="5" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7cf7c9" stopOpacity="1"/>
                <stop offset="100%" stopColor="#a0c4ff" stopOpacity="0.4"/>
              </linearGradient>
              <radialGradient id="vp-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#c0e8ff" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#7cf7c9" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Left runway edge */}
            <line x1="2" y1="25" x2="15" y2="5" stroke="url(#rwy-left)" strokeWidth="1.6" strokeLinecap="round"/>
            {/* Right runway edge */}
            <line x1="28" y1="25" x2="15" y2="5" stroke="url(#rwy-right)" strokeWidth="1.6" strokeLinecap="round"/>

            {/* Center dashes — scale down toward VP */}
            <line x1="15" y1="23" x2="15" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.85"/>
            <line x1="15" y1="17.5" x2="15" y2="15.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.55"/>
            <line x1="15" y1="13.5" x2="15" y2="12.2" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.3"/>

            {/* Left edge lights */}
            <circle cx="4"  cy="23" r="1.6" fill="#7cf7c9" opacity="1"/>
            <circle cx="7.5" cy="17" r="1.2" fill="#7cf7c9" opacity="0.75"/>
            <circle cx="11" cy="12" r="0.9" fill="#7cf7c9" opacity="0.45"/>

            {/* Right edge lights */}
            <circle cx="26"  cy="23" r="1.6" fill="#7cf7c9" opacity="1"/>
            <circle cx="22.5" cy="17" r="1.2" fill="#7cf7c9" opacity="0.75"/>
            <circle cx="19"  cy="12" r="0.9" fill="#7cf7c9" opacity="0.45"/>

            {/* Vanishing-point glow */}
            <circle cx="15" cy="5" r="3.5" fill="url(#vp-glow)"/>
          </svg>

          <span className="topbar-brand-name">Runway</span>
        </div>

        <div className="topbar-sep" />
        <span className="topbar-file">{activeFile}</span>
        <div className="topbar-spacer" />

        <button type="button" className="run-btn" onClick={onRun}>
          <span className="run-dot" />
          Run
        </button>
        <button type="button" className="topbar-btn" onClick={() => onAction("share")}>
          Share
        </button>
        <button type="button" className="topbar-btn accent" onClick={() => onAction("expo")}>
          Open in Expo
        </button>
      </header>

      <div className="ide-body">
        <IdeSidebar
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onNewFile={onNewFile}
        />
        <IdeEditor
          files={files}
          activeFile={activeFile}
          fileContents={fileContents}
          onFileSelect={onFileSelect}
          onFileChange={onFileChange}
          onSave={onSave}
        />
        <IdePreviewPane
          fileData={activeFileData}
          srcdoc={srcdoc}
          onRun={onRun}
        />
      </div>

      <IdeBottom logs={logs} onClearLogs={onClearLogs} />

      <div className="ide-statusbar">
        <span className="statusbar-item">⎇ main</span>
        <span className="statusbar-sep">·</span>
        <span className="statusbar-item">TypeScript</span>
        <span className="statusbar-sep">·</span>
        <span className="statusbar-item">React Native</span>
        <div className="statusbar-right">
          <span className="statusbar-item">Spaces: 2</span>
          <span className="statusbar-item" style={{ color: "rgba(255,255,255,0.55)" }}>
            ● Session live
          </span>
        </div>
      </div>
    </div>
  );
});

export default IdeShell;
