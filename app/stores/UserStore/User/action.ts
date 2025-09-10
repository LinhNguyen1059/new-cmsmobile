import { flow } from "mobx-state-tree";

import { load, save, USER_STORAGE_KEY } from "@/utils/storage";

import { IUser, IUserModel } from "./types";

/**
 * Basic actions for simple state mutations
 */
export const userActions = (self: IUser) => ({
  /**
   * Update multiple user fields at once
   */
  updateUserFields(updates: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
  }) {
    if (self) {
      // Only update fields that are provided
      if (updates.firstName !== undefined) {
        self.firstName = updates.firstName;
      }
      if (updates.lastName !== undefined) {
        self.lastName = updates.lastName;
      }
      if (updates.avatar !== undefined) {
        self.avatar = updates.avatar;
      }
      if (updates.email !== undefined) {
        self.email = updates.email;
      }

      // Persist the updated user data
      save(
        USER_STORAGE_KEY,
        JSON.stringify({
          id: self.id,
          email: self.email,
          firstName: self.firstName,
          lastName: self.lastName,
          avatar: self.avatar,
        }),
      );
    }
  },
});

/**
 * Async actions
 */
export const userAsyncActions = (self: IUser) => ({
  /**
   * Initialize User from persisted data
   */
  hydrate: flow(function* () {
    try {
      const userData = load<IUserModel>(USER_STORAGE_KEY);
      if (userData) {
        if (self.updateUserFields) {
          self.updateUserFields(userData);
        }
      }
    } catch (error) {
      console.warn("User hydration error:", error);
    }
  }),

  /**
   * Update user profile on server and locally
   */
  updateUserProfile: flow(function* (updates: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
  }) {
    if (!self.id) {
      return { success: false, error: "No user logged in" };
    }

    try {
      // Mock API call - replace with your actual API
      yield new Promise((resolve) => setTimeout(resolve, 800));

      if (self.updateUserFields) {
        self.updateUserFields(updates);
      }
      self.hydrate?.();
      return { success: true };
    } catch (error: any) {
      console.log("🚀 ~ userAsyncActions ~ error:", error);
      return { success: false };
    } finally {
    }
  }),
});
