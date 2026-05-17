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
  detectedPackages,
  extraPackages,
  projectName,
  onFileSelect,
  onFileChange,
  onNewFile,
  onRun,
  onAction,
  onClearLogs,
  onSave,
  onAddPackage,
  onRemovePackage,
  onRenameProject,
  onRenameFile,
  activeChallenge,
  testResults,
  onOpenChallenges,
  onRunTests,
  editorKey,
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
        <button type="button" className="topbar-btn topbar-challenges-btn" onClick={onOpenChallenges}>
          {activeChallenge ? `✦ ${activeChallenge.title}` : "Challenges"}
        </button>
        <button type="button" className="topbar-btn" onClick={() => onAction("share")}>
          Share
        </button>
        <button type="button" className="topbar-btn accent" onClick={() => onAction("expo")}>
          Open in Expo
        </button>
        <a
          href="https://github.com/prakharcodehere/runway"
          target="_blank"
          rel="noopener noreferrer"
          className="topbar-github"
          title="View on GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
      </header>

      <div className="ide-body">
        <IdeSidebar
          files={files}
          activeFile={activeFile}
          onFileSelect={onFileSelect}
          onNewFile={onNewFile}
          detectedPackages={detectedPackages}
          extraPackages={extraPackages}
          onAddPackage={onAddPackage}
          onRemovePackage={onRemovePackage}
          projectName={projectName}
          onRenameProject={onRenameProject}
          onRenameFile={onRenameFile}
        />
        <IdeEditor
          key={editorKey}
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

      <IdeBottom
        logs={logs}
        onClearLogs={onClearLogs}
        activeChallenge={activeChallenge}
        testResults={testResults}
        onRunTests={onRunTests}
      />

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
