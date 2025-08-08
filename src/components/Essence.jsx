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
export function Essence({ position, color }) {
  const meshRef = useRef();
  // Get the goToBriefing function from the game store
  const goToBriefing = useGameStore((state) => state.goToBriefing);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={goToBriefing}
      onPointerEnter={() => (document.body.style.cursor = "pointer")}
      onPointerLeave={() => (document.body.style.cursor = "default")}
    >
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
}
