import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../store/useGameStore";

/**
 * Essence component that represents an interactive essence in the game.
 * It animates up and down slightly to indicate interactivity.
 * It navigates to the briefing screen when clicked.
 * @param {Object} props - The properties for the Essence component.
 * @param {Array} props.position - The [x, y, z] position of the essence in 3D space.
 * @param {string} props.color - The color of the essence.
 * @return {JSX.Element} The Essence component.
 * @example
 * <Essence position={[0, 1, 0]} color="blue" />
 */
export function Essence({ id = 0, position = [0, 0, 0], color = "#888", interactiveProp = undefined }) {
  const meshRef = useRef();
  const startPuzzle = useGameStore((s) => s.startPuzzle);
  const collected = useGameStore((s) => s.essences.includes(id));

  // Resolve whether this essence should be interactive:
  // - If it's already collected -> not interactive (static on altar)
  // - If interactiveProp is explicitly provided, respect it; otherwise interactive when not collected
  const interactive = typeof interactiveProp === "boolean" ? interactiveProp : !collected;

  // Animate only if interactive (floating)
  useFrame((state) => {
    if (meshRef.current && interactive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    } else if (meshRef.current && !interactive) {
      // ensure exact position if static
      meshRef.current.position.y = position[1];
    }
  });

  const handleClick = () => {
    if (!interactive) return;
    // start the puzzle flow for this essence
    startPuzzle(id);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={interactive ? handleClick : undefined}
      onPointerEnter={() => interactive && (document.body.style.cursor = "pointer")}
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

