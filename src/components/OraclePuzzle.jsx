import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

// Define cyberpunk color palette
const cyberpunkColors = {
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  violet: "#9400D3",
};

// DataNode and Module components for the Oracle puzzle
function DataNode({ position, color }) {
  return (
    <mesh position={position}>
      <octahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </mesh>
  );
}

/** * Module component represents draggable puzzle pieces.
 * It can be dragged and dropped onto target nodes.
 * @param {Object} props - Component properties.
 * @param {Array} props.position - Position of the module in 3D space.
 * @param {string} props.color - Color of the module.
 * @param {Function} props.onPointerDown - Callback for pointer down event
 *
 * @returns {JSX.Element} Rendered module component.
 * */
function Module({ position, color, onPointerDown }) {
  return (
    <mesh position={position} onPointerDown={onPointerDown}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
}

/** OraclePuzzle component represents the puzzle scene.
 * It allows players to drag and drop modules onto target nodes.
 * @returns {JSX.Element} Rendered Oracle puzzle scene.
 * */
export function OraclePuzzle() {
  const [modules, setModules] = useState([
    { id: 0, position: [-3, -2, 0], color: cyberpunkColors.magenta },
    { id: 1, position: [0, -2, 0], color: cyberpunkColors.violet },
    { id: 2, position: [3, -2, 0], color: cyberpunkColors.cyan },
  ]);

  // State to track which module is being dragged
  const [draggedModule, setDraggedModule] = useState(null);

  // Define target nodes for the puzzle
  const nodes = [
    { id: 2, position: [-3, 1, 0], color: cyberpunkColors.cyan },
    { id: 0, position: [0, 1, 0], color: cyberpunkColors.magenta },
    { id: 1, position: [3, 1, 0], color: cyberpunkColors.violet },
  ];

  // Handle pointer down event to start dragging a module
  const handlePointerMove = (e) => {
    if (draggedModule === null) return;
    setModules((currentModules) =>
      currentModules.map((m) =>
        m.id === draggedModule
          ? { ...m, position: [e.point.x, e.point.y, 0.1] }
          : m
      )
    );
  };
  // Handle pointer up event to drop the module
  const handlePointerUp = () => {
    if (draggedModule === null) return;
    const currentModule = modules.find((m) => m.id === draggedModule);
    const targetNode = nodes.find((n) => n.id === draggedModule);
    const distance = Math.hypot(
      currentModule.position[0] - targetNode.position[0],
      currentModule.position[1] - targetNode.position[1]
    );

    if (distance < 1) {
      setModules((currentModules) =>
        currentModules.map((m) =>
          m.id === draggedModule ? { ...m, position: targetNode.position } : m
        )
      );
    }
    setDraggedModule(null);
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
          SYNCHRONIZE DATA NODES
        </Text>
        <Text position={[0, 2.8, 0]} fontSize={0.25} color="#888">
          Drag each module to its matching node.
        </Text>

        {nodes.map((node) => (
          <DataNode key={`node-${node.id}`} {...node} />
        ))}
        {modules.map((mod) => (
          <Module
            key={`mod-${mod.id}`}
            {...mod}
            onPointerDown={() => setDraggedModule(mod.id)}
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
