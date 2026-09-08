import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Runway crashed:", error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 24,
          background: "#07111f",
          color: "#e2e8f0",
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#f87171" }}>
          Runway hit an unexpected error
        </div>
        <div style={{ color: "#94a3b8", maxWidth: 480, fontSize: 13 }}>
          {this.state.error?.message || "Something went wrong while rendering the IDE."}
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            marginTop: 8,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#1e293b",
            color: "#e2e8f0",
            cursor: "pointer",
          }}
        >
          Reload
        </button>
      </div>
    );
  }
}
