import { useGameStore } from "./store/useGameStore";
import { Intro } from "./components/Intro";
import { AltarScene } from "./components/AltarScene";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { CommunicationPuzzle } from "./components/CommunicationPuzzle";
import { PuzzleBriefing } from "./components/PuzzleBriefing";
import CrucibleOfChance from "./components/CrucibleOfChance";

const briefingLinesByEssence = {
  0: [
    "LOCATION: ECHOES OF A PAST CAREER...",
    "SOURCE: SPEECH THERAPY EXPERIENCE",
    "ANALYSIS: To build for humans, you must first understand how they connect. That was my mission then, and it's my mission now.",
    "MISSION: Synchronize the core principles of UI/UX with their root challenges.",
    "",
  ],
  1: [
    "LOCATION: THE CRUCIBLE OF CHANCE",
    "MISSION: Make a strategic choice — weigh odds vs reward.",
    "GOAL: Acquire the Essence of Strategic Calculation.",
    "",
  ],
  2: ["LOCATION: ", "MISSION: ", "GOAL: ", ""],
};
/**
 * Main application component.
 * Renders different scenes based on current game state.
 */
function App() {
  // Access current game state from global store
  const gameState = useGameStore((state) => state.gameState);
  const activeEssenceId = useGameStore((s) => s.activeEssenceId);

  return (
    <>
      {/* AnimatePresence enables smooth transitions between scenes */}
      <AnimatePresence mode="wait">
        {gameState === "splash" && <SplashScreen key="splash" />}
        {gameState === "intro" && <Intro key="intro" />}
      </AnimatePresence>

      {/*  Render components based on game state */}
      {gameState === "game" && <AltarScene />}
      {gameState === "puzzle_briefing" && (
        <PuzzleBriefing
          lines={
            briefingLinesByEssence[activeEssenceId] ?? briefingLinesByEssence[0]
          }
        />
      )}

      {gameState === "puzzle_oracle" &&
        (activeEssenceId === 1 ? (
          <CrucibleOfChance />
        ) : (
          <CommunicationPuzzle />
        ))}
    </>
  );
}

export default App;
