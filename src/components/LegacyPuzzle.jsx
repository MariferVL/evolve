import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";

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

function SyncCatalyst({ position, color, label, onPointerDown }) {
  return (
    // Usamos <group> para que el texto y el cubo se muevan juntos
    <group position={position} onPointerDown={onPointerDown}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
      {/* Este Text ahora se renderiza "pegado" a la cara frontal del cubo */}
      <Text
        position={[0, 0, 0.61]} // Posición justo enfrente de la cara del cubo
        rotation={[0, 0, 0]}
        fontSize={0.15}
        color="white"
        maxWidth={1} // Ancho máximo para que el texto se ajuste
        textAlign="center"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

export function LegacyPuzzle() {
  // 1. NUEVOS TEXTOS ENFOCADOS EN FRONTEND Y UX
  const [catalysts, setCatalysts] = useState([
    {
      id: 0,
      position: [-3, -2, 0],
      color: "#FF00FF",
      label: "Component-Based Architecture",
    },
    {
      id: 1,
      position: [0, -2, 0],
      color: "#9400D3",
      label: "State Management",
    },
    {
      id: 2,
      position: [3, -2, 0],
      color: "#00FFFF",
      label: "Accessible Design (A11y)",
    },
  ]);

  const [draggedCatalyst, setDraggedCatalyst] = useState(null);

  const echoes = [
    {
      id: 2,
      position: [-3, 1, 0],
      color: "#00FFFF",
      label: "Complex UI for All Players",
    },
    {
      id: 0,
      position: [0, 1, 0],
      color: "#FF00FF",
      label: "Unscalable Codebase",
    },
    {
      id: 1,
      position: [3, 1, 0],
      color: "#9400D3",
      label: "Inconsistent User Data",
    },
  ];

  // La lógica de drag-and-drop no cambia
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
