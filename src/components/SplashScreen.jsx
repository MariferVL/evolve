import { useGameStore } from '../store/useGameStore';
import { motion } from 'framer-motion';

/**
 * Inline styles for the splash screen container.
 * Uses centered layout and high contrast for visual impact.
 */
const splashStyle = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#0F0F0F',  
  color: '#F0F0F0',            
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 100,
  textAlign: 'center',         
};

/**
 * Style for the "Start Game" button.
 * Designed to be visually distinct and interactive.
 */
const buttonStyle = {
  padding: '15px 30px',
  fontSize: '1.5rem',
  color: '#D1FF50',            
  backgroundColor: 'transparent',
  border: '2px solid #D1FF50', 
  borderRadius: '50px',
  cursor: 'pointer',
  marginTop: '30px',
  transition: 'all 0.3s ease', 
};

/**
 * SplashScreen component.
 * Displays the initial view and handles orientation lock before transitioning to intro.
 */
export function SplashScreen() {
  const showIntro = useGameStore((state) => state.showIntro);

  // Attempt to lock screen orientation to landscape (mobile only)
  const handleStart = async () => {
    try {
      if (window.screen && window.screen.orientation && window.screen.orientation.lock) {
        await window.screen.orientation.lock('landscape');
      }
    } catch (err) {
      console.error('Could not lock orientation (expected on desktop):', err);
    }

    // Transition to intro scene
    showIntro();
  };

  return (
    <motion.div 
      style={splashStyle} 
      exit={{ opacity: 0, transition: { duration: 1 } }} // Fade out on exit
    >
      <h1>Evolve: Marifer’s Legacy</h1>
      <p style={{ marginBottom: '20px', color: '#A0A0A0' }}>
        An interactive journey
      </p>
      <button
        style={buttonStyle}
        onClick={handleStart}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(209, 255, 80, 0.2)'} 
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        Start Game
      </button>
    </motion.div>
  );
}
