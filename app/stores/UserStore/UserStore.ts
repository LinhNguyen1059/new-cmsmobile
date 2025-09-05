import { types, Instance } from "mobx-state-tree"

import { User, UserSession, UserPreferences } from "./models"
import { userStoreViews } from "./views"
import { userStoreActions, userStoreAsyncActions } from "./actions"
import type { IUserStore } from "./types"

/**
 * UserStore model definition for proper typing
 */
const UserStoreModel = types.model("UserStore", {
  // Current authenticated user
  currentUser: types.maybe(User),
  
  // User session with token and expiry info
  session: types.maybe(UserSession),
  
  // User preferences and settings
  preferences: types.maybe(UserPreferences),
  
  // Loading states
  isLoading: types.optional(types.boolean, false),
  isAuthenticating: types.optional(types.boolean, false),
  
  // Error state
  error: types.maybe(types.string),
})

/**
 * UserStore - Main store for user authentication and profile management
 * 
 * This store is composed of:
 * - Models: User, UserSession, UserPreferences (defined in ./models.ts)
 * - Views: Computed values and getters (defined in ./views.ts)  
 * - Actions: State mutations and business logic (defined in ./actions.ts)
 * 
 * This modular approach makes the store easier to maintain and test.
 * The IUserStore interface provides full type safety for self parameters.
 */
export const UserStore = UserStoreModel
  .views(userStoreViews)
  .actions(userStoreActions)
  .actions(userStoreAsyncActions)

// Export the type for use in other parts of the app
export type UserStoreType = typeof UserStore

/**
 * Usage Examples:
 * 
 * 1. Authentication:
 * ```tsx
 * const userStore = useUserStore()
 * const result = await userStore.login("user@example.com", "password")
 * if (result.success) {
 *   // Handle successful login
 * }
 * ```
 * 
 * 2. User Profile:
 * ```tsx
 * const userStore = useUserStore()
 * await userStore.updateUserProfile({ name: "New Name" })
 * ```
 * 
 * 3. Preferences:
 * ```tsx
 * const userStore = useUserStore()
 * await userStore.updatePreferences({ theme: "dark" })
 * ```
 * 
 * 4. Computed Values:
 * ```tsx
 * const userStore = useUserStore()
 * console.log(userStore.userDisplayName) // Gets name or email
 * console.log(userStore.isAuthenticated) // Boolean
 * console.log(userStore.authStatus) // Complete auth state object
 * ```
 */