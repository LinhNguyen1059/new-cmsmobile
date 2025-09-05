import { createContext, useContext, useEffect, FC, PropsWithChildren } from "react"
import { observer } from "mobx-react-lite"

import { createRootStore, RootStoreInstance } from "./RootStore"

/**
 * Store context
 */
const StoreContext = createContext<RootStoreInstance | null>(null)

/**
 * Store provider props
 */
export interface StoreProviderProps {
  /**
   * Optional store instance. If not provided, a new one will be created.
   */
  store?: RootStoreInstance
}

/**
 * Store provider component that makes the MobX stores available to the entire app
 */
export const StoreProvider: FC<PropsWithChildren<StoreProviderProps>> = observer(
  ({ children, store }) => {
    // Use provided store or create a new one
    const rootStore = store || createRootStore()

    useEffect(() => {
      // Initialize the store when the provider mounts
      rootStore.initialize()
    }, [rootStore])

    return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  },
)

/**
 * Hook to access the root store
 * @throws Error if used outside of StoreProvider
 */
export const useStore = (): RootStoreInstance => {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return store
}

/**
 * Hook to access the user store specifically
 * This is a convenience hook for accessing the user store directly
 */
export const useUserStore = () => {
  const { userStore } = useStore()
  return userStore
}

/**
 * Hook for authentication-related functionality
 * This provides a similar interface to your existing useAuth hook
 */
export const useAuth = () => {
  const userStore = useUserStore()

  return {
    // Authentication state
    isAuthenticated: userStore.isAuthenticated,
    isLoading: userStore.isAuthenticating,
    currentUser: userStore.currentUser,
    authToken: userStore.authToken,

    // User info
    userEmail: userStore.userEmail,
    validationError: userStore.emailValidationError,
    isLoginValid: userStore.isLoginValid,

    // Actions
    login: userStore.login,
    logout: userStore.logout,
    setUserEmail: userStore.setUserEmail,
    refreshUser: userStore.refreshUser,

    // Error handling
    error: userStore.error,
    clearError: userStore.clearError,
  }
}

/**
 * Higher-order component that wraps a component with observer
 * This ensures the component re-renders when observable state changes
 */
export const withStore = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = observer(Component as React.FunctionComponent<P>)
  WrappedComponent.displayName = `withStore(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Hook that provides easy access to commonly used store methods
 */
export const useStoreActions = () => {
  const store = useStore()

  return {
    // Root store actions
    reset: store.reset,
    initialize: store.initialize,

    // User store actions
    login: store.userStore.login,
    logout: store.userStore.logout,

    // Add other commonly used actions here as your app grows
  }
}

/**
 * Debug hook to access the entire store (useful for development)
 * Should not be used in production components
 */
export const useStoreDebug = () => {
  if (__DEV__) {
    return useStore()
  }
  throw new Error("useStoreDebug should only be used in development")
}
