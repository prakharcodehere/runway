import { useRef, useEffect, useCallback } from "react";
import Editor from "@monaco-editor/react";

const LANG_MAP = { tsx: "typescript", ts: "typescript", js: "javascript", jsx: "javascript", json: "json" };
const getLang = (name) => LANG_MAP[name.split(".").at(-1)] ?? "plaintext";

function setupTheme(monaco) {
  monaco.editor.defineTheme("runway", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword",   foreground: "8ea5ff", fontStyle: "bold" },
      { token: "string",    foreground: "7cf7c9" },
      { token: "comment",   foreground: "5c6f81", fontStyle: "italic" },
      { token: "type",      foreground: "ff9b71" },
      { token: "number",    foreground: "ffd083" },
      { token: "tag",       foreground: "8ea5ff" },
    ],
    colors: {
      "editor.background":                   "#0d1117",
      "editor.foreground":                   "#e6edf3",
      "editorLineNumber.foreground":         "#3d4450",
      "editorLineNumber.activeForeground":   "#8b949e",
      "editor.lineHighlightBackground":      "#161b22",
      "editor.lineHighlightBorder":          "#00000000",
      "editorCursor.foreground":             "#7cf7c9",
      "editor.selectionBackground":          "#1d3244",
      "editor.inactiveSelectionBackground":  "#1d324499",
      "editorIndentGuide.background1":       "#21262d",
      "editorIndentGuide.activeBackground1": "#3d444d",
      "editorWidget.background":             "#1c2128",
      "editorWidget.border":                 "#30363d",
      "editorSuggestWidget.background":      "#1c2128",
      "editorSuggestWidget.border":          "#30363d",
      "editorSuggestWidget.selectedBackground": "#1d3244",
      "input.background":                    "#0d1117",
      "input.border":                        "#30363d",
      "focusBorder":                         "#7cf7c9",
      "scrollbarSlider.background":          "#30363d55",
      "scrollbarSlider.hoverBackground":     "#30363d99",
    },
  });
}

