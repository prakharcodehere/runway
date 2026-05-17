import { useState, useEffect, useRef } from "react";

const BASE = { latency: 184, bundle: 1.8 };
const TABS = ["Output", "Terminal", "Problems"];

export default function IdeBottom({ logs, onClearLogs }) {
  const [activeTab, setActiveTab] = useState("Output");
  const [collapsed, setCollapsed] = useState(false);
  const [latency, setLatency] = useState(BASE.latency);
  const contentRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => {
      setLatency(BASE.latency + Math.round((Math.random() - 0.5) * 20));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!collapsed) contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [logs.length, collapsed]);

  return (
    <div className={`ide-bottom${collapsed ? " is-collapsed" : ""}`}>
      {/* Tab bar — always visible */}
      <div className="bottom-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`bottom-tab${activeTab === tab ? " is-active" : ""}`}
            onClick={() => {
              setActiveTab(tab);
              if (collapsed) setCollapsed(false);
            }}
          >
            {tab}
            {tab === "Output" && logs.length > 0 && (
              <span className="bottom-tab-count">{logs.length}</span>
            )}
          </button>
        ))}

        <div className="bottom-spacer" />

        {/* Live metrics — only when expanded */}
        {!collapsed && (
          <div className="bottom-metrics">
            <span className="metric-chip">
              <span className="metric-dot" />
              {latency}ms
            </span>
            <span className="metric-chip">{BASE.bundle.toFixed(1)} MB</span>
            <span className="metric-chip" style={{ color: "var(--cyan)" }}>stable</span>
          </div>
        )}

        {!collapsed && (
          <button type="button" className="bottom-action-btn" onClick={onClearLogs}>
            Clear
          </button>
        )}

        {/* Collapse / expand toggle */}
        <button
          type="button"
          className="bottom-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand panel" : "Collapse panel"}
        >
          {collapsed ? "▲" : "▼"}
        </button>
      </div>

      {/* Collapsible content */}
      <div className="bottom-content-wrap">
        {activeTab === "Output" && (
          <div className="bottom-content" ref={contentRef}>
            {logs.length === 0 ? (
              <span className="bottom-empty">No output yet — press Run to compile.</span>
            ) : (
              logs.map((entry) => (
                <div key={entry.id} className={`log-entry tone-${entry.tone}`}>
                  <span className="log-time">{entry.time}</span>
                  <span className="log-kind">{entry.tone}</span>
                  <span className="log-msg">{entry.message}</span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Terminal" && (
          <div className="bottom-content bottom-terminal" ref={contentRef}>
            <div>
              <span className="term-user">runway</span>
              <span className="term-dir"> ~/project </span>
              <span className="term-branch">⎇ main</span>
            </div>
            <div className="term-line">$ npx expo start --web</div>
            <div className="term-line" style={{ color: "var(--cyan)" }}>
              › Metro waiting on exp://192.168.1.1:8081
            </div>
            <div className="term-line term-dim">
              › Scan the QR code with Expo Go (Android) or Camera (iOS)
            </div>
            <div className="term-line term-dim">
              › Web preview available at http://localhost:8081
            </div>
            <div className="term-cursor">
              <span>$</span>
              <span className="cursor-blink" />
            </div>
          </div>
        )}

        {activeTab === "Problems" && (
          <div className="bottom-content" ref={contentRef}>
            <span className="bottom-empty">✓ No problems detected</span>
          </div>
        )}
      </div>
    </div>
  );
}
