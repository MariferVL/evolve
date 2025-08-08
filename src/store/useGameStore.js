import { create } from "zustand";

/**
 * Zustand store for managing game state and inventory.
 * Handles transitions between splash, intro, and game scenes.
 */
export const useGameStore = create((set) => ({
  // Initial game state
  gameState: "game", // Possible values: 'splash' | 'intro' | 'game'

  // Inventory arrays for tracking collected items
  essences: [],
  artifacts: [],

  goToPuzzle: () => set({ gameState: "puzzle_oracle" }),

  // Transition to intro scene
  showIntro: () => set({ gameState: "intro" }),

  // Start the main game scene
  startGame: () => set({ gameState: "game" }),

  // Add a new essence to the inventory
  addEssence: (essenceName) =>
    set((state) => ({
      essences: [...state.essences, essenceName],
    })),

  // Add a new artifact to the inventory
  addArtifact: (artifactName) =>
    set((state) => ({
      artifacts: [...state.artifacts, artifactName],
    })),
}));
