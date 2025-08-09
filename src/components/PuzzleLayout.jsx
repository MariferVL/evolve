import { useEffect, useMemo, useState } from "react";
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
    // Centered octahedron with label above
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

      {/* Label above the octahedron */}
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
 * - Represents a draggable module in the puzzle.
 * - Displays a label above the box.
 * - Handles pointer events for dragging and snapping.
 * @param {Object} props - Component properties.
 * @param {Array} props.position - The position of the catalyst in world coordinates.
 * @param {string} props.color - The color of the catalyst box.
 * @param {string} props.label - The label text to display above the box.
 * @param {Function} props.onPointerDown - Callback for pointer down events.
 * @param {number} props.scaleFactor - Scale factor for responsive sizing.
 * @returns {JSX.Element} The SyncCatalyst component.
 * */
export function SyncCatalyst({
  position,
  color,
  label,
  onPointerDown,
  scaleFactor,
}) {
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
 * - Handles the layout of the puzzle components.
 * - Computes aspect ratio based on landscape dimensions.
 * - Determines if the target is mobile based on landscape width.
 * - Calculates scale factor for responsive sizing.
 * - Sets up initial catalyst positions and handles dragging logic.
 * - Monitors game completion state based on catalyst matching.
 * @param {Object} props - Component properties.
 * @param {Function} props.setGameStatus - Function to update the game status.
 * @param {number} props.landscapeWidth - Width of the landscape in pixels.
 * @param {number} props.landscapeHeight - Height of the landscape in pixels.
 * @returns {JSX.Element} The PuzzleLayout component.
 */
export function PuzzleLayout({
  setGameStatus,
  landscapeWidth,
  landscapeHeight,
}) {
  // Calculate aspect ratio based on landscape dimensions
  const aspect = Math.max(
    landscapeWidth / Math.max(1, landscapeHeight),
    16 / 9
  );

  // Determine if the device is mobile based on landscape width
  const isMobile = landscapeWidth < 900; // more generous breakpoint for phones/tablets
  // Calculate scale factor for responsive sizing
  const scaleFactor = Math.max(0.7, Math.min(1.4, landscapeHeight / 700));
  // Calculate spread based on aspect ratio and scale factor
  const baseSpread = isMobile ? 1.1 : 2.0;
  const spreadX = Math.max(
    0.9,
    Math.min(2.6, baseSpread * (aspect / (16 / 9)) * scaleFactor)
  );
  // Calculate top and bottom Y positions based on scale factor
  const yTop = 0.9 * scaleFactor;
  const yBottom = -0.9 * scaleFactor;
  // Calculate camera zoom level based on landscape height and mobile status
  const camZoom = Math.round(
    Math.max(40, Math.min(120, (landscapeHeight / 6) * (isMobile ? 0.95 : 1.1)))
  );
  // Calculate plane dimensions based on spread and scale factor
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
  // Static echoes (targets)
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
  // State to manage catalysts and dragging
  const [catalysts, setCatalysts] = useState(initialCatalysts);
  const [draggedCatalyst, setDraggedCatalyst] = useState(null);

  // Reset dragged catalyst on landscape size change
  useEffect(() => {
    setCatalysts((current) =>
      initialCatalysts.map((init) => {
        const existing = current.find((c) => c.id === init.id);
        // If the catalyst already exists and is matched, keep its position
        // Otherwise, reset to initial position
        return existing && existing.isMatched
          ? { ...init, position: init.position, isMatched: true }
          : { ...init };
      })
    );
  }, [landscapeWidth, landscapeHeight, spreadX]);

  // Check if all catalysts are matched to update game status
  useEffect(() => {
    const allMatched = catalysts.every((c) => c.isMatched);
    if (allMatched) {
      setGameStatus("SYNCHRONIZATION COMPLETE: ESSENCE ACQUIRED");
    } else {
      setGameStatus("");
    }
  }, [catalysts, setGameStatus]);

  /**
   * Handle pointer move event to update catalyst position while dragging.
   * @param {PointerEvent} e - The pointer event containing the new position.
   */
  function handlePointerMove(e) {
    if (draggedCatalyst === null) return;
    const { x, y } = e.point;
    setCatalysts((list) =>
      list.map((m) =>
        m.id === draggedCatalyst ? { ...m, position: [x, y, 0.1] } : m
      )
    );
  }

  /**
   * Handle pointer up event to snap catalyst to target or return to original position.
   */
  function handlePointerUp() {
    if (draggedCatalyst === null) return;
    const currentModule = catalysts.find((m) => m.id === draggedCatalyst);
    const targetNode = echoesStatic.find((n) => n.id === draggedCatalyst);
    // Calculate distance between current catalyst and target
    const dx = currentModule.position[0] - targetNode.position[0];
    const dy = currentModule.position[1] - targetNode.position[1];
    const distance = Math.hypot(dx, dy);
    // Calculate snap threshold based on spread and scale factor
    const snapThreshold = Math.max(0.8, spreadX * 0.7);
    // If within snap threshold, snap to target position
    if (distance < snapThreshold) {
      // Snap to target position
      setCatalysts((list) =>
        list.map((m) =>
          m.id === draggedCatalyst
            ? { ...m, position: targetNode.position, isMatched: true }
            : m
        )
      );
    } else {
      // Return to original position if not snapped
      const original = initialCatalysts.find(
        (c) => c.id === draggedCatalyst
      ).position;
      setCatalysts((list) =>
        list.map((m) =>
          m.id === draggedCatalyst ? { ...m, position: original } : m
        )
      );
    }

    setDraggedCatalyst(null);
  }

  const planeWidth = Math.max(30, spreadX * 10);
  const planeHeight = Math.max(18, (yTop - yBottom) * 8);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={camZoom} />

      {/* echoes (targets) */}
      {echoesStatic.map((echo) => (
        <LegacyEcho
          key={`echo-${echo.id}`}
          {...echo}
          scaleFactor={scaleFactor}
        />
      ))}

      {/* catalysts (draggable modules) */}
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

      {/* Invisible plane for receiving pointer events */}
      <mesh onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}
