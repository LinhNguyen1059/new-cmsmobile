import type { IUserStoreModel } from "./types"

/**
 * UserStore Views - Computed values and getters
 * This file contains all the view/computed logic for the UserStore
 * 
 * Now with proper TypeScript typing for full IntelliSense support!
 * You can now access self.isLoading, self.currentUser etc. with full type safety
 */

export const userStoreViews = (self: IUserStoreModel) => ({
  /**
   * Check if user is authenticated
   */
  get isAuthenticated() {
    return !!self.session?.token && !!self.currentUser
  },

  /**
   * Get user email for validation and display
   */
  get userEmail() {
    return self.currentUser?.email || ""
  },

  /**
   * Get user display name (name or email fallback)
   */
  get userDisplayName() {
    return self.currentUser?.name || self.currentUser?.email || "Unknown User"
  },

  /**
   * Get user initials for avatar display
   */
  get userInitials() {
    const name = self.currentUser?.name || self.currentUser?.email || ""
    return name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  },

  /**
   * Validate email format
   */
  get emailValidationError() {
    const email = this.userEmail
    if (!email || email.length === 0) return "Email can't be blank"
    if (email.length < 6) return "Email must be at least 6 characters"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Must be a valid email address"
    return ""
  },

  /**
   * Check if login form is valid
   */
  get isLoginValid() {
    return this.emailValidationError === ""
  },

  /**
   * Check if session is expired
   */
  get isSessionExpired() {
    if (!self.session?.expiresAt) return false
    return new Date() > new Date(self.session.expiresAt)
  },

  /**
   * Check if user has a profile picture
   */
  get hasAvatar() {
    return !!self.currentUser?.avatar
  },

  /**
   * Get formatted user info for display
   */
  get userInfo() {
    if (!self.currentUser) return null
    
    return {
      id: self.currentUser.id,
      email: self.currentUser.email,
      name: self.currentUser.name,
      displayName: this.userDisplayName,
      initials: this.userInitials,
      avatar: self.currentUser.avatar,
      hasAvatar: this.hasAvatar,
    }
  },

  /**
   * Check if user preferences are available
   */
  get hasPreferences() {
    return !!self.preferences
  },

  /**
   * Get current theme setting
   */
  get currentTheme() {
    return self.preferences?.theme || "system"
  },

  /**
   * Check if notifications are enabled
   */
  get notificationsEnabled() {
    return self.preferences?.notifications ?? true
  },

  /**
   * Get user's preferred language
   */
  get preferredLanguage() {
    return self.preferences?.language || "en"
  },

  /**
   * Check if store is in any loading state
   */
  get isAnyLoading() {
    return self.isLoading || self.isAuthenticating
  },

  /**
   * Get authentication status summary
   */
  get authStatus() {
    return {
      isAuthenticated: this.isAuthenticated,
      isLoading: self.isAuthenticating,
      hasUser: !!self.currentUser,
      hasSession: !!self.session,
      isExpired: this.isSessionExpired,
    }
  },
})