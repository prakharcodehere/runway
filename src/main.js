import "./styles.css";

const app = document.querySelector("#app");

const files = [
  {
    name: "App.tsx",
    label: "entry",
    accent: "aurora",
    previewTitle: "Onboarding Pulse",
    previewCopy:
      "A kinetic mobile welcome flow with parallax cards, adaptive glow, and runtime-safe gradients.",
    code: `import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { CommandDeck } from "./components/CommandDeck";
import { SignalCard } from "./components/SignalCard";

const features = [
  "Instant React Native Web preview",
  "Expo phone handoff",
  "Live session telemetry",
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#07111f" }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ padding: 24, gap: 18 }}>
        <Text style={{ color: "#f4efe7", fontSize: 32, fontWeight: "700" }}>
          Runway
        </Text>
        <Text style={{ color: "#87a4c2", fontSize: 15, lineHeight: 24 }}>
          Build mobile ideas in-browser, then push them straight to Expo Go.
        </Text>
        <CommandDeck title="Session live" subtitle="Preview runtime synced" />
        {features.map((item) => (
          <SignalCard key={item} label={item} tone="cyan" />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}`,
  },
  {
    name: "components/CommandDeck.tsx",
    label: "ui",
    accent: "ember",
    previewTitle: "Command Deck",
    previewCopy:
      "The control surface keeps restart, share, logs, and device handoff visible without crowding the coding loop.",
    code: `import { Pressable, Text, View } from "react-native";

type CommandDeckProps = {
  title: string;
  subtitle: string;
};

const actions = [
  { label: "Run Preview", tone: "#7cf7c9" },
  { label: "Open Logs", tone: "#ff9b71" },
  { label: "Pair Session", tone: "#86a8ff" },
];

export function CommandDeck({ title, subtitle }: CommandDeckProps) {
  return (
    <View
      style={{
        borderRadius: 28,
        padding: 20,
        backgroundColor: "rgba(11, 25, 42, 0.96)",
        borderWidth: 1,
        borderColor: "rgba(124, 247, 201, 0.14)",
        gap: 16,
      }}
    >
      <Text style={{ color: "#f4efe7", fontSize: 22, fontWeight: "700" }}>
        {title}
      </Text>
      <Text style={{ color: "#93aac3", fontSize: 14 }}>{subtitle}</Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            style={{
              flex: 1,
              minHeight: 52,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.03)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: action.tone, fontWeight: "600" }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}`,
  },
  {
    name: "hooks/useSessionSignal.ts",
    label: "logic",
    accent: "cobalt",
    previewTitle: "Session Signal",
    previewCopy:
      "Session state rolls through warmup, hot reload, and device sync phases so the IDE always explains what is happening.",
    code: `import { useEffect, useMemo, useState } from "react";

const phases = [
  "Booting workspace",
  "Warming preview runtime",
  "Connected to Expo relay",
  "Hot reload stable",
];

export function useSessionSignal() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhaseIndex((current) => (current + 1) % phases.length);
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return useMemo(
    () => ({
      phase: phases[phaseIndex],
      sessionId: "flux-rn-2048",
      deviceCount: 2,
      websocket: "stable",
    }),
    [phaseIndex]
  );
}`,
  },
  {
    name: "app.json",
    label: "config",
    accent: "mint",
    previewTitle: "Expo Bridge",
    previewCopy:
      "The Expo bridge is staged as a first-class feature, ready for QR handoff and future custom clients.",
    code: `{
  "expo": {
    "name": "Runway Prototype",
    "slug": "runway-prototype",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "runway",
    "plugins": [],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "sessionRuntime": "preview-web+expo",
      "cloudAndroid": "phase-2"
    }
  }
}`,
  },
];

const bootSteps = [
  {
    label: "Hydrating workspace shell",
    copy: "Mounting editor chrome, signals, and session memory.",
  },
  {
    label: "Calibrating preview runtime",
    copy: "Locking React Native Web viewport to mobile-safe proportions.",
  },
  {
    label: "Routing Expo device bridge",
    copy: "Preparing handoff flow for real-phone validation.",
  },
  {
    label: "Opening Flux corridor",
    copy: "Streaming the creative cockpit into focus.",
  },
];

const logTemplates = [
  "metro: compiled workspace bundle in 184 ms",
  "preview: react-native-web surface refreshed",
  "device: expo relay heartbeat stable",
  "session: observer link signed and ready",
  "runtime: hooks recalculated without warnings",
  "cloud-android: standby lane reserved for phase two",
];

