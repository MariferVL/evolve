import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

/**
 * Essence component that represents an interactive essence in the game.
 * It animates up and down slightly to indicate interactivity.
 * It navigates to the briefing screen when clicked.
 * @param {Object} props - Component properties.
 * @param {number} props.id - Unique identifier for the essence.
 * @param {Array} props.position - Position in the 3D space.
 * @param {string} props.color - Color of the essence.
 * @param {boolean} [props.interactiveProp] - Explicit interactivity override.
 *
 * @returns {JSX.Element} The Essence mesh.
 */

export function Essence({
  id = 0,
  position = [0, 0, 0],
  color = "#888",
  interactiveProp = undefined,
}) {
  const meshRef = useRef();
  const startPuzzle = useGameStore((s) => s.startPuzzle);
  const collected = useGameStore((s) => s.essences.includes(id));

  // Decide interactivity: explicit prop > not-collected
  const interactive =
    typeof interactiveProp === "boolean" ? interactiveProp : !collected;

  // Animated float only when interactive
  useFrame((state) => {
    if (!meshRef.current) return;
    if (interactive) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    } else {
      meshRef.current.position.y = position[1];
    }
  });

  const handleClick = () => {
    if (!interactive) return;
    startPuzzle(id);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={interactive ? handleClick : undefined}
      onPointerEnter={() =>
        interactive && (document.body.style.cursor = "pointer")
      }
      onPointerLeave={() => (document.body.style.cursor = "default")}
    >
      <icosahedronGeometry args={[interactive ? 0.5 : 0.45, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={interactive ? 2 : 0.8}
        toneMapped={false}
      />
    </mesh>
  );
}
