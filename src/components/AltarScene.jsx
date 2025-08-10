import { useEffect, useState } from "react";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Essence } from "./Essence";
import { EssenceHint } from "./EssenceHint";
import { useGameStore } from "../store/useGameStore";

/**
 * AltarModel
 * - Loads the altar GLTF model.
 * - Scales and positions it appropriately in the scene.
 * @returns {JSX.Element} The altar model as a primitive.
 */
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

/**
 * AltarScene
 * - Displays the altar with interactive essences.
 * - Shows collected essences as static altar objects.
 * - Next uncollected essence is interactive.
 * - Provides a hint for the next essence to collect.
 * - Uses Zustand for game state management.
 * @returns {JSX.Element}
 */
export function AltarScene() {
  const collectedEssences = useGameStore((s) => s.essences);
  const essenceDefs = [
    {
      id: 0,
      color: "#f9f993",
      transparent: true,
      opacity: 1,
      triggerPos: [-2.5, -1, 1],
      altarPos: [-1.2, -1.6, 0],
    },
    {
      id: 1,
      color: "#00ffff",
      transparent: false,
      opacity: 1,
      triggerPos: [0, -1, 1],
      altarPos: [0, -1.6, 0],
    },
    {
      id: 2,
      color: "#ff00ff",
      transparent: false,
      opacity: 1,
      triggerPos: [2.5, -1, 1],
      altarPos: [1.2, -1.6, 0],
    },
  ];
  // State to control the essence hint visibility
  const [showEssenceHint, setShowEssenceHint] = useState(true);

  const [hintDismissed, setHintDismissed] = useState(false);

  // Find the next uncollected essence definition
  const nextUncollected = essenceDefs.find(
    (d) => !collectedEssences.includes(d.id)
  );

  // Effect to update the hint visibility based on collected essences
  useEffect(() => {
    if (!nextUncollected || hintDismissed) {
      setShowEssenceHint(false);
    } else {
      setShowEssenceHint(true);
    }
  }, [collectedEssences, nextUncollected, hintDismissed]);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 4, 18], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />

        <Suspense fallback={null}>
          <AltarModel />

          {/* Render collected essences as static altar objects, and only one interactive trigger: the next uncollected essence. */}
          {(() => {
            const collectedSet = new Set(collectedEssences);

            // All collected placed on altar (static)
            const collectedDefs = essenceDefs.filter((d) =>
              collectedSet.has(d.id)
            );

            // Next uncollected (first in order) becomes the single interactive trigger
            const nextUncollected = essenceDefs.find(
              (d) => !collectedSet.has(d.id)
            );

            return (
              <>
                {collectedDefs.map((def) => (
                  <Essence
                    key={`essence-collected-${def.id}`}
                    id={def.id}
                    position={def.altarPos}
                    color={def.color}
                    interactiveProp={false}
                  />
                ))}

                {nextUncollected && (
                  <Essence
                    key={`essence-active-${nextUncollected.id}`}
                    id={nextUncollected.id}
                    position={nextUncollected.triggerPos}
                    color={nextUncollected.color}
                    interactiveProp={true}
                  />
                )}
              </>
            );
          })()}
        </Suspense>

        <Sparkles
          count={120}
          scale={[10, 5, 10]}
          size={5}
          speed={0.3}
          color="#f5ffbb"
        />

        <OrbitControls minDistance={20} maxDistance={60} />
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} intensity={0.8} mipmapBlur />
        </EffectComposer>
      </Canvas>
      <EssenceHint
        show={showEssenceHint}
        nextUncollected={nextUncollected}
        onDismiss={() => setHintDismissed(true)}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}