const previewPresets = [
  { id: "mini", label: "Mini", className: "device-mini" },
  { id: "pro", label: "Pro", className: "device-pro" },
  { id: "fold", label: "Fold", className: "device-fold" },
];

app.innerHTML = `
  <div class="experience-shell">
    <div class="ambient ambient-a"></div>
    <div class="ambient ambient-b"></div>
    <div class="noise-layer"></div>

    <section class="boot-overlay">
      <div class="boot-backdrop">
        <div class="boot-orbit boot-orbit-a"></div>
        <div class="boot-orbit boot-orbit-b"></div>
        <div class="boot-grid"></div>
      </div>
      <div class="boot-panel">
        <div class="boot-badge">React Native cockpit</div>
        <h1>Runway</h1>
        <p class="boot-copy" data-boot-copy>${bootSteps[0].copy}</p>
        <div class="boot-progress-shell">
          <div class="boot-progress-label">
            <span data-boot-label>${bootSteps[0].label}</span>
            <span data-boot-percent>06%</span>
          </div>
          <div class="boot-progress-track">
            <div class="boot-progress-bar" data-boot-bar></div>
          </div>
        </div>
        <div class="boot-capabilities">
          <span>Instant preview</span>
          <span>Expo handoff</span>
          <span>Session telemetry</span>
          <span>Share-ready links</span>
        </div>
      </div>
    </section>

    <main class="workspace-shell" aria-hidden="true">
      <header class="topbar">
        <div class="brand-block">
          <div class="brand-mark">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div>
            <p class="eyebrow">Browser IDE for React Native</p>
            <h2>Runway</h2>
          </div>
        </div>

        <div class="session-pill">
          <span class="status-dot"></span>
          <span>Session live</span>
          <strong>flux-rn-2048</strong>
        </div>

        <div class="top-actions">
          <button type="button" data-action="share">Share Session</button>
          <button type="button" data-action="expo" class="accent">Launch Expo</button>
        </div>
      </header>

      <section class="command-ribbon">
        <article>
          <span>Preview runtime</span>
          <strong>React Native Web / 58 FPS</strong>
        </article>
        <article>
          <span>Phone bridge</span>
          <strong>2 devices attached</strong>
        </article>
        <article>
          <span>Cloud Android</span>
          <strong>Queued as premium lane</strong>
        </article>
        <article>
          <span>Observer mode</span>
          <strong>Read-only link armed</strong>
        </article>
      </section>

      <section class="cockpit-grid">
        <aside class="project-rail panel">
          <div class="panel-heading">
            <span class="eyebrow">Project Atlas</span>
            <button type="button">New Template</button>
          </div>

          <div class="template-card">
            <div>
              <span class="template-chip">Starter</span>
              <h3>Neon Commerce Flow</h3>
            </div>
            <p>Fast mobile-first scaffold with auth, cards, and gesture-safe layout primitives.</p>
          </div>

          <div class="section-label">Workspace files</div>
          <div class="file-list" data-file-list></div>

          <div class="rail-footer">
            <div>
              <span class="section-label">Save mode</span>
              <strong>Autosave + snapshots</strong>
            </div>
            <div>
              <span class="section-label">Share link</span>
              <strong>flux.dev/s/aurora</strong>
            </div>
          </div>
        </aside>

        <section class="center-column">
          <div class="hero-panel panel">
            <div>
              <span class="eyebrow">Experience layer</span>
              <h3>Design the app, watch it move, then hand it to a phone.</h3>
            </div>
            <p>
              Runway compresses ideation, coding, runtime feedback, and device validation into one continuous surface.
            </p>
          </div>

          <section class="editor-panel panel">
            <div class="editor-header">
              <div class="tab-strip" data-tab-strip></div>
              <div class="editor-actions">
                <button type="button" data-action="restart">Restart</button>
                <button type="button" data-action="logs">Logs</button>
              </div>
            </div>

            <div class="editor-meta">
              <span class="signal-badge" data-active-label>entry</span>
              <span>Type-safe React Native scaffold</span>
            </div>

            <div class="editor-surface">
              <div class="line-rail" data-line-rail></div>
              <pre class="code-block" data-code-block></pre>
            </div>
          </section>
        </section>

        <aside class="device-column">
          <section class="panel preview-panel">
            <div class="panel-heading">
              <div>
                <span class="eyebrow">Live Preview</span>
                <h3 data-preview-title>${files[0].previewTitle}</h3>
              </div>
              <div class="preset-switch" data-preset-switch></div>
            </div>

            <div class="device-frame device-pro" data-device-frame>
              <div class="device-screen">
                <div class="screen-glow"></div>
                <div class="screen-content">
                  <div class="screen-badge">Preview synced</div>
                  <h4 data-preview-heading>Flux onboarding runtime</h4>
                  <p data-preview-copy>${files[0].previewCopy}</p>
                  <div class="mini-stack">
                    <span>Hot reload</span>
                    <span>Expo Go</span>
                    <span>Error overlay ready</span>
                  </div>
                  <div class="screen-card">
                    <strong>Build mobile flows at browser speed.</strong>
                    <span>Switch files to see the preview narrative shift.</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="panel bridge-panel">
            <div class="panel-heading">
              <div>
                <span class="eyebrow">Phone Bridge</span>
                <h3>Open on device</h3>
              </div>
              <span class="live-tag">Expo online</span>
            </div>

            <div class="bridge-grid">
              <div class="qr-card">
                <div class="qr-grid" data-qr-grid></div>
                <p>Scan from Expo Go to attach this live session.</p>
              </div>

              <div class="bridge-copy">
                <article>
                  <span>Deep link</span>
                  <strong>runway://session/flux-rn-2048</strong>
                </article>
                <article>
                  <span>Reload speed</span>
                  <strong>~420 ms on attached devices</strong>
                </article>
                <article>
                  <span>Fallback mode</span>
                  <strong>Read-only web preview remains active</strong>
                </article>
              </div>
            </div>
          </section>
        </aside>

        <section class="dock panel">
          <div class="panel-heading">
            <div>
              <span class="eyebrow">Runtime Dock</span>
              <h3>Logs, compiler state, and session motion</h3>
            </div>
            <button type="button" data-action="clear">Clear</button>
          </div>

          <div class="metrics-row">
            <article>
              <span>Render latency</span>
              <strong data-metric="latency">184 ms</strong>
            </article>
            <article>
              <span>Bundle weight</span>
              <strong data-metric="bundle">1.8 MB</strong>
            </article>
            <article>
              <span>Preview health</span>
              <strong data-metric="health">stable</strong>
            </article>
            <article>
              <span>Session observers</span>
              <strong data-metric="observers">03</strong>
            </article>
          </div>

          <div class="log-stream" data-log-stream></div>
        </section>
      </section>
    </main>
  </div>
`;

