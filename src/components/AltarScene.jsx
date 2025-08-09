import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Essence } from "./Essence";
import { useGameStore } from "../store/useGameStore";

function AltarModel() {
  const { scene } = useGLTF("/altar.glb");
  return (
    <primitive
      object={scene}
      scale={0.013}
      position={[0, -15, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export function AltarScene() {
  const collectedEssences = useGameStore((s) => s.essences);
  const essenceDefs = [
    {
      id: 0,
      color: "#8829e7ff",
      triggerPos: [-2.5, -1, 1],
      altarPos: [-1.2, -1.6, 0],
    },
    { id: 1, color: "#00ffff", triggerPos: [0, -1, 1], altarPos: [0, -1.6, 0] },
    {
      id: 2,
      color: "#ff00ff",
      triggerPos: [2.5, -1, 1],
      altarPos: [1.2, -1.6, 0],
    },
  ];


  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 4, 18], fov: 50 }}>
        <color attach="background" args={["#100521"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        <Suspense fallback={null}>
          <AltarModel />
          {essenceDefs.map((def) => {
            const isCollected = collectedEssences.includes(def.id);
            return (
              <Essence
                key={`essence-${def.id}`}
                id={def.id}
                position={isCollected ? def.altarPos : def.triggerPos}
                color={def.color}
                interactiveProp={!isCollected}
              />
            );
          })}
        </Suspense>

        <Sparkles
          count={120}
          scale={[10, 5, 10]}
          size={5}
          speed={0.3}
          color="#e3bbffff"
        />

        <OrbitControls minDistance={20} maxDistance={60} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
