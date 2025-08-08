import { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Suspense } from "react";
import { useGameStore } from "../store/useGameStore";
import { PuzzleUI } from "./PuzzleUI";

/**
 *  LegacyEcho component
 * @description Renders a legacy echo in the communication puzzle scene.
 * @param {*} param0
 * @param {Array} param0.position - The position of the echo in the scene.
 * @param {string} param0.color - The color of the echo.
 * @param {string} param0.label - The label to display above the echo.
 * @returns
 */
function LegacyEcho({ position, color, label }) {
  return (
    <group position={position}>
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.25}
        color="white"
        anchorY="bottom"
        maxWidth={2.5}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * SyncCatalyst component
 * @description Represents a catalyst in the communication puzzle that can be dragged and dropped.
 * @param {*} param0
 * @param {Array} param0.position - The position of the catalyst in the scene.
 * @param {string} param0.color - The color of the catalyst.
 * @param {string} param0.label - The label to display above the catalyst.
 * @param {Function} param0.onPointerDown - Callback function when the catalyst is clicked.
 * @return
 */
function SyncCatalyst({ position, color, label, onPointerDown }) {
  return (
    <group position={position} onPointerDown={onPointerDown}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      <Text
        position={[0, 0, 0.61]}
        fontSize={0.15}
        color="white"
        maxWidth={1}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * CommunicationPuzzle component
 * @description The main component for the communication puzzle scene.
 * @returns
 */
export function CommunicationPuzzle() {
  const buttonStyle = {
    padding: "10px 25px",
    fontSize: "1rem",
    color: "#D1FF50",
    backgroundColor: "transparent",
    border: "2px solid #D1FF50",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    pointerEvents: "auto",
  };

  // State management for catalysts and dragged catalyst
  const [catalysts, setCatalysts] = useState([
    {
      id: 0,
      position: [-4, -2.5, 0],
      color: "#FF00FF",
      label: "Intuitive UI",
      isMatched: false,
    },
    {
      id: 1,
      position: [0, -2.5, 0],
      color: "#9400D3",
      label: "Clear Communication",
      isMatched: false,
    },
    {
      id: 2,
      position: [4, -2.5, 0],
      color: "#00FFFF",
      label: "Accessible Design",
      isMatched: false,
    },
  ]);
  // State for the currently dragged catalyst
  const [draggedCatalyst, setDraggedCatalyst] = useState(null);
  // Echoes that need to be matched with catalysts
  const echoes = [
    {
      id: 2,
      position: [-4, 1.5, 0],
      color: "#00FFFF",
      label: "Complex User Needs",
    },
    {
      id: 0,
      position: [0, 1.5, 0],
      color: "#FF00FF",
      label: "User Frustration",
    },
    {
      id: 1,
      position: [4, 1.5, 0],
      color: "#9400D3",
      label: "Ambiguous Feedback",
    },
  ];
  // State for the game status message
  const [gameStatus, setGameStatus] = useState("");
  // Function to return to the altar, defined in the game store
  const returnToAltar = useGameStore((state) => state.returnToAltar);

  /**
   * Camera controller to set the initial camera position
   * @returns
   */
  function CameraController() {
    const { camera } = useThree();
    useEffect(() => {
      camera.position.set(0, 0, 8);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }, [camera]);
    return null;
  }

  useEffect(() => {
    const allMatched = catalysts.every((c) => c.isMatched);
    if (allMatched) {
      setGameStatus("SYNCHRONIZATION COMPLETE: ESSENCE ACQUIRED");
    }
  }, [catalysts]);

  // Handle pointer move event to update the position of the dragged catalyst
  const handlePointerMove = (e) => {
    if (draggedCatalyst === null) return;
    setCatalysts((currentCatalysts) =>
      currentCatalysts.map((m) =>
        m.id === draggedCatalyst
          ? { ...m, position: [e.point.x, e.point.y, 0.1] }
          : m
      )
    );
  };

  // Handle pointer up event to check if the catalyst is dropped near the echo
  const handlePointerUp = () => {
    if (draggedCatalyst === null) return;
    const currentModule = catalysts.find((m) => m.id === draggedCatalyst);
    const targetNode = echoes.find((n) => n.id === draggedCatalyst);
    const distance = Math.hypot(
      currentModule.position[0] - targetNode.position[0],
      currentModule.position[1] - targetNode.position[1]
    );
    if (distance < 1.5) {
      setCatalysts((currentCatalysts) =>
        currentCatalysts.map((m) =>
          m.id === draggedCatalyst
            ? { ...m, position: targetNode.position, isMatched: true }
            : m
        )
      );
    }
    setDraggedCatalyst(null);
  };

  return (
    <div className="scene-container" style={{ position: "relative" }}>
      <Canvas>
        <CameraController />
        <color attach="background" args={["#05050A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <Suspense fallback={null}>
          {echoes.map((echo) => (
            <LegacyEcho key={`echo-${echo.id}`} {...echo} />
          ))}
          {catalysts.map((cat) => (
            <SyncCatalyst
              key={`cat-${cat.id}`}
              {...cat}
              onPointerDown={
                !cat.isMatched
                  ? (e) => {
                      e.stopPropagation();
                      setDraggedCatalyst(cat.id);
                    }
                  : null
              }
            />
          ))}
        </Suspense>
        <mesh onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
          <planeGeometry args={[30, 20]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
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