const state = {
  activeFile: files[0].name,
  activePreset: previewPresets[1].id,
  progress: 6,
};

const bootLabel = app.querySelector("[data-boot-label]");
const bootCopy = app.querySelector("[data-boot-copy]");
const bootPercent = app.querySelector("[data-boot-percent]");
const bootBar = app.querySelector("[data-boot-bar]");
const workspaceShell = app.querySelector(".workspace-shell");
const fileList = app.querySelector("[data-file-list]");
const tabStrip = app.querySelector("[data-tab-strip]");
const codeBlock = app.querySelector("[data-code-block]");
const lineRail = app.querySelector("[data-line-rail]");
const activeLabel = app.querySelector("[data-active-label]");
const previewTitle = app.querySelector("[data-preview-title]");
const previewHeading = app.querySelector("[data-preview-heading]");
const previewCopy = app.querySelector("[data-preview-copy]");
const logStream = app.querySelector("[data-log-stream]");
const presetSwitch = app.querySelector("[data-preset-switch]");
const deviceFrame = app.querySelector("[data-device-frame]");
const qrGrid = app.querySelector("[data-qr-grid]");
const actionButtons = app.querySelectorAll("[data-action]");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function highlightCode(code) {
  const escaped = escapeHtml(code);
  return escaped
    .replace(
      /("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*')/g,
      '<span class="token string">$1</span>'
    )
    .replace(
      /\b(import|from|export|default|const|return|function|type|style|map|true|false)\b/g,
      '<span class="token keyword">$1</span>'
    )
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="token punctuation">$1</span>')
    .replace(/(\/\/.*$)/gm, '<span class="token comment">$1</span>');
}

function renderFileSelectors() {
  fileList.innerHTML = files
    .map(
      (file) => `
        <button
          type="button"
          class="file-item ${file.name === state.activeFile ? "is-active" : ""}"
          data-file-name="${file.name}"
        >
          <span class="file-tone ${file.accent}"></span>
          <span class="file-text">
            <strong>${file.name}</strong>
            <small>${file.label}</small>
          </span>
        </button>
      `
    )
    .join("");

  tabStrip.innerHTML = files
    .map(
      (file) => `
        <button
          type="button"
          class="tab ${file.name === state.activeFile ? "is-active" : ""}"
          data-file-name="${file.name}"
        >
          ${file.name.split("/").at(-1)}
        </button>
      `
    )
    .join("");
}

function renderEditor(file) {
  const lines = file.code.split("\n");
  lineRail.innerHTML = lines.map((_, index) => `<span>${index + 1}</span>`).join("");
  codeBlock.innerHTML = highlightCode(file.code);
  activeLabel.textContent = file.label;
  previewTitle.textContent = file.previewTitle;
  previewHeading.textContent = file.previewTitle;
  previewCopy.textContent = file.previewCopy;
  deviceFrame.setAttribute("data-accent", file.accent);
}

function appendLog(message, tone = "system") {
  const entry = document.createElement("div");
  entry.className = `log-entry tone-${tone}`;
  entry.innerHTML = `
    <span class="log-time">${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}</span>
    <strong>${tone}</strong>
    <p>${message}</p>
  `;
  logStream.prepend(entry);

  const entries = [...logStream.querySelectorAll(".log-entry")];
  entries.slice(10).forEach((node) => node.remove());
}

function renderPresets() {
  presetSwitch.innerHTML = previewPresets
    .map(
      (preset) => `
        <button
          type="button"
          class="${preset.id === state.activePreset ? "is-active" : ""}"
          data-preset-id="${preset.id}"
        >
          ${preset.label}
        </button>
      `
    )
    .join("");
}

function updatePreset(id) {
  state.activePreset = id;
  const preset = previewPresets.find((item) => item.id === id);
  deviceFrame.classList.remove("device-mini", "device-pro", "device-fold");
  deviceFrame.classList.add(preset.className);
  renderPresets();
  appendLog(`viewport switched to ${preset.label} profile`, "preview");
}

function buildQrGrid() {
  const size = 21;
  const cells = [];

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const inFinder =
        (row < 7 && col < 7) ||
        (row < 7 && col > 13) ||
        (row > 13 && col < 7);
      const isDark = inFinder || (row * 7 + col * 11) % 5 === 0 || (row + col) % 9 === 0;
      cells.push(`<span class="${isDark ? "dark" : ""}"></span>`);
    }
  }

  qrGrid.innerHTML = cells.join("");
}

