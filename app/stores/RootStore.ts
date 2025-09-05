import { types, flow, Instance } from "mobx-state-tree"

import { UserStore } from "./UserStore"

/**
 * RootStore combines all individual stores and manages application-wide state
 */
export const RootStore = types
  .model("RootStore", {
    userStore: types.optional(UserStore, {}),
    // Add other stores here as your app grows
    // episodeStore: types.optional(EpisodeStore, {}),
    // settingsStore: types.optional(SettingsStore, {}),
  })
  .views((self) => ({
    /**
     * Check if the app is in a loading state
     */
    get isLoading() {
      return self.userStore.isLoading || self.userStore.isAuthenticating
    },

    /**
     * Get the current user from user store
     */
    get currentUser() {
      return self.userStore.currentUser
    },

    /**
     * Check if user is authenticated
     */
    get isAuthenticated() {
      return self.userStore.isAuthenticated
    },
  }))
  .actions((self) => ({
    /**
     * Initialize the root store
     * This should be called when the app starts
     */
    initialize: flow(function* () {
      try {
        // Initialize user store
        yield self.userStore.hydrate()

        // Add initialization for other stores here
        // yield self.episodeStore.initialize()
        // yield self.settingsStore.initialize()

        console.log("Root store initialized successfully")
      } catch (error) {
        console.error("Failed to initialize root store:", error)
      }
    }),

    /**
     * Reset all stores to their initial state
     * Useful for logout or app reset scenarios
     */
    reset: flow(function* () {
      try {
        // Reset user store
        yield self.userStore.logout()

        // Reset other stores as needed
        // self.episodeStore.reset()
        // self.settingsStore.reset()

        console.log("Root store reset successfully")
      } catch (error) {
        console.error("Failed to reset root store:", error)
      }
    }),
  }))

/**
 * Create and export root store instance
 */
let rootStore: RootStoreInstance

export const createRootStore = () => {
  if (rootStore) {
    return rootStore
  }

  rootStore = RootStore.create({
    userStore: {},
  })

  return rootStore
}

export const getRootStore = () => {
  if (!rootStore) {
    throw new Error("Root store has not been created yet. Call createRootStore() first.")
  }
  return rootStore
}

// Type exports for TypeScript
export type RootStoreInstance = Instance<typeof RootStore>
export type RootStoreType = typeof RootStore
