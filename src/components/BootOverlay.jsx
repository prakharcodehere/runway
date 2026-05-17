import { BOOT_STEPS } from "../data";

// Runway edge lights — alternating left/right down the perspective strip
const RUNWAY_LIGHTS = Array.from({ length: 14 }, (_, i) => i);

export default function BootOverlay({ step, progress }) {
  const current = BOOT_STEPS[Math.min(step, BOOT_STEPS.length - 1)];
  const isLiftoff = progress >= 96;

  return (
    <section className="boot-overlay">
      {/* ── Ambient background layers ── */}
      <div className="boot-backdrop" />

      {/* Perspective runway strip */}
      <div className="boot-runway-scene">
        <div className="boot-runway-strip">
          {/* Center dashes */}
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="boot-runway-dash" style={{ "--i": i }} />
          ))}
          {/* Edge lights left */}
          {RUNWAY_LIGHTS.map((i) => (
            <div
              key={`l${i}`}
              className="boot-runway-light boot-runway-light-left"
              style={{ "--i": i, "--delay": `${(i * 0.07).toFixed(2)}s` }}
            />
          ))}
          {/* Edge lights right */}
          {RUNWAY_LIGHTS.map((i) => (
            <div
              key={`r${i}`}
              className="boot-runway-light boot-runway-light-right"
              style={{ "--i": i, "--delay": `${(i * 0.07).toFixed(2)}s` }}
            />
          ))}
          {/* Approach threshold bar */}
          <div className="boot-runway-threshold" />
        </div>
        {/* Heat-shimmer / speed-lines on liftoff */}
        {isLiftoff && <div className="boot-liftoff-blur" />}
      </div>

      {/* Horizon glow */}
      <div className="boot-horizon-glow" />

      {/* ── Main content ── */}
      <div className="boot-panel">
        <div className="boot-badge">
          <span className="boot-badge-dot" />
          Cleared for takeoff
        </div>

        <h1 className="boot-title">
          <span className="glitch" data-text="Runway">Runway</span>
        </h1>
        <p className="boot-copy">{current.copy}</p>

        <div className="boot-progress-shell">
          <div className="boot-progress-label">
            <span>{current.label}</span>
            <span className="boot-pct">{String(progress).padStart(2, "0")}%</span>
          </div>
          <div className="boot-progress-track">
            <div className="boot-progress-bar" style={{ width: `${progress}%` }} />
            <div className="boot-progress-glow" style={{ left: `${progress}%` }} />
          </div>
        </div>

        <div className="boot-capabilities">
          {["Instant preview", "Expo handoff", "Session telemetry", "Share-ready links"].map(
            (cap) => (
              <span key={cap}>{cap}</span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
