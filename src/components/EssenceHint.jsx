import styles from "./EssenceHint.module.css";
import { MiniEssence } from "./MiniEssence";

/**
 * EssenceHint Component
 * Displays a hint panel for collecting essences with accessibility features.
 * @param {Object} param0
 * @param {*} param0.show
 * @param {*} param0.nextUncollected
 * @param {*} param0.onDismiss
 * @param {*} param0.prefersReducedMotion
 * @returns {JSX.Element|null} The EssenceHint component or null if not shown.
 */
export function EssenceHint({
  show,
  nextUncollected,
  onDismiss,
  prefersReducedMotion,
}) {
  if (!show || !nextUncollected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-describedby="essence-hint-desc"
      className={styles.root}
    >
      <div className={styles.panel}>
        <div className={styles.orb} aria-hidden="true">
          <MiniEssence color={nextUncollected.color} />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.title}>Claim the Essence</span>
            <span className={styles.counter}>1 / 3</span>
          </div>
          <p id="essence-hint-desc" className={styles.description}>
            Tap the glowing orb to begin a short challenge. Each essence unlocks
            the next — collect all three.
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss hint"
          className={styles.hintButton}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
