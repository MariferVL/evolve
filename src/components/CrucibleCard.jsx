
/**
 * CrucibleCard Component
 * - Represents a single choice card in the Crucible of Chance mini-game.
 * - Displays the option label, odds, and reward.
 * - Handles user interaction to select the card.   
 * @param {Object} props - Component properties
 * @param {number} props.index - Index of the card
 * @param {string} props.label - Label for the card
 * @param {number} props.odds - Probability of success (0 to 1)
 * @param {string} props.reward - Reward description
 * @param {Function} props.onChoose - Callback to handle card selection
 * @param {boolean} props.disabled - Whether the card is disabled
 * @param {Object} props.result - Result of the last selection (null or { success
 * : boolean, chosen: number })
 * @returns {JSX.Element} Rendered card component       
 */
export default function CrucibleCard({ index, label, odds, reward, onChoose, disabled, result }) {
  const pct = Math.round(odds * 100);
  const success = result ? result.success : null;

  return (
    <button
      onClick={onChoose}
      disabled={disabled}
      aria-label={`${label} - ${pct}% chance`}
      style={{
        width: 240,
        minHeight: 140,
        borderRadius: 14,
        border: "1px solid rgba(150,120,255,0.18)",
        background: "linear-gradient(180deg, rgba(18,6,30,0.6), rgba(8,3,18,0.45))",
        color: "#E8E8FF",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 8px 30px rgba(120,80,255,0.06)",
        outline: "none"
      }}
    >
      <div>
        <div style={{ fontSize: 16, fontWeight: 800 }}>{label}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: "rgba(220,220,255,0.75)" }}>
          Odds: <span style={{ fontWeight: 800 }}>{pct}%</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: "rgba(200,200,255,0.6)" }}>{reward}</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "rgba(200,200,255,0.6)" }}>Risk</div>
        {result ? (
          <div style={{ fontWeight: 800, color: result.success ? "#A8FFB0" : "#FF9EA5" }}>
            {result.success ? "SUCCESS" : "FAIL"}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: "rgba(200,200,255,0.6)" }}>Select</div>
        )}
      </div>
    </button>
  );
}
