import { useGameStore } from "./store/useGameStore";
import { Intro } from "./components/Intro";
import { AltarScene } from "./components/AltarScene";
import { SplashScreen } from "./components/SplashScreen";
import { AnimatePresence } from "framer-motion";
import { CommunicationPuzzle } from "./components/CommunicationPuzzle";
import { PuzzleBriefing } from "./components/PuzzleBriefing";

/**
 * Main application component.
 * Renders different scenes based on current game state.
 */
function App() {
  // Access current game state from global store
  const gameState = useGameStore((state) => state.gameState);

  return (
    <>
      {/* AnimatePresence enables smooth transitions between scenes */}
      <AnimatePresence mode="wait">
        {gameState === "splash" && <SplashScreen key="splash" />}
        {gameState === "intro" && <Intro key="intro" />}
      </AnimatePresence>

      {/*  Render components based on game state */}
      {gameState === 'game' && <AltarScene />}
      {gameState === 'puzzle_briefing' && <PuzzleBriefing />}
      {gameState === 'puzzle_oracle' && <CommunicationPuzzle />}
    </>
  );
}

export default App;
