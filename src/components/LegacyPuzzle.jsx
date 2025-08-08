import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

/**
 *  LegacyEcho component renders an echo with a label.
 *  @param {Object} param0 - The properties for the echo.
 *  @param {Array} param0.position - The position of the echo in 3D space.
 *  @param {string} param0.color - The color of the echo.
 *  @param {string} param0.label - The label text for the echo.
 *  @returns {JSX.Element} The rendered echo component.
 */
function LegacyEcho({ position, color, label }) {
  return (
    <group position={position}>
      // Create an octahedron geometry for the echo
      <mesh>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      // Add a text label above the echo
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
 * SyncCatalyst component renders a catalyst box with a label.
 * @param {Object} param
 * @param {Array} param.position - The position of the catalyst in 3D space.
 * @param {string} param.color - The color of the catalyst.
 * @param {string} param.label - The label text for the catalyst.
 * @param {Function} param.onPointerDown - Callback for pointer down event.
 * @returns {JSX.Element} The rendered catalyst component.
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
        rotation={[0, 0, 0]}
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

/** * LegacyPuzzle component implements a drag-and-drop puzzle game.
 * Players match catalysts to their corresponding echoes.
 * @returns {JSX.Element} The rendered puzzle component.
 */
export function LegacyPuzzle() {
  const [draggedCatalyst, setDraggedCatalyst] = useState(null);

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

  // Echoes that the player needs to match with catalysts
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

  // Handle pointer move event to update catalyst position
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

  // Handle pointer up event to check if catalyst is close to its echo
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

  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <color attach="background" args={["#05050A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />

        <Text
          position={[0, 3.5, 0]}
          fontSize={0.5}
          color="white"
          letterSpacing={0.1}
        >
          SOLVE THE INTERFACE
        </Text>
        <Text position={[0, 2.8, 0]} fontSize={0.25} color="#888">
          Match the solution to the UI challenge.
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
