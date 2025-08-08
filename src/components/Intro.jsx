import { motion } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import introVideo from '../assets/intro.mp4';

/**
 * Intro component.
 * Plays a full-screen video and transitions to the game scene when finished.
 */
export function Intro() {
  const startGame = useGameStore((state) => state.startGame);

  return (
    <motion.div
      className="intro-container"
      exit={{ opacity: 0, transition: { duration: 1.5 } }} // Smooth fade-out
    >
      <video
        src={introVideo}
        autoPlay
        onEnded={startGame} // Automatically start game after video ends
      />
    </motion.div>
  );
}
