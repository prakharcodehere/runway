import { useState, useEffect, useRef } from "react";

const BASE = { latency: 184, bundle: 1.8 };
const STATIC_TABS = ["Output", "Terminal", "Problems"];

export default function IdeBottom({ logs, onClearLogs, activeChallenge, testResults, onRunTests }) {
  const tabs = activeChallenge ? [...STATIC_TABS, "Tests"] : STATIC_TABS;
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

  useEffect(() => {
    if (activeChallenge) { setActiveTab("Tests"); setCollapsed(false); }
  }, [activeChallenge?.id]);

  const passed = testResults ? Object.values(testResults).filter((s) => s === "pass").length : 0;
  const total = activeChallenge?.testCases?.length ?? 0;
  const score = testResults && activeChallenge
    ? activeChallenge.testCases.filter((t) => testResults[t.id] === "pass").reduce((s, t) => s + t.points, 0)
    : 0;
  const maxScore = activeChallenge?.testCases?.reduce((s, t) => s + t.points, 0) ?? 0;

  return (
    <div className={`ide-bottom${collapsed ? " is-collapsed" : ""}`}>
      <div className="bottom-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`bottom-tab${activeTab === tab ? " is-active" : ""}`}
            onClick={() => { setActiveTab(tab); if (collapsed) setCollapsed(false); }}
          >
            {tab}
            {tab === "Output" && logs.length > 0 && (
              <span className="bottom-tab-count">{logs.length}</span>
            )}
            {tab === "Tests" && total > 0 && testResults && (
              <span className={`bottom-tab-count${passed === total ? " tab-count-pass" : ""}`}>
                {passed}/{total}
              </span>
            )}
          </button>
        ))}

        <div className="bottom-spacer" />

        {!collapsed && activeTab === "Tests" && (
          <button type="button" className="bottom-action-btn test-run-btn" onClick={onRunTests}>
            ▶ Run Tests
          </button>
        )}

        {!collapsed && activeTab !== "Tests" && (
          <>
            <div className="bottom-metrics">
              <span className="metric-chip"><span className="metric-dot" />{latency}ms</span>
              <span className="metric-chip">{BASE.bundle.toFixed(1)} MB</span>
              <span className="metric-chip" style={{ color: "var(--cyan)" }}>stable</span>
            </div>
            <button type="button" className="bottom-action-btn" onClick={onClearLogs}>Clear</button>
          </>
        )}

        <button type="button" className="bottom-toggle" onClick={() => setCollapsed((c) => !c)} title={collapsed ? "Expand panel" : "Collapse panel"}>
          {collapsed ? "▲" : "▼"}
        </button>
      </div>

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
            <div className="term-line term-dim">› Scan the QR code with Expo Go (Android) or Camera (iOS)</div>
            <div className="term-line term-dim">› Web preview available at http://localhost:8081</div>
            <div className="term-cursor"><span>$</span><span className="cursor-blink" /></div>
          </div>
        )}

        {activeTab === "Problems" && (
          <div className="bottom-content" ref={contentRef}>
            <span className="bottom-empty">✓ No problems detected</span>
          </div>
        )}

        {activeTab === "Tests" && activeChallenge && (
          <div className="bottom-content test-panel" ref={contentRef}>
            {!testResults ? (
              <span className="bottom-empty">Press "Run Tests" to evaluate your code.</span>
            ) : (
              <>
                <div className="test-score-bar">
                  <span className="test-score-label">Score</span>
                  <span className="test-score-val">{score} / {maxScore} pts</span>
                  <div className="test-score-track">
                    <div className="test-score-fill" style={{ width: maxScore ? `${(score / maxScore) * 100}%` : "0%" }} />
                  </div>
                </div>
                {activeChallenge.testCases.map((tc) => {
                  const status = testResults[tc.id] ?? "idle";
                  return (
                    <div key={tc.id} className={`test-case-row test-${status}`}>
                      <span className="test-case-icon">
                        {status === "pass" ? "✓" : status === "fail" ? "✕" : "○"}
                      </span>
                      <span className="test-case-label">{tc.label}</span>
                      <span className="test-case-pts">{tc.points}pts</span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
