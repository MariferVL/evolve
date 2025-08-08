// CommunicationPuzzle.jsx
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PuzzleLayout } from "./PuzzleLayout";
import { PuzzleUI } from "./PuzzleUI";
import { useGameStore } from "../store/useGameStore";

/**
 * CommunicationPuzzle
 * - Forces a landscape-sized canvas by swapping width/height when needed.
 * - Centers the canvas and keeps pointer events working.
 * - Passes computed landscape dimensions to PuzzleLayout for responsive layout.
 */
export function CommunicationPuzzle() {
  const [viewport, setViewport] = useState({
    vw: Math.max(window.innerWidth, window.innerHeight),
    vh: Math.min(window.innerWidth, window.innerHeight),
  });

  useEffect(() => {
    function onResize() {
      setViewport({
        vw: Math.max(window.innerWidth, window.innerHeight),
        vh: Math.min(window.innerWidth, window.innerHeight),
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const buttonStyle = {
    padding: "10px 25px",
    fontSize: "1rem",
    color: "#50d9ffff",
    backgroundColor: "transparent",
    border: "2px solid #50d9ffff",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    pointerEvents: "auto",
  };

  const [gameStatus, setGameStatus] = useState("");
  const returnToAltar = useGameStore((s) => s.returnToAltar);

  // container style ensures no scrollbars and centers the swapped-dimension canvas
  const containerStyle = {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "#05050A",
  };

  // Canvas style uses the swapped dims: vw is always the longer side (landscape)
  const canvasStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: `${viewport.vw}px`,
    height: `${viewport.vh}px`,
    touchAction: "none", // improve touch dragging
  };

  return (
    <div className="scene-container" style={containerStyle}>
      <Canvas style={canvasStyle} pixelRatio={Math.min(window.devicePixelRatio, 2)}>
        <color attach="background" args={["#05050A"]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.6} />

        <PuzzleLayout
          setGameStatus={setGameStatus}
          landscapeWidth={viewport.vw}
          landscapeHeight={viewport.vh}
        />

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>

      <PuzzleUI
        title="Constellation I: The Interface Core"
        subtitle="Match the solution to the user challenge."
        status={gameStatus}
        buttonStyle={buttonStyle}
        onReturn={returnToAltar}
      />
    </div>
  );
}
