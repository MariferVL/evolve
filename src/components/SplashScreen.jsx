import { useEffect, useRef, useState } from "react"; 
import { useGameStore } from "../store/useGameStore";
import { motion } from "framer-motion";
import hoverAudioSrc from "../assets/audios/hover.wav";
import clickAudioSrc from "../assets/audios/click.wav";
import splashBgImage from "../assets/splash-bg.webp";

/**
 * Splash screen container styles.
 * Combines a dark overlay with a background image for cinematic effect.
 */
const splashStyle = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${splashBgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#F0F0F0",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 100,
  textAlign: "center",
};

/** Title styling: bold, glowing, and centered */
const titleStyle = {
  fontSize: "4rem",
  fontWeight: "bold",
  color: "#FFFFFF",
  textShadow: "0 0 8px rgba(209, 255, 80, 0.7), 0 0 12px rgba(209, 255, 80, 0.5)",
  letterSpacing: "2px",
};

/** Subtitle styling: subtle and spaced for readability */
const subtitleStyle = {
  fontSize: "1.2rem",
  color: "#A0A0A0",
  marginTop: "-10px",
  marginBottom: "20px",
};

/** Button styling: vibrant, rounded, and responsive */
const buttonStyle = {
  padding: "15px 30px",
  fontSize: "1.5rem",
  color: "#D1FF50",
  backgroundColor: "transparent",
  border: "2px solid #D1FF50",
  borderRadius: "50px",
  cursor: "pointer",
  marginTop: "30px",
  transition: "all 0.3s ease",
  minWidth: "220px",
  textAlign: "center",
};

/**
 * SplashScreen component.
 * Displays the initial screen with audio feedback and transitions to intro.
 */
export function SplashScreen() {
  const showIntro = useGameStore((state) => state.showIntro);
  const [isLoading, setIsLoading] = useState(false);

  // Audio context and buffers for hover/click sounds
  const audioContext = useRef(null);
  const hoverBuffer = useRef(null);
  const clickBuffer = useRef(null);

  /**
   * Load and decode audio files on mount.
   * Ensures sounds are ready before interaction.
   */
  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadAudio = async (src, bufferRef) => {
      try {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        const decodedAudio = await audioContext.current.decodeAudioData(arrayBuffer);
        bufferRef.current = decodedAudio;
      } catch (err) {
        console.error(`Failed to load or decode audio: ${src}`, err);
      }
    };

    loadAudio(hoverAudioSrc, hoverBuffer);
    loadAudio(clickAudioSrc, clickBuffer);

    // Clean up audio context on unmount
    return () => audioContext.current?.close();
  }, []);

  /**
   * Play a sound from the given buffer.
   * Only plays if audio context is active and buffer is loaded.
   */
  const playSound = (bufferRef) => {
    if (
      !bufferRef.current ||
      !audioContext.current ||
      audioContext.current.state !== "running"
    ) return;

    const source = audioContext.current.createBufferSource();
    source.buffer = bufferRef.current;
    source.connect(audioContext.current.destination);
    source.start(0);
  };

  /**
   * Handles the "Start Game" button click.
   * Plays click sound, locks orientation, and transitions to intro.
   */
  const handleStart = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Resume audio context if suspended (required on some browsers)
    if (audioContext.current.state === "suspended") {
      await audioContext.current.resume();
    }

    playSound(clickBuffer);

    // Delay transition to allow sound and visual feedback
    setTimeout(() => {
      try {
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock("landscape");
        }
      } catch (err) {
        console.error("Could not lock orientation (expected on desktop):", err);
      }

      showIntro();
    }, 700);
  };

  /**
   * Handles hover interaction.
   * Plays hover sound and applies visual feedback.
   */
  const handleMouseEnter = (e) => {
    if (isLoading) return;
    playSound(hoverBuffer);
    e.currentTarget.style.backgroundColor = "rgba(209, 255, 80, 0.2)";
  };

  /** Resets button background on hover exit */
  const handleMouseLeave = (e) => {
    if (isLoading) return;
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <motion.div
      style={splashStyle}
      exit={{ opacity: 0, transition: { duration: 1 } }} // Smooth fade-out
    >
      <h1 style={titleStyle}>Evolve: Marifer’s Legacy</h1>
      <p style={subtitleStyle}>An interactive journey</p>
      <button
        style={buttonStyle}
        onClick={handleStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Start Game"}
      </button>
    </motion.div>
  );
}
