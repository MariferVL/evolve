import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import briefingVideo from "../assets/briefing-bg.mp4";

// Styles for the briefing screen
const briefingStyle = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  zIndex: 20,
  backgroundColor: "#05050A",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

// Styles for the video and text container
const videoStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: "100%",
  minHeight: "100%",
  opacity: 0.3,
  filter: "brightness(0.8)",
};

// Styles for the text container
const textContainerStyle = {
  position: "relative",
  zIndex: 2,
  color: "white",
  fontFamily: "monospace",
  textAlign: "center",
  maxWidth: "800px",
  padding: "20px",
};

/**
 * PuzzleBriefing component displays a briefing video and text lines sequentially.
 * It automatically transitions through the lines and navigates to the puzzle screen when done.
 * @param {Object} props - Component properties.
 * @param {Array} props.lines - Array of text lines to display in the briefing.
 * @returns {JSX.Element} The PuzzleBriefing component.
 */
export function PuzzleBriefing({ lines }) {
  const goToPuzzle = useGameStore((state) => state.goToPuzzle);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < lines.length - 1) {
      const timer = setTimeout(() => {
        setCurrentLine(currentLine + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(goToPuzzle, 2500);
      return () => clearTimeout(finalTimer);
    }
  }, [currentLine, goToPuzzle, lines]);

  return (
    <div style={briefingStyle}>
      <video style={videoStyle} src={briefingVideo} autoPlay muted loop />
      <div style={textContainerStyle}>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentLine}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: "clamp(16px, 3vw, 24px)",
              textShadow: "0 0 10px rgba(0, 255, 255, 0.7)",
              margin: 0,
              padding: 0,
              minHeight: "50px",
            }}
          >
            {lines[currentLine]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
