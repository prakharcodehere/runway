import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import BootOverlay from "./components/BootOverlay";
import IdeShell from "./components/IdeShell";
import ShareModal from "./components/ShareModal";
import { FILES, BOOT_STEPS, LOG_TEMPLATES } from "./data";
import { generateSrcdoc } from "./utils/livePreview";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [bootStep, setBootStep] = useState(0);
  const [bootProgress, setBootProgress] = useState(6);
  const [activeFile, setActiveFile] = useState(FILES[0].name);
  const [files, setFiles] = useState(FILES);
  const [fileContents, setFileContents] = useState(
    () => Object.fromEntries(FILES.map((f) => [f.name, f.code]))
  );
  const [logs, setLogs] = useState([]);
  const [srcdoc, setSrcdoc] = useState("");
  const [showShare, setShowShare] = useState(false);
  const rootRef = useRef(null);
  const rafRef = useRef(null);

  const addLog = useCallback((message, tone = "system") => {
    setLogs((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        tone,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 24),
    ]);
  }, []);

  // Cursor spotlight via rAF
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const onMove = (e) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        el.style.setProperty("--cx", `${e.clientX}px`);
        el.style.setProperty("--cy", `${e.clientY}px`);
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Boot sequence
  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      step += 1;
      setBootStep(step);
      setBootProgress(Math.min(100, 6 + step * 24));
      if (step >= BOOT_STEPS.length) {
        clearInterval(timer);
        setTimeout(() => {
          setIsLoaded(true);
          setTimeout(() => addLog("workspace: IDE shell mounted", "system"), 300);
          setTimeout(() => addLog("editor: Monaco loaded — App.tsx active", "editor"), 600);
          setTimeout(() => addLog("bridge: Expo QR ready for scan", "system"), 900);
          setTimeout(() => addLog("preview: React Native Web renderer online", "preview"), 1200);
        }, 450);
      }
    }, 900);
    return () => clearInterval(timer);
  }, [addLog]);

  // Random telemetry
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => {
      addLog(LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)], "trace");
    }, 5000);
    return () => clearInterval(timer);
  }, [isLoaded, addLog]);

  // Live preview: regenerate srcdoc 600ms after any file change
  // This is the simplest reliable approach — no ref tricks, no closure issues
  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(() => {
      setSrcdoc(generateSrcdoc(files, fileContents));
    }, 600);
    return () => clearTimeout(t);
  }, [files, fileContents, isLoaded]);

  const handleFileChange = useCallback((name, value) => {
    setFileContents((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFileSelect = useCallback((name) => setActiveFile(name), []);

  const handleNewFile = useCallback((name) => {
    if (!name.trim()) return;
    const isPlaceholder = name.endsWith("/.gitkeep");
    const ext = name.split(".").at(-1);
    const accent =
      ext === "tsx" || ext === "jsx" ? "aurora"
      : ext === "ts"  || ext === "js"  ? "cobalt"
      : "mint";
    const isTsx = ext === "tsx" || ext === "jsx";
    const isTs  = ext === "ts" || ext === "tsx";
    const compName = name.split("/").at(-1).replace(/\.(tsx?|jsx?)$/, "");
    const code = isPlaceholder ? ""
      : isTsx ? `import { View, Text } from "react-native";\n\nexport function ${compName}() {\n  return (\n    <View>\n      <Text>${compName}</Text>\n    </View>\n  );\n}\n`
      : isTs  ? `export function ${compName}() {\n  // TODO\n}\n`
      : `// ${name}\n`;
    const newFile = { name, label: isPlaceholder ? "folder" : "new", accent, code, previewTitle: name, previewCopy: "" };
    setFiles((prev) => [...prev, newFile]);
    setFileContents((prev) => ({ ...prev, [name]: code }));
    if (!isPlaceholder) setActiveFile(name);
    addLog(`editor: created ${name.replace("/.gitkeep", "/")}`, "editor");
  }, [addLog]);

  // Run button: immediate refresh, no debounce
  const handleRun = useCallback(() => {
    setSrcdoc(generateSrcdoc(files, fileContents));
    addLog("metro: compiling workspace bundle…", "system");
    setTimeout(() => addLog("metro: compiled in 184 ms — preview refreshed", "preview"), 400);
  }, [files, fileContents, addLog]);

  const handleAction = useCallback((action) => {
    if (action === "share") { setShowShare(true); return; }
    const msgs = {
      expo: "device: Expo handoff sent to attached phones",
    };
    addLog(msgs[action] ?? action, action);
  }, [addLog]);

  const handleClearLogs = useCallback(() => setLogs([]), []);

  const activeFileData = useMemo(
    () => files.find((f) => f.name === activeFile) ?? files[0],
    [files, activeFile]
  );

  return (
    <div ref={rootRef} className={`root-shell${isLoaded ? " is-loaded" : ""}`}>
      <div className="cursor-spotlight" />
      <BootOverlay step={bootStep} progress={bootProgress} />
      {showShare && (
        <ShareModal
          files={files}
          fileContents={fileContents}
          onClose={() => setShowShare(false)}
        />
      )}
      <IdeShell
        files={files}
        activeFile={activeFile}
        activeFileData={activeFileData}
        fileContents={fileContents}
        srcdoc={srcdoc}
        logs={logs}
        onFileSelect={handleFileSelect}
        onFileChange={handleFileChange}
        onNewFile={handleNewFile}
        onRun={handleRun}
        onAction={handleAction}
        onClearLogs={handleClearLogs}
        onSave={handleRun}
      />
    </div>
  );
}
