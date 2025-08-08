import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore'; 

export function Essence({ position, color }) {
  const meshRef = useRef();
  const goToPuzzle = useGameStore((state) => state.goToPuzzle); 
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onClick={goToPuzzle} 
      onPointerEnter={() => (document.body.style.cursor = 'pointer')} 
      onPointerLeave={() => (document.body.style.cursor = 'default')}  
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