import { useState } from "react";

const DIFF_COLOR = { easy: "#4ade80", medium: "#fbbf24", hard: "#f87171" };

function CreateChallengeForm({ onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLimit, setTimeLimit] = useState("45");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [reqInput, setReqInput] = useState("");
  const [requirements, setRequirements] = useState([]);
  const [testInput, setTestInput] = useState({ label: "", pattern: "", points: "10" });
  const [testCases, setTestCases] = useState([]);

  function addReq() {
    const v = reqInput.trim();
    if (v) { setRequirements((r) => [...r, v]); setReqInput(""); }
  }

  function addTest() {
    const { label, pattern, points } = testInput;
    if (!label.trim() || !pattern.trim()) return;
    const pts = parseInt(points) || 10;
    const pat = pattern.trim();
    setTestCases((t) => [
      ...t,
      {
        id: `custom-${Date.now()}`,
        label: label.trim(),
        points: pts,
        check: (code) => new RegExp(pat, "i").test(code),
        pattern: pat,
      },
    ]);
    setTestInput({ label: "", pattern: "", points: "10" });
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      id: `custom-${Date.now()}`,
      title: title.trim(),
      difficulty,
      timeLimit: parseInt(timeLimit) || 45,
      tag: tag.trim() || "Custom",
      description: description.trim(),
      endpoint: endpoint.trim(),
      requirements,
      testCases,
      starterFiles: [
        {
          name: "App.tsx",
          accent: "aurora",
          label: "challenge",
          previewTitle: title.trim(),
          previewCopy: "",
          code: `import { View, Text, StyleSheet } from "react-native";\n\nexport default function App() {\n  // TODO: implement the challenge\n  return (\n    <View style={styles.container}>\n      <Text style={styles.text}>${title.trim()}</Text>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: { flex: 1, backgroundColor: "#0f172a", padding: 20 },\n  text: { color: "#f1f5f9", fontSize: 18, fontWeight: "600" },\n});\n`,
        },
      ],
    });
  }

  return (
    <div className="challenge-create-form">
      <div className="challenge-create-header">
        <span>Create Challenge</span>
        <button type="button" className="challenge-back-btn" onClick={onCancel}>← Back</button>
      </div>

      <div className="challenge-form-grid">
        <div className="challenge-form-col">
          <label className="cform-label">Title *</label>
          <input className="cform-input" placeholder="e.g. Job Listings App" value={title} onChange={(e) => setTitle(e.target.value)} />

          <label className="cform-label">Description</label>
          <textarea className="cform-input cform-textarea" placeholder="What should the candidate build?" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />

          <div className="cform-row">
            <div style={{ flex: 1 }}>
              <label className="cform-label">Difficulty</label>
              <select className="cform-input cform-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="cform-label">Time limit (min)</label>
              <input className="cform-input" type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} />
            </div>
          </div>

          <label className="cform-label">Tag (e.g. "API · Lists")</label>
          <input className="cform-input" placeholder="API · Infinite Scroll" value={tag} onChange={(e) => setTag(e.target.value)} />

          <label className="cform-label">API Endpoint (optional)</label>
          <input className="cform-input" placeholder="https://api.example.com/data" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
        </div>

        <div className="challenge-form-col">
          <label className="cform-label">Requirements</label>
          <div className="cform-add-row">
            <input className="cform-input" placeholder="e.g. Show loading indicator" value={reqInput} onChange={(e) => setReqInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addReq()} />
            <button type="button" className="cform-add-btn" onClick={addReq}>+</button>
          </div>
          <div className="cform-list">
            {requirements.map((r, i) => (
              <div key={i} className="cform-chip">
                <span>{r}</span>
                <button type="button" onClick={() => setRequirements((prev) => prev.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>

          <label className="cform-label" style={{ marginTop: 12 }}>Test Cases</label>
          <div className="cform-test-inputs">
            <input className="cform-input" placeholder="Label (e.g. FlatList used)" value={testInput.label} onChange={(e) => setTestInput((t) => ({ ...t, label: e.target.value }))} />
            <input className="cform-input" placeholder="Regex pattern (e.g. FlatList)" value={testInput.pattern} onChange={(e) => setTestInput((t) => ({ ...t, pattern: e.target.value }))} />
            <div className="cform-add-row">
              <input className="cform-input" type="number" placeholder="Points" style={{ width: 80 }} value={testInput.points} onChange={(e) => setTestInput((t) => ({ ...t, points: e.target.value }))} />
              <button type="button" className="cform-add-btn" onClick={addTest}>+ Add test</button>
            </div>
          </div>
          <div className="cform-list">
            {testCases.map((t, i) => (
              <div key={i} className="cform-chip">
                <span>{t.label} <em style={{ opacity: 0.6 }}>({t.points}pts · /{t.pattern}/)</em></span>
                <button type="button" onClick={() => setTestCases((prev) => prev.filter((_, j) => j !== i))}>✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cform-footer">
        <button type="button" className="cform-save-btn" onClick={handleSave} disabled={!title.trim()}>
          Save Challenge
        </button>
      </div>
    </div>
  );
}

export default function ChallengeModal({ challenges, onStart, onClose, onAddChallenge }) {
  const [selected, setSelected] = useState(challenges[0] ?? null);
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <div className="modal-overlay" onClick={() => {}}>
        <div className="challenge-modal-card">
          <button type="button" className="modal-close" style={{ position: "absolute", top: 16, right: 16 }} onClick={onClose}>✕</button>
          <CreateChallengeForm
            onSave={(ch) => { onAddChallenge(ch); setCreating(false); setSelected(ch); }}
            onCancel={() => setCreating(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="challenge-modal-card">
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        <div className="challenge-modal-layout">
          {/* Left: challenge list */}
          <div className="challenge-list-col">
            <div className="challenge-list-header">
              <span>Challenges</span>
              <button type="button" className="challenge-new-btn" onClick={() => setCreating(true)}>+ New</button>
            </div>
            {challenges.map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`challenge-list-item${selected?.id === ch.id ? " is-active" : ""}`}
                onClick={() => setSelected(ch)}
              >
                <span className="challenge-item-title">{ch.title}</span>
                <div className="challenge-item-meta">
                  <span className="challenge-diff-badge" style={{ color: DIFF_COLOR[ch.difficulty] }}>{ch.difficulty}</span>
                  <span className="challenge-item-time">{ch.timeLimit}min</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: detail */}
          {selected && (
            <div className="challenge-detail-col">
              <div className="challenge-detail-scrollable">
                <div className="challenge-detail-tag">{selected.tag}</div>
                <h2 className="challenge-detail-title">{selected.title}</h2>
                <p className="challenge-detail-desc">{selected.description}</p>

                {selected.endpoint && (
                  <div className="challenge-endpoint">
                    <span className="challenge-endpoint-label">Endpoint</span>
                    <code>{selected.endpoint}</code>
                  </div>
                )}

                <div className="challenge-section-label">Requirements</div>
                <ul className="challenge-req-list">
                  {selected.requirements.map((r, i) => (
                    <li key={i} className="challenge-req-item">
                      <span className="challenge-req-dot" />
                      {r}
                    </li>
                  ))}
                </ul>

                <div className="challenge-section-label">
                  Test cases <span className="challenge-points-total">({selected.testCases.reduce((s, t) => s + t.points, 0)} pts)</span>
                </div>
                <div className="challenge-test-list">
                  {selected.testCases.map((t) => (
                    <div key={t.id} className={`challenge-test-item${t.group === "practice" ? " test-item-practice" : ""}`}>
                      <span className="challenge-test-dot" />
                      <span>{t.label}</span>
                      {t.group === "practice" && <span className="challenge-test-tag">best practice</span>}
                      <span className="challenge-test-pts">{t.points}pts</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="challenge-detail-footer">
                <div className="challenge-footer-meta">
                  <span className="challenge-diff-badge" style={{ color: DIFF_COLOR[selected.difficulty] }}>{selected.difficulty}</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>·</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{selected.timeLimit} min</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>·</span>
                  <span style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{selected.testCases.length} tests</span>
                </div>
                <button type="button" className="challenge-start-btn" onClick={() => onStart(selected)}>
                  Start Challenge →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
