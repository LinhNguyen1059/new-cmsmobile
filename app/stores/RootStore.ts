import { types, flow, Instance, SnapshotOut } from "mobx-state-tree";

import { UserStore } from "./UserStore";

/**
 * RootStore combines all individual stores and manages application-wide state
 */
export const RootStoreModel = types
  .model("RootStore", {
    userStore: types.optional(UserStore, {}),
    // Add other stores here as your app grows
  })
  .actions((self) => ({
    /**
     * Initialize the root store
     * This should be called when the app starts
     */
    initialize: flow(function* () {
      try {
        // Initialize user store from storage
        yield self.userStore.initializeUser();

        console.log("Root store initialized successfully");
      } catch (error) {
        console.error("Failed to initialize root store:", error);
      }
    }),

    /**
     * Reset all stores to their initial state
     * Useful for logout or app reset scenarios
     */
    reset: flow(function* () {
      try {
        // Clear user store
        self.userStore.clearUser();
        self.userStore.auth.clearFields();

        console.log("Root store reset successfully");
      } catch (error) {
        console.error("Failed to reset root store:", error);
      }
    }),
  }));

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
