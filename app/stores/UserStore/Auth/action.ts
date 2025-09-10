import { flow, getParent } from "mobx-state-tree";

import { IAuth } from "./types";

/**
 * Get the parent UserStore with proper typing
 */
const getUserStore = (self: any) => {
  return getParent(self) as {
    setUser: (userData: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    }) => void;
    clearUser: () => void;
  };
};

/**
 * Basic actions for simple state mutations
 */
export const authActions = (self: IAuth) => ({
  /**
   * Update auth fields
   */
  setEmail(email: string) {
    self.email = email;
  },

  setPassword(password: string) {
    self.password = password;
  },

  /**
   * Clear auth fields
   */
  clearFields() {
    self.email = "";
    self.password = "";
  },
});

/**
 * Async actions
 */
export const authAsyncActions = (self: IAuth) => ({
  /**
   * Login user with email and password
   */
  login: flow(function* () {
    try {
      if (!self.email || !self.password) {
        return { success: false, error: "Email and password are required" };
      }

      // Mock API call - replace with your actual API
      yield new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - replace with actual API response
      const mockUser = {
        id: "user-123",
        email: self.email,
        firstName: "John",
        lastName: "Doe",
      };

      // Get parent UserStore and set the user
      const userStore = getUserStore(self);
      userStore.setUser(mockUser);

      // Clear password after successful login
      self.password = "";

      return { success: true, user: mockUser };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Login failed" };
    }
  }),

  /**
   * Logout current user
   */
  logout: flow(function* () {
    try {
      // Get parent UserStore and clear the user
      const userStore = getUserStore(self);
      userStore.clearUser();

      // Clear auth fields
      self.clearFields?.();
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      return { success: false, error: error.message || "Logout failed" };
    }
  }),
});
