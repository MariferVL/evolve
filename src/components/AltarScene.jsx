import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// A placeholder mesh to verify the scene is rendering correctly.
// It will be replaced by the actual altar model.
function DebugMesh() {
  const meshRef = useRef();

  // Animate the mesh's rotation on each frame for visual feedback.
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      {/* Emissive material ensures visibility regardless of scene lighting. */}
      <meshStandardMaterial color="magenta" emissive="magenta" emissiveIntensity={2} toneMapped={false} />
    </mesh>
  );
}

export function AltarScene() {
  return (
    <div className="scene-container">
      <Canvas camera={{ position: [0, 1, 9], fov: 50 }}>
        {/* Environment setup */}
        <color attach="background" args={['#100521']} />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={2.5}
          color="#A088FF"
        />

        {/* Scene Contents */}
        <Suspense fallback={null}>
          <DebugMesh />
        </Suspense>

        <Sparkles
          count={120}
          scale={[10, 5, 10]}
          size={5}
          speed={0.3}
          color="#DDBBFF"
        />

        {/* Camera and Post-processing Effects */}
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            intensity={0.8}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}