// Simple debounce — avoids lodash dependency
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export default function IdeEditor({ files, activeFile, fileContents, onFileSelect, onFileChange, onSave }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const modelsRef = useRef({});  // Monaco models keyed by filename

  // Debounced change handler — avoids state storm on every keystroke
  const debouncedChange = useRef(debounce((name, value) => onFileChange(name, value), 150));
  useEffect(() => {
    debouncedChange.current = debounce((name, value) => onFileChange(name, value), 150);
  }, [onFileChange]);

  // Keep callbacks in refs so the stable handleMount closure always calls the latest version
  const onSaveRef = useRef(onSave);
  const onFileChangeRef = useRef(onFileChange);
  useEffect(() => { onSaveRef.current = onSave; }, [onSave]);
  useEffect(() => { onFileChangeRef.current = onFileChange; }, [onFileChange]);

  const handleMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    setupTheme(monaco);
    monaco.editor.setTheme("runway");

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      // Don't error on missing type declarations for RN/Expo packages
      noImplicitAny: false,
      strict: false,
    });

    // Suppress "Cannot find module" (2307) and similar resolution errors
    // that fire for react-native, expo-*, etc. — these are valid at runtime
    // but not installed in this browser-side virtual workspace.
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
      diagnosticCodesToIgnore: [
        2307, // Cannot find module '...'
        2304, // Cannot find name '...'
        2305, // Module '...' has no exported member
        7016, // Could not find a declaration file for module
        2792, // Cannot find module — alternative code
        2874, // JSX requires React in scope
        2875, // JSX requires react/jsx-runtime
        2786, // Component cannot be used as JSX element
        2322, // Type not assignable (RN style props)
        17004, // JSX element type does not have call signatures
      ],
    });

    // Inject ambient declarations so React + react-native imports don't show red squiggles
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "react" {
        var React: any; export = React; export as namespace React;
        export function useState<T>(init: T): [T, (v: T) => void];
        export function useEffect(fn: () => any, deps?: any[]): void;
        export function useCallback<T extends Function>(fn: T, deps: any[]): T;
        export function useRef<T>(init?: T): { current: T };
        export function useMemo<T>(fn: () => T, deps: any[]): T;
        export function useContext<T>(ctx: any): T;
        export function createContext<T>(def?: T): any;
        export function memo<T>(c: T): T;
        export function forwardRef<T, P>(fn: (props: P, ref: any) => any): any;
        export function createElement(t: any, p?: any, ...c: any[]): any;
        export const Fragment: any;
        namespace JSX { interface Element {} interface IntrinsicElements { [k: string]: any } }
      }`,
      "ts:react.d.ts"
    );
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module "react-native" { const RN: any; export = RN; }
       declare module "expo-status-bar" { export const StatusBar: any; }
       declare module "expo-*" { const M: any; export = M; }
       declare module "@expo/*" { const M: any; export = M; }`,
      "ts:react-native.d.ts"
    );

    // Create models for all current files and set the active one
    files.forEach((f) => {
      const uri = monaco.Uri.parse(`file:///${f.name}`);
      if (!monaco.editor.getModel(uri)) {
        modelsRef.current[f.name] = monaco.editor.createModel(
          fileContents[f.name] ?? f.code,
          getLang(f.name),
          uri
        );
      } else {
        modelsRef.current[f.name] = monaco.editor.getModel(uri);
      }
    });

    editor.setModel(modelsRef.current[activeFile]);

    // Ctrl/Cmd+S → flush content + immediate preview refresh
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      const name = editor.getModel()?.uri.path.slice(1);
      if (name) onFileChangeRef.current?.(name, editor.getValue());
      onSaveRef.current?.();
    });

    // Listen to content changes on the active model
    editor.onDidChangeModelContent(() => {
      const name = editor.getModel()?.uri.path.slice(1); // strip leading /
      if (name) debouncedChange.current(name, editor.getValue());
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — intentionally stable

  // Switch model without remounting the editor
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;

    // Create model if it doesn't exist yet (newly created file)
    if (!modelsRef.current[activeFile]) {
      const f = files.find((f) => f.name === activeFile);
      if (f) {
        const uri = monaco.Uri.parse(`file:///${activeFile}`);
        modelsRef.current[activeFile] = monaco.editor.createModel(
          fileContents[activeFile] ?? f.code,
          getLang(activeFile),
          uri
        );
      }
    }

    if (modelsRef.current[activeFile]) {
      editor.setModel(modelsRef.current[activeFile]);
      editor.focus();
    }
  }, [activeFile, files, fileContents]);

  return (
    <div className="ide-center">
      <div className="ide-tabs">
        {files.map((f) => (
          <button
            key={f.name}
            type="button"
            className={`ide-tab${f.name === activeFile ? " is-active" : ""}`}
            onClick={() => onFileSelect(f.name)}
          >
            <span className={`tab-dot ${f.accent}`} />
            {f.name.split("/").at(-1)}
          </button>
        ))}
      </div>

      <div className="ide-editor-wrap">
        <div className="ide-editor-body">
          {/* No key prop — editor stays mounted, only the model switches */}
          <Editor
            defaultValue={fileContents[activeFile] ?? files[0]?.code ?? ""}
            language={getLang(activeFile)}
            onMount={handleMount}
            loading={
              <div className="editor-loading">
                <div className="editor-loading-dot" />
                <div className="editor-loading-dot" />
                <div className="editor-loading-dot" />
              </div>
            }
            options={{
              fontSize: 13,
              fontFamily: '"IBM Plex Mono", "Fira Code", "Cascadia Code", monospace',
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "gutter",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              fontLigatures: true,
              wordWrap: "on",
              bracketPairColorization: { enabled: true },
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: { verticalScrollbarSize: 5, horizontalScrollbarSize: 5 },
              glyphMargin: false,
              folding: true,
              renderWhitespace: "none",
              quickSuggestions: { other: true, comments: false, strings: false },
              parameterHints: { enabled: true },
              autoClosingBrackets: "languageDefined",
              autoClosingQuotes: "languageDefined",
              tabSize: 2,
              // Performance
              renderValidationDecorations: "on",
              formatOnPaste: false,
              formatOnType: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