function hydrateWorkspace() {
  renderFileSelectors();
  renderPresets();
  renderEditor(files[0]);
  buildQrGrid();

  [
    "workspace: cinematic shell mounted",
    "editor: active file App.tsx",
    "bridge: QR payload ready for Expo Go",
    "share: observer mode armed",
  ].forEach((message, index) => {
    window.setTimeout(() => appendLog(message, "system"), 350 * (index + 1));
  });
}

function setActiveFile(name) {
  state.activeFile = name;
  renderFileSelectors();

  const file = files.find((item) => item.name === name);
  renderEditor(file);
  appendLog(`editor: opened ${file.name}`, "editor");
}

function startBootSequence() {
  let stepIndex = 0;
  const stepDuration = 900;
  const interval = window.setInterval(() => {
    stepIndex += 1;
    state.progress = Math.min(100, state.progress + 24);
    const step = bootSteps[Math.min(stepIndex, bootSteps.length - 1)];

    bootLabel.textContent = step.label;
    bootCopy.textContent = step.copy;
    bootPercent.textContent = `${String(state.progress).padStart(2, "0")}%`;
    bootBar.style.width = `${state.progress}%`;

    if (stepIndex >= bootSteps.length) {
      window.clearInterval(interval);
      window.setTimeout(() => {
        app.classList.add("is-loaded");
        workspaceShell.setAttribute("aria-hidden", "false");
        hydrateWorkspace();
      }, 450);
    }
  }, stepDuration);
}

fileList.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-file-name]");
  if (!trigger) {
    return;
  }

  setActiveFile(trigger.getAttribute("data-file-name"));
});

tabStrip.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-file-name]");
  if (!trigger) {
    return;
  }

  setActiveFile(trigger.getAttribute("data-file-name"));
});

presetSwitch.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-preset-id]");
  if (!trigger) {
    return;
  }

  updatePreset(trigger.getAttribute("data-preset-id"));
});

actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.getAttribute("data-action");

    if (action === "clear") {
      logStream.innerHTML = "";
      appendLog("dock: logs cleared, telemetry stream still live", "system");
      return;
    }

    const responses = {
      share: "share: signed collaborative link copied to workspace clipboard",
      expo: "device: Expo handoff pinged all attached phones",
      restart: "runtime: preview process restarted without losing editor focus",
      logs: "dock: focused runtime channel and expanded compiler feedback",
    };

    appendLog(responses[action], action);
  });
});

window.setInterval(() => {
  appendLog(logTemplates[Math.floor(Math.random() * logTemplates.length)], "trace");
}, 3600);

startBootSequence();
