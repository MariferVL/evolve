import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Essence } from "./Essence";

export function MiniEssence({ color }) {
  return (
    <div style={{ width: 60, height: 60 }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 30 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} intensity={1.5} />
        <Essence
          id={999} 
          position={[0, 0, 0]}
          color={color}
          interactiveProp={false}
        />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.5} />
      </Canvas>
    </div>
  );
}
