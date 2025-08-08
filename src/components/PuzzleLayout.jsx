// PuzzleLayout.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Text, OrthographicCamera } from "@react-three/drei";

/**
 * LegacyEcho
 * - Small octahedron + label above
 * - All sizes are driven by scaleFactor for consistent responsive behavior
 */
export function LegacyEcho({ position, color, label, scaleFactor }) {
  const octaSize = 0.5 * scaleFactor;
  const fontSize = 0.24 * scaleFactor;

  return (
    <group position={position}>
      <mesh>
        <octahedronGeometry args={[octaSize, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      <Text
        position={[0, octaSize + 0.25 * scaleFactor, 0]}
        fontSize={fontSize}
        color="white"
        anchorX="center"
        anchorY="bottom"
        maxWidth={3 * scaleFactor}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * SyncCatalyst
 * - Box with centered label
 */
export function SyncCatalyst({ position, color, label, onPointerDown, scaleFactor }) {
  const boxSize = 1.2 * scaleFactor;
  const fontSize = 0.16 * scaleFactor;

  return (
    <group position={position} onPointerDown={onPointerDown}>
      <mesh>
        <boxGeometry args={[boxSize, boxSize, boxSize]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      <Text
        position={[0, 0, boxSize / 2 + 0.01]}
        fontSize={fontSize}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={boxSize * 0.9}
        textAlign="center"
      >
        {label}
      </Text>
    </group>
  );
}

/**
 * PuzzleLayout
 * - Responsive layout that keeps 6 figures centered and compact.
 * - Accepts landscapeWidth/landscapeHeight computed by parent so we always treat the longer side as width.
 */
export function PuzzleLayout({ setGameStatus, landscapeWidth, landscapeHeight }) {
  // aspect based on swapped dimensions (landscapeWidth >= landscapeHeight)
  const aspect = Math.max(landscapeWidth / Math.max(1, landscapeHeight), 16 / 9);

  // determine if target is mobile by checking the effective landscape width
  const isMobile = landscapeWidth < 900; // more generous breakpoint for phones/tablets

  // scaleFactor maps physical pixels -> world unit scale: keeps objects legible on small screens
  const scaleFactor = Math.max(0.7, Math.min(1.4, landscapeHeight / 700));

  // spread calculation: smaller on mobile, a little wider on desktop; also scaled by aspect
  const baseSpread = isMobile ? 1.1 : 2.0;
  const spreadX = Math.max(0.9, Math.min(2.6, baseSpread * (aspect / (16 / 9)) * scaleFactor));

  // vertical positions (top row / bottom row)
  const yTop = 0.9 * scaleFactor;
  const yBottom = -0.9 * scaleFactor;

  // camera zoom: tuned for orthographic camera. We clamp for stability.
  const camZoom = Math.round(Math.max(40, Math.min(120, (landscapeHeight / 6) * (isMobile ? 0.95 : 1.1))));

  // initial positions (recomputed from spread each render)
  const initialCatalysts = useMemo(
    () => [
      {
        id: 0,
        position: [-spreadX, yBottom, 0],
        color: "#FF00FF",
        label: "Intuitive UI",
        isMatched: false,
      },
      {
        id: 1,
        position: [0, yBottom, 0],
        color: "#9400D3",
        label: "Clear Communication",
        isMatched: false,
      },
      {
        id: 2,
        position: [spreadX, yBottom, 0],
        color: "#00FFFF",
        label: "Accessible Design",
        isMatched: false,
      },
    ],
    [spreadX, yBottom]
  );

  const echoesStatic = useMemo(
    () => [
      {
        id: 2,
        position: [-spreadX, yTop, 0],
        color: "#00FFFF",
        label: "Complex User Needs",
      },
      {
        id: 0,
        position: [0, yTop, 0],
        color: "#FF00FF",
        label: "User Frustration",
      },
      {
        id: 1,
        position: [spreadX, yTop, 0],
        color: "#9400D3",
        label: "Ambiguous Feedback",
      },
    ],
    [spreadX, yTop]
  );

  const [catalysts, setCatalysts] = useState(initialCatalysts);
  const [draggedCatalyst, setDraggedCatalyst] = useState(null);

  // keep catalysts positions in sync with screen-size changes (preserve matched ones)
  useEffect(() => {
    setCatalysts((current) =>
      initialCatalysts.map((init) => {
        const existing = current.find((c) => c.id === init.id);
        // preserve matched & label, otherwise reset position to the new layout
        return existing && existing.isMatched
          ? { ...init, position: init.position, isMatched: true } // snap matched to new target
          : { ...init };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [landscapeWidth, landscapeHeight, spreadX]);

  // game complete monitoring
  useEffect(() => {
    const allMatched = catalysts.every((c) => c.isMatched);
    if (allMatched) {
      setGameStatus("SYNCHRONIZATION COMPLETE: ESSENCE ACQUIRED");
    } else {
      setGameStatus("");
    }
  }, [catalysts, setGameStatus]);

  // pointer move: directly set world coords on the dragged catalyst
  function handlePointerMove(e) {
    if (draggedCatalyst === null) return;
    const { x, y } = e.point;
    setCatalysts((list) =>
      list.map((m) => (m.id === draggedCatalyst ? { ...m, position: [x, y, 0.1] } : m))
    );
  }

  function handlePointerUp() {
    if (draggedCatalyst === null) return;
    const currentModule = catalysts.find((m) => m.id === draggedCatalyst);
    const targetNode = echoesStatic.find((n) => n.id === draggedCatalyst);

    const dx = currentModule.position[0] - targetNode.position[0];
    const dy = currentModule.position[1] - targetNode.position[1];
    const distance = Math.hypot(dx, dy);

    // threshold scales with spreadX (so it adapts to layout)
    const snapThreshold = Math.max(0.8, spreadX * 0.7);

    if (distance < snapThreshold) {
      // snap into place
      setCatalysts((list) =>
        list.map((m) =>
          m.id === draggedCatalyst ? { ...m, position: targetNode.position, isMatched: true } : m
        )
      );
    } else {
      // return to original spot
      const original = initialCatalysts.find((c) => c.id === draggedCatalyst).position;
      setCatalysts((list) => list.map((m) => (m.id === draggedCatalyst ? { ...m, position: original } : m)));
    }

    setDraggedCatalyst(null);
  }

  // plane geometry size in world units scaled to the layout so pointer hits work across the canvas
  const planeWidth = Math.max(30, spreadX * 10);
  const planeHeight = Math.max(18, (yTop - yBottom) * 8);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={camZoom} />

      {/* echoes (targets) */}
      {echoesStatic.map((echo) => (
        <LegacyEcho key={`echo-${echo.id}`} {...echo} scaleFactor={scaleFactor} />
      ))}

      {/* catalysts (draggable) */}
      {catalysts.map((cat) => (
        <SyncCatalyst
          key={`cat-${cat.id}`}
          {...cat}
          scaleFactor={scaleFactor}
          onPointerDown={
            !cat.isMatched
              ? (e) => {
                  e.stopPropagation();
                  setDraggedCatalyst(cat.id);
                }
              : null
          }
        />
      ))}

      {/* invisible plane for receiving pointer events */}
      <mesh onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
