/**
 * MobX-State-Tree Store Setup
 *
 * This module exports all store-related functionality for the CMSMobile app.
 * It uses MobX-State-Tree for predictable state management with TypeScript support.
 */

// Store models
export { UserStore } from "./UserStore"
export type { UserStoreType } from "./UserStore"

export { RootStore, createRootStore, getRootStore } from "./RootStore"
export type { RootStoreInstance, RootStoreType } from "./RootStore"

// Provider and hooks
export {
  StoreProvider,
  useStore,
  useUserStore,
  useAuth,
  useStoreActions,
  useStoreDebug,
  withStore,
} from "./StoreProvider"
export type { StoreProviderProps } from "./StoreProvider"

// Types
export type {
  RootStoreSnapshotIn,
  RootStoreSnapshotOut,
  UserStoreInstance,
  UserStoreSnapshotIn,
  UserStoreSnapshotOut,
  NavigationStore,
} from "./types"

/**
 * Usage Examples:
 *
 * 1. Basic setup in app.tsx:
 * ```tsx
 * import { StoreProvider } from "./stores"
 *
 * function App() {
 *   return (
 *     <StoreProvider>
 *       <YourAppContent />
 *     </StoreProvider>
 *   )
 * }
 * ```
 *
 * 2. Using in a component:
 * ```tsx
 * import { useAuth, withStore } from "./stores"
 *
 * const LoginScreen = withStore(() => {
 *   const { login, isLoading, error, userEmail, setUserEmail } = useAuth()
 *
 *   const handleLogin = async () => {
 *     const result = await login(userEmail, password)
 *     if (result.success) {
 *       // Navigate to main app
 *     }
 *   }
 *
 *   return (
 *     // Your login UI
 *   )
 * })
 * ```
 *
 * 3. Direct store access:
 * ```tsx
 * import { useUserStore } from "./stores"
 *
 * const UserProfile = withStore(() => {
 *   const userStore = useUserStore()
 *
 *   return (
 *     <Text>{userStore.currentUser?.name}</Text>
 *   )
 * })
 * ```
 */
