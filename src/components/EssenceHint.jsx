import styles from "./EssenceHint.module.css";

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
        {/* Orb animado */}
        <div
          aria-hidden="true"
          className={`${styles.orb} ${
            !prefersReducedMotion ? styles.pulse : ""
          }`}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="g1" cx="50%" cy="30%">
                <stop offset="0%" stopColor="#E6FFFF" stopOpacity="0.95" />
                <stop offset="65%" stopColor="#8829E7" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#00202A" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            <circle cx="12" cy="12" r="6.2" fill="url(#g1)" />
          </svg>
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
