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
      `declare module "react-native" {
        import * as React from "react";
        export interface ViewStyle { flex?: number; flexDirection?: "row"|"column"|"row-reverse"|"column-reverse"; flexWrap?: "wrap"|"nowrap"; justifyContent?: "flex-start"|"flex-end"|"center"|"space-between"|"space-around"|"space-evenly"; alignItems?: "flex-start"|"flex-end"|"center"|"stretch"|"baseline"; alignSelf?: "auto"|"flex-start"|"flex-end"|"center"|"stretch"|"baseline"; width?: number|string; height?: number|string; minWidth?: number|string; maxWidth?: number|string; minHeight?: number|string; maxHeight?: number|string; margin?: number; marginTop?: number; marginBottom?: number; marginLeft?: number; marginRight?: number; marginHorizontal?: number; marginVertical?: number; padding?: number; paddingTop?: number; paddingBottom?: number; paddingLeft?: number; paddingRight?: number; paddingHorizontal?: number; paddingVertical?: number; backgroundColor?: string; borderRadius?: number; borderTopLeftRadius?: number; borderTopRightRadius?: number; borderBottomLeftRadius?: number; borderBottomRightRadius?: number; borderWidth?: number; borderColor?: string; borderStyle?: "solid"|"dotted"|"dashed"; opacity?: number; overflow?: "visible"|"hidden"|"scroll"; position?: "absolute"|"relative"; top?: number; bottom?: number; left?: number; right?: number; zIndex?: number; shadowColor?: string; shadowOffset?: { width: number; height: number }; shadowOpacity?: number; shadowRadius?: number; elevation?: number; }
        export interface TextStyle extends ViewStyle { color?: string; fontSize?: number; fontWeight?: "normal"|"bold"|"100"|"200"|"300"|"400"|"500"|"600"|"700"|"800"|"900"; fontStyle?: "normal"|"italic"; fontFamily?: string; lineHeight?: number; textAlign?: "auto"|"left"|"right"|"center"|"justify"; textDecorationLine?: "none"|"underline"|"line-through"|"underline line-through"; letterSpacing?: number; textTransform?: "none"|"uppercase"|"lowercase"|"capitalize"; }
        export interface ImageStyle extends ViewStyle { resizeMode?: "cover"|"contain"|"stretch"|"repeat"|"center"; }
        export type StyleProp<T> = T | T[] | null | undefined | false;
        export interface ViewProps { style?: StyleProp<ViewStyle>; children?: React.ReactNode; testID?: string; onLayout?: (event: any) => void; pointerEvents?: "box-none"|"none"|"box-only"|"auto"; }
        export interface TextProps { style?: StyleProp<TextStyle>; children?: React.ReactNode; numberOfLines?: number; ellipsizeMode?: "head"|"middle"|"tail"|"clip"; onPress?: () => void; selectable?: boolean; testID?: string; }
        export interface TextInputProps { style?: StyleProp<TextStyle>; value?: string; defaultValue?: string; placeholder?: string; placeholderTextColor?: string; onChangeText?: (text: string) => void; onSubmitEditing?: (event: any) => void; onFocus?: () => void; onBlur?: () => void; secureTextEntry?: boolean; keyboardType?: "default"|"numeric"|"email-address"|"phone-pad"|"decimal-pad"|"url"; autoCapitalize?: "none"|"sentences"|"words"|"characters"; autoCorrect?: boolean; autoFocus?: boolean; multiline?: boolean; numberOfLines?: number; maxLength?: number; editable?: boolean; returnKeyType?: "done"|"go"|"next"|"search"|"send"; testID?: string; }
        export interface ImageProps { style?: StyleProp<ImageStyle>; source: { uri: string } | number; resizeMode?: "cover"|"contain"|"stretch"|"repeat"|"center"; onLoad?: () => void; onError?: (error: any) => void; testID?: string; }
        export interface ScrollViewProps extends ViewProps { horizontal?: boolean; showsHorizontalScrollIndicator?: boolean; showsVerticalScrollIndicator?: boolean; scrollEnabled?: boolean; onScroll?: (event: any) => void; contentContainerStyle?: StyleProp<ViewStyle>; bounces?: boolean; pagingEnabled?: boolean; keyboardShouldPersistTaps?: "always"|"never"|"handled"; }
        export interface FlatListProps<T> { data: T[] | null; renderItem: (info: { item: T; index: number }) => React.ReactElement | null; keyExtractor?: (item: T, index: number) => string; style?: StyleProp<ViewStyle>; contentContainerStyle?: StyleProp<ViewStyle>; horizontal?: boolean; numColumns?: number; onEndReached?: () => void; onEndReachedThreshold?: number; onRefresh?: () => void; refreshing?: boolean; ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null; ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null; ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null; ItemSeparatorComponent?: React.ComponentType<any> | null; showsVerticalScrollIndicator?: boolean; showsHorizontalScrollIndicator?: boolean; }
        export interface PressableProps { style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>); children?: React.ReactNode | ((state: { pressed: boolean }) => React.ReactNode); onPress?: () => void; onLongPress?: () => void; onPressIn?: () => void; onPressOut?: () => void; disabled?: boolean; testID?: string; }
        export interface TouchableOpacityProps extends ViewProps { onPress?: () => void; onLongPress?: () => void; activeOpacity?: number; disabled?: boolean; }
        export interface ModalProps { visible?: boolean; transparent?: boolean; animationType?: "none"|"slide"|"fade"; onRequestClose?: () => void; children?: React.ReactNode; }
        export interface ActivityIndicatorProps { size?: "small"|"large"|number; color?: string; animating?: boolean; style?: StyleProp<ViewStyle>; }
        export interface StatusBarProps { barStyle?: "default"|"light-content"|"dark-content"; backgroundColor?: string; hidden?: boolean; translucent?: boolean; }
        export interface SwitchProps { value?: boolean; onValueChange?: (value: boolean) => void; disabled?: boolean; trackColor?: { false?: string; true?: string }; thumbColor?: string; style?: StyleProp<ViewStyle>; }
        export const View: React.ComponentType<ViewProps>;
        export const Text: React.ComponentType<TextProps>;
        export const TextInput: React.ComponentType<TextInputProps>;
        export const Image: React.ComponentType<ImageProps>;
        export const ScrollView: React.ComponentType<ScrollViewProps>;
        export function FlatList<T = any>(props: FlatListProps<T>): React.ReactElement | null;
        export const Pressable: React.ComponentType<PressableProps>;
        export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
        export const SafeAreaView: React.ComponentType<ViewProps>;
        export const KeyboardAvoidingView: React.ComponentType<ViewProps & { behavior?: "height"|"position"|"padding"; keyboardVerticalOffset?: number; }>;
        export const Modal: React.ComponentType<ModalProps>;
        export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
        export const StatusBar: React.ComponentType<StatusBarProps>;
        export const Switch: React.ComponentType<SwitchProps>;
        export const TouchableHighlight: React.ComponentType<TouchableOpacityProps & { underlayColor?: string }>;
        export const TouchableWithoutFeedback: React.ComponentType<{ onPress?: () => void; children?: React.ReactNode; disabled?: boolean; }>;
        export const StyleSheet: {
          create<T extends { [key: string]: ViewStyle | TextStyle | ImageStyle }>(styles: T): T;
          flatten(style: any): any;
          hairlineWidth: number;
          absoluteFill: ViewStyle;
          absoluteFillObject: ViewStyle;
        };
        export const Platform: {
          OS: "ios" | "android" | "web";
          Version: number | string;
          isPad: boolean;
          isTVOS: boolean;
          select<T>(specifics: { ios?: T; android?: T; web?: T; default?: T }): T;
        };
        export const Dimensions: {
          get(dim: "window" | "screen"): { width: number; height: number; scale: number; fontScale: number };
          addEventListener(event: "change", handler: (dims: { window: any; screen: any }) => void): { remove: () => void };
        };
        export const Animated: {
          Value: new (value: number) => any;
          ValueXY: new (value?: { x: number; y: number }) => any;
          View: React.ComponentType<ViewProps & { style?: any }>;
          Text: React.ComponentType<TextProps & { style?: any }>;
          Image: React.ComponentType<ImageProps & { style?: any }>;
          ScrollView: React.ComponentType<ScrollViewProps & { style?: any }>;
          timing(value: any, config: { toValue: number; duration?: number; easing?: any; delay?: number; useNativeDriver?: boolean }): any;
          spring(value: any, config: { toValue: number; friction?: number; tension?: number; useNativeDriver?: boolean }): any;
          decay(value: any, config: { velocity: number; deceleration?: number; useNativeDriver?: boolean }): any;
          sequence(animations: any[]): any;
          parallel(animations: any[], config?: { stopTogether?: boolean }): any;
          stagger(time: number, animations: any[]): any;
          loop(animation: any, config?: { iterations?: number }): any;
          event(argMapping: any[], config?: any): any;
        };
        export const Easing: { linear: (t: number) => number; ease: (t: number) => number; quad: (t: number) => number; cubic: (t: number) => number; in(easing: any): any; out(easing: any): any; inOut(easing: any): any; bezier(x1: number, y1: number, x2: number, y2: number): any; };
        export const Alert: { alert(title: string, message?: string, buttons?: Array<{ text: string; onPress?: () => void; style?: "default"|"cancel"|"destructive" }>, options?: any): void; };
        export const Linking: { openURL(url: string): Promise<void>; canOpenURL(url: string): Promise<boolean>; getInitialURL(): Promise<string | null>; addEventListener(type: string, handler: (event: any) => void): void; };
        export const Keyboard: { dismiss(): void; addListener(event: string, callback: Function): { remove: () => void }; };
        export const Haptics: any;
        export function useWindowDimensions(): { width: number; height: number; scale: number; fontScale: number };
        export function useColorScheme(): "light" | "dark" | null;
      }
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
