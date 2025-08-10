import { useMemo, useState, useEffect } from "react";
import { useGameStore } from "../store/useGameStore";
import CrucibleCard from "./CrucibleCard";

/**
 * CrucibleOfChance
 * - Simple decision mini-game: player picks one of three paths.
 * - Each path has a probability of success and a reward description.
 * - On success: collectEssence(1) and return to altar after short delay.
 * - On failure: show failure feedback and allow retry.
 */
export default function CrucibleOfChance() {
  const activeEssenceId = useGameStore((s) => s.activeEssenceId);
  const collectEssence = useGameStore((s) => s.collectEssence);
  const returnToAltar = useGameStore((s) => s.returnToAltar);

    // Ensure Crucible is only available when no essence is active
  const [result, setResult] = useState(null); // null | { success: boolean, chosen: idx }
  const [busy, setBusy] = useState(false);

    // Crucible options with odds and rewards
  const options = useMemo(
    () => [
      { id: "A", label: "Safe Route", odds: 0.75, reward: "+ small reward" },
      { id: "B", label: "Trade Route", odds: 0.5, reward: "++ medium reward" },
      { id: "C", label: "High-Risk", odds: 0.25, reward: "+++ big reward" },
    ],
    []
  );

    // Ensure Crucible is only available when no essence is active
  const handleChoose = (idx) => {
    if (busy) return;
    setBusy(true);
    setResult(null);

    // Small delay for UX (card press animation)
    setTimeout(() => {
      const opt = options[idx];
      const roll = Math.random();
      const success = roll <= opt.odds;

      setResult({ success, chosen: idx });

      if (success) {
        // Collect essence 1 (Crucible reward)
        collectEssence(1);

        // Keep success visible 2s then return to altar
        setTimeout(() => {
          returnToAltar();
        }, 1800);
      } else {
        // Failure: allow retry after short cooldown
        setTimeout(() => {
          setBusy(false);
        }, 900);
      }
    }, 400);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.75))",
      zIndex: 100,
      pointerEvents: "auto",
      padding: 20
    }}>
      <div style={{ width: "min(1100px, 96%)", textAlign: "center", color: "#E7E7FF", fontFamily: "monospace" }}>
        <h2 style={{ margin: "6px 0 8px", fontSize: 22 }}>The Crucible of Chance</h2>
        <p style={{ margin: "0 0 18px", color: "rgba(230,230,255,0.85)" }}>
          Choose a path. Odds and rewards are shown. Success grants the Essence of Strategic Calculation.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          {options.map((opt, i) => (
            <CrucibleCard
              key={opt.id}
              index={i}
              label={opt.label}
              odds={opt.odds}
              reward={opt.reward}
              disabled={busy}
              result={result && result.chosen === i ? result : null}
              onChoose={() => handleChoose(i)}
            />
          ))}
        </div>

        {/* Result message */}
        {result && (
          <div aria-live="polite" role="status" style={{ marginTop: 18, fontWeight: 700 }}>
            {result.success ? "Success — Essence Acquired" : "Failure — Try another path"}
          </div>
        )}

        {/* Small note */}
        <div style={{ marginTop: 10, fontSize: 12, color: "rgba(200,200,255,0.6)" }}>
          Tip: higher reward → lower odds. Choose wisely.
        </div>
      </div>
    </div>
  );
}
