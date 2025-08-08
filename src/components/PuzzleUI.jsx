export function PuzzleUI({ title, subtitle, status, onReturn, buttonStyle }) {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10, pointerEvents: "none", color: "white", fontFamily: "monospace" }}>
      <div style={{ position: "absolute", top: "5%", width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: "24px", margin: 0, opacity: 0.8 }}>{title}</h1>
        <p style={{ fontSize: "16px", margin: 0, color: "#888" }}>{subtitle}</p>
      </div>

      {status && (
        <div style={{ position: "absolute", bottom: "5%", width: "100%", textAlign: "center" }}>
          <p style={{ fontSize: "20px", color: "#D1FF50", textShadow: "0 0 10px #D1FF50" }}>
            {status}
          </p>
          <button onClick={onReturn} style={buttonStyle}>
            Return to Altar
          </button>
        </div>
      )}
    </div>
  );
}