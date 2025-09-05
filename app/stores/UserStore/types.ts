import { Instance } from "mobx-state-tree"

import { User, UserSession, UserPreferences } from "./models"

/**
 * TypeScript interfaces for UserStore typing
 * This file provides type definitions to avoid circular imports
 */

/**
 * Base UserStore properties (the model definition)
 */
export interface IUserStoreModel {
  // Models
  currentUser?: Instance<typeof User>
  session?: Instance<typeof UserSession>
  preferences?: Instance<typeof UserPreferences>
  
  // Primitive states
  isLoading: boolean
  isAuthenticating: boolean
  error?: string
}

/**
 * UserStore views (computed properties)
 */
export interface IUserStoreViews {
  readonly isAuthenticated: boolean
  readonly userEmail: string
  readonly userDisplayName: string
  readonly userInitials: string
  readonly emailValidationError: string
  readonly isLoginValid: boolean
  readonly isSessionExpired: boolean
  readonly hasAvatar: boolean
  readonly userInfo: {
    id: string
    email: string
    name?: string
    displayName: string
    initials: string
    avatar?: string
    hasAvatar: boolean
  } | null
  readonly hasPreferences: boolean
  readonly currentTheme: string
  readonly notificationsEnabled: boolean
  readonly preferredLanguage: string
  readonly isAnyLoading: boolean
  readonly authStatus: {
    isAuthenticated: boolean
    isLoading: boolean
    hasUser: boolean
    hasSession: boolean
    isExpired: boolean
  }
}

/**
 * UserStore basic actions (synchronous)
 */
export interface IUserStoreActions {
  setLoading(loading: boolean): void
  setAuthenticating(authenticating: boolean): void
  setError(error: string | null): void
  clearError(): void
  setSession(sessionData: { 
    token: string
    expiresAt?: string
    refreshToken?: string 
  } | null): void
  setCurrentUser(userData: { 
    id: string
    email: string
    name?: string
    avatar?: string 
  } | null): void
  setPreferences(preferences: { 
    theme?: string
    language?: string
    notifications?: boolean 
  }): void
  setUserEmail(email: string): void
  updateProfile(updates: { name?: string; avatar?: string }): void
}

/**
 * UserStore async actions
 */
export interface IUserStoreAsyncActions {
  login(email: string, password: string): Promise<{ 
    success: boolean
    error?: string 
  }>
  logout(): Promise<void>
  hydrate(): Promise<void>
  refreshUser(): Promise<void>
  updateUserProfile(updates: { 
    name?: string
    avatar?: string 
  }): Promise<{ 
    success: boolean
    error?: string 
  }>
  updatePreferences(preferences: { 
    theme?: string
    language?: string
    notifications?: boolean 
  }): Promise<{ 
    success: boolean
    error?: string 
  }>
  refreshSession(): Promise<{ 
    success: boolean
    error?: string 
  }>
}

/**
 * Complete UserStore interface
 * Combines model, views, and actions for full type safety
 */
export interface IUserStore 
  extends IUserStoreModel, 
          IUserStoreViews, 
          IUserStoreActions, 
          IUserStoreAsyncActions {}