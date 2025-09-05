import { types } from "mobx-state-tree"

/**
 * User model representing a single user entity
 * This contains the core data structure for a user
 */
export const User = types.model("User", {
  id: types.string,
  email: types.string,
  name: types.maybe(types.string),
  avatar: types.maybe(types.string),
  // Add other user properties as needed
  // phone: types.maybe(types.string),
  // role: types.maybe(types.string),
  // createdAt: types.maybe(types.string),
})

/**
 * UserSession model for session-related data
 * Separate from User to handle session-specific information
 */
export const UserSession = types.model("UserSession", {
  token: types.string,
  expiresAt: types.maybe(types.string),
  refreshToken: types.maybe(types.string),
  // Add session-specific properties
  // deviceId: types.maybe(types.string),
  // lastActivity: types.maybe(types.string),
})

/**
 * UserPreferences model for user settings
 * Keeps user preferences separate from core user data
 */
export const UserPreferences = types.model("UserPreferences", {
  theme: types.optional(types.enumeration(["light", "dark", "system"]), "system"),
  language: types.optional(types.string, "en"),
  notifications: types.optional(types.boolean, true),
  // Add other preferences
  // emailNotifications: types.optional(types.boolean, true),
  // pushNotifications: types.optional(types.boolean, true),
})

// Export types for use in other files
export type UserType = typeof User
export type UserSessionType = typeof UserSession  
export type UserPreferencesType = typeof UserPreferences