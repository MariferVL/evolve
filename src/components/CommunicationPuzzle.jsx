import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, PerspectiveCamera } from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";

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
 * @description Renders the communication puzzle scene where users can match catalysts to echoes.
 * @returns
 */
export function CommunicationPuzzle() {
  // State to manage catalysts in the scene
  const [catalysts, setCatalysts] = useState([
    { id: 0, position: [-3, -2, 0], color: "#FF00FF", label: "Intuitive UI" },
    {
      id: 1,
      position: [0, -2, 0],
      color: "#9400D3",
      label: "Clear Communication",
    },
    {
      id: 2,
      position: [3, -2, 0],
      color: "#00FFFF",
      label: "Accessible Design",
    },
  ]);

  // State to track which catalyst is being dragged
  const [draggedCatalyst, setDraggedCatalyst] = useState(null);
  // Echoes that need to be matched with catalysts
  const echoes = [
    {
      id: 2,
      position: [-3, 1, 0],
      color: "#00FFFF",
      label: "Complex User Needs",
    },
    { id: 0, position: [0, 1, 0], color: "#FF00FF", label: "User Frustration" },
    {
      id: 1,
      position: [3, 1, 0],
      color: "#9400D3",
      label: "Ambiguous Feedback",
    },
  ];

  // Handlers for pointer events to manage dragging of catalysts
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

  // Handler for pointer up event to check if the catalyst is close enough to an echo
  const handlePointerUp = () => {
    if (draggedCatalyst === null) return;
    const currentCatalyst = catalysts.find((m) => m.id === draggedCatalyst);
    const targetEcho = echoes.find((n) => n.id === draggedCatalyst);
    const distance = Math.hypot(
      currentCatalyst.position[0] - targetEcho.position[0],
      currentCatalyst.position[1] - targetEcho.position[1]
    );
    if (distance < 1) {
      setCatalysts((currentCatalysts) =>
        currentCatalysts.map((m) =>
          m.id === draggedCatalyst ? { ...m, position: targetEcho.position } : m
        )
      );
    }
    setDraggedCatalyst(null);
  };

  // Animation for the camera position using react-spring
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 25], 
    config: { mass: 1, tension: 120, friction: 50 },
  }));

  useEffect(() => {
    // Move the camera to a better position for the puzzle
    api.start({ position: [0, 0, 10] });
  }, [api]);

  return (
    <div className="scene-container">
      <Canvas>
        <animated.group position={spring.position}>
          <PerspectiveCamera makeDefault fov={50} />
        </animated.group>

        <color attach="background" args={["#05050A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Text
          position={[0, 3.5, 0]}
          fontSize={0.35}
          color="white"
          letterSpacing={0.1}
          textAlign="center"
          anchorY="bottom"
          opacity={0}
          material-opacity={0}
        >
          <animated.meshBasicMaterial
            transparent
            opacity={spring.position.to((p) => (10 - p[2]) / 5)}
          />
          ECHOES OF SPEECH THERAPY
        </Text>

        <Text
          position={[0, 2.8, 0]}
          fontSize={0.25}
          color="#888"
          textAlign="center"
          maxWidth={5}
          anchorY="bottom"
          opacity={0}
          material-opacity={0}
        >
          <animated.meshBasicMaterial
            transparent
            opacity={spring.position.to((p) => (8 - p[2]) / 4)}
          />
          Decoding human communication taught me how to build better interfaces.
        </Text>

        {echoes.map((echo) => (
          <LegacyEcho key={`echo-${echo.id}`} {...echo} />
        ))}
        {catalysts.map((cat) => (
          <SyncCatalyst
            key={`cat-${cat.id}`}
            {...cat}
            onPointerDown={(e) => {
              e.stopPropagation();
              setDraggedCatalyst(cat.id);
            }}
          />
        ))}

        <mesh onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>

        <OrbitControls enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
