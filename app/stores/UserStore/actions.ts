import { flow } from "mobx-state-tree"

import { storage } from "../../utils/storage"
import { User, UserSession, UserPreferences } from "./models"
import type { IUserStoreModel } from "./types"

/**
 * UserStore Actions - All mutations and business logic
 * This file contains all the actions that can modify the UserStore state
 * 
 * Now with proper TypeScript typing for full IntelliSense support!
 * You can access self.isLoading, self.currentUser etc. with complete type safety
 */

/**
 * Basic actions for simple state mutations
 */
export const userStoreActions = (self: IUserStoreModel) => ({
  /**
   * Set loading state
   */
  setLoading(loading: boolean) {
    self.isLoading = loading
  },

  /**
   * Set authentication loading state
   */
  setAuthenticating(authenticating: boolean) {
    self.isAuthenticating = authenticating
  },

  /**
   * Set error message
   */
  setError(error: string | null) {
    self.error = error || undefined
  },

  /**
   * Clear error
   */
  clearError() {
    self.error = undefined
  },

  /**
   * Set user session
   */
  setSession(sessionData: { token: string; expiresAt?: string; refreshToken?: string } | null) {
    if (sessionData) {
      self.session = UserSession.create({
        token: sessionData.token,
        expiresAt: sessionData.expiresAt,
        refreshToken: sessionData.refreshToken,
      })
      // Persist session to storage
      storage.set("userSession", JSON.stringify(sessionData))
    } else {
      self.session = undefined
      storage.delete("userSession")
    }
  },

  /**
   * Set current user
   */
  setCurrentUser(userData: { id: string; email: string; name?: string; avatar?: string } | null) {
    if (userData) {
      self.currentUser = User.create(userData)
      // Persist user data
      storage.set("currentUser", JSON.stringify(userData))
    } else {
      self.currentUser = undefined
      storage.delete("currentUser")
    }
  },

  /**
   * Update user preferences
   */
  setPreferences(preferences: { theme?: string; language?: string; notifications?: boolean }) {
    if (!self.preferences) {
      self.preferences = UserPreferences.create(preferences)
    } else {
      if (preferences.theme) self.preferences.theme = preferences.theme
      if (preferences.language) self.preferences.language = preferences.language
      if (preferences.notifications !== undefined) {
        self.preferences.notifications = preferences.notifications
      }
    }
    // Persist preferences
    storage.set("userPreferences", JSON.stringify(self.preferences))
  },

  /**
   * Update user email
   */
  setUserEmail(email: string) {
    if (self.currentUser) {
      self.currentUser.email = email
      // Re-persist updated user data
      storage.set("currentUser", JSON.stringify(self.currentUser))
    }
  },

  /**
   * Update user profile data
   */
  updateProfile(updates: { name?: string; avatar?: string }) {
    if (self.currentUser) {
      if (updates.name) self.currentUser.name = updates.name
      if (updates.avatar) self.currentUser.avatar = updates.avatar
      // Re-persist updated user data
      storage.set("currentUser", JSON.stringify(self.currentUser))
    }
  },
})

/**
 * Async actions using flow for complex business logic
 */
export const userStoreAsyncActions = (self: IUserStoreModel) => ({
  /**
   * Login action - authenticates user and sets session
   */
  login: flow(function* (email: string, password: string) {
    self.setAuthenticating(true)
    self.clearError()

    try {
      // Simulate API delay
      yield new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication logic - replace with real API call
      if (email === "demo@example.com" && password === "password") {
        const mockUser = {
          id: "1",
          email,
          name: "Demo User",
          avatar: "https://via.placeholder.com/150",
        }

        const mockSession = {
          token: "mock_jwt_token_" + Date.now(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
          refreshToken: "mock_refresh_token_" + Date.now(),
        }

        // Set default preferences for new user
        const defaultPreferences = {
          theme: "system",
          language: "en",
          notifications: true,
        }

        self.setSession(mockSession)
        self.setCurrentUser(mockUser)
        self.setPreferences(defaultPreferences)

        return { success: true }
      } else {
        self.setError("Invalid email or password")
        return { success: false, error: "Invalid email or password" }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed"
      self.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      self.setAuthenticating(false)
    }
  }),

  /**
   * Logout action - clears session and user data
   */
  logout: flow(function* () {
    self.setLoading(true)

    try {
      // Call logout API endpoint if needed
      // yield api.logout(self.session?.token)

      // Clear all user-related state
      self.setSession(null)
      self.setCurrentUser(null)
      self.clearError()

      // Keep user preferences even after logout
      // Don't clear preferences unless explicitly requested
    } catch (error) {
      console.warn("Logout error:", error)
      // Even if logout API fails, clear local state
      self.setSession(null)
      self.setCurrentUser(null)
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Initialize store from persisted data
   */
  hydrate: flow(function* () {
    self.setLoading(true)

    try {
      // Load persisted session
      const savedSession = storage.getString("userSession")
      if (savedSession) {
        const sessionData = JSON.parse(savedSession)
        self.setSession(sessionData)
      }

      // Load persisted user data
      const savedUserData = storage.getString("currentUser")
      if (savedUserData) {
        const userData = JSON.parse(savedUserData)
        self.setCurrentUser(userData)
      }

      // Load persisted preferences
      const savedPreferences = storage.getString("userPreferences")
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences)
        self.setPreferences(preferences)
      }

      // If we have a session but no user data, try to fetch user info
      if (savedSession && !savedUserData) {
        // yield self.fetchCurrentUser()
      }

      // Check if session is expired and auto-refresh if possible
      if (self.session && self.isSessionExpired && self.session.refreshToken) {
        // yield self.refreshSession()
      }
    } catch (error) {
      console.warn("Hydration error:", error)
      // Clear potentially corrupted data
      self.setSession(null)
      self.setCurrentUser(null)
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Refresh user data from API
   */
  refreshUser: flow(function* () {
    if (!self.session?.token) return

    self.setLoading(true)

    try {
      // Mock API call to refresh user data
      yield new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, you'd fetch from your API
      // const userData = yield api.getCurrentUser(self.session.token)
      // self.setCurrentUser(userData)

      console.log("User data refreshed")
    } catch (error) {
      console.warn("Failed to refresh user data:", error)
      self.setError("Failed to refresh user data")
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Update user profile
   */
  updateUserProfile: flow(function* (updates: { name?: string; avatar?: string }) {
    if (!self.session?.token) {
      self.setError("Not authenticated")
      return { success: false, error: "Not authenticated" }
    }

    self.setLoading(true)

    try {
      // Mock API call to update profile
      yield new Promise((resolve) => setTimeout(resolve, 800))

      // In a real app:
      // const updatedUser = yield api.updateProfile(self.session.token, updates)
      // self.setCurrentUser(updatedUser)

      // For demo, just update locally
      self.updateProfile(updates)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Update failed"
      self.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Change user preferences
   */
  updatePreferences: flow(function* (preferences: { theme?: string; language?: string; notifications?: boolean }) {
    self.setLoading(true)

    try {
      // Mock API call if preferences are stored on server
      yield new Promise((resolve) => setTimeout(resolve, 300))

      // Update preferences
      self.setPreferences(preferences)

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update preferences"
      self.setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      self.setLoading(false)
    }
  }),

  /**
   * Refresh session token
   */
  refreshSession: flow(function* () {
    if (!self.session?.refreshToken) {
      self.setError("No refresh token available")
      return { success: false, error: "No refresh token available" }
    }

    try {
      // Mock API call to refresh token
      yield new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app:
      // const newSession = yield api.refreshToken(self.session.refreshToken)
      // self.setSession(newSession)

      // For demo, create a new token
      const newSession = {
        token: "refreshed_token_" + Date.now(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        refreshToken: self.session.refreshToken,
      }

      self.setSession(newSession)
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Session refresh failed"
      self.setError(errorMessage)
      // If refresh fails, logout user
      yield self.logout()
      return { success: false, error: errorMessage }
    }
  }),
})