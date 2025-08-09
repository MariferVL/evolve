import { create } from "zustand";

/**
 * Zustand store for managing game state and inventory.
 * Handles transitions between splash, intro, and game scenes.
 */
export const useGameStore = create((set, get) => ({
  // Initial game state
  gameState: "intro",

  // Inventory arrays for tracking collected items
  essences: [],            
  artifacts: [],

  // Currently active essence (the one that started the current puzzle)
  activeEssenceId: null,   // number | null

  // --- game state transitions ---
  goToBriefing: () => set({ gameState: "puzzle_briefing" }),
  goToPuzzle: () => set({ gameState: "puzzle_oracle" }),
  returnToAltar: () => set({ gameState: "game" }),
  showIntro: () => set({ gameState: "intro" }),
  startGame: () => set({ gameState: "game" }),

  
  // Called when a player clicks an interactive Essence in the altar to start its puzzle
  startPuzzle: (essenceId) =>
    set({
      activeEssenceId: essenceId,
      gameState: "puzzle_briefing", 
    }),

  // Mark an essence as collected (id is numeric). Avoid duplicates.
  collectEssence: (essenceId) =>
    set((state) => ({
      essences: state.essences.includes(essenceId)
        ? state.essences
        : [...state.essences, essenceId],
      activeEssenceId: state.activeEssenceId === essenceId ? null : state.activeEssenceId,
    })),

  // Add a new artifact to the inventory (keeps existing)
  addArtifact: (artifactName) =>
    set((state) => ({
      artifacts: [...state.artifacts, artifactName],
    })),
}));
