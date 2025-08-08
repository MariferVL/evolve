/**
 * PuzzleUI Component
 * Displays a puzzle interface with a title, subtitle, status message, and a return button.
 * @param {Object} props - Component properties
 * @param {string} props.title - The title of the puzzle.
 * @param {string} props.subtitle - The subtitle of the puzzle.
 * @param {string} [props.status] - The current status of the puzzle, displayed
 * at the bottom.
 * @param {Function} props.onReturn - Callback function to handle return button click.
 * @param {Object} [props.buttonStyle] - Custom style for the return button.
 * @returns {JSX.Element} - The PuzzleUI component.
 */
export function PuzzleUI({ title, subtitle, status, onReturn, buttonStyle }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10,
        pointerEvents: "none",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "4%",
          width: "100%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(18px, 2.2vw, 26px)",
            margin: 0,
            opacity: 0.95,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "clamp(12px, 1.4vw, 16px)",
            margin: 0,
            color: "#aaa",
          }}
        >
          {subtitle}
        </p>
      </div>

      {status && (
        <div
          style={{
            position: "absolute",
            bottom: "4%",
            width: "100%",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontSize: "clamp(16px, 2.4vw, 22px)",
              color: "#D1FF50",
              textShadow: "0 0 10px #D1FF50",
            }}
          >
            {status}
          </p>
          <div style={{ pointerEvents: "auto", display: "inline-block" }}>
            <button onClick={onReturn} style={buttonStyle}>
              Return to Altar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
