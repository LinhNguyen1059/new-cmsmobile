import { types, Instance, flow } from "mobx-state-tree";

import { load, remove, save, USER_STORAGE_KEY } from "@/utils/storage";

import { AuthModel } from "./Auth/model";
import { UserModel } from "./User/model";
import { IUserModel } from "./User/types";
import { withSetPropAction } from "../utils/withSetPropAction";

/**
 * UserStore model definition
 */
const UserStoreModel = types
  .model("UserStore", {
    user: types.maybeNull(UserModel),
    auth: types.optional(AuthModel, {}),
  })
  .actions(withSetPropAction)
  .actions((self) => ({
    /**
     * Set the current user
     */
    setUser(userData: {
      id: string;
      email: string;
      firstName?: string;
      lastName?: string;
      avatar?: string;
    }) {
      self.user = UserModel.create(userData);
      // Persist to storage
      save(USER_STORAGE_KEY, JSON.stringify(userData));
    },

    /**
     * Clear the current user (logout)
     */
    clearUser() {
      self.user = null;
      // Remove from storage
      remove(USER_STORAGE_KEY);
    },

    /**
     * Initialize user from storage
     */
    initializeUser: flow(function* () {
      try {
        const userData = load<IUserModel>(USER_STORAGE_KEY);
        if (userData) {
          self.user = UserModel.create(userData);
        }
      } catch (error) {
        console.warn("Failed to initialize user from storage:", error);
      }
    }),
  }));

/**
 * UserStore - Main store for user authentication and profile management
 * Uses MobX-State-Tree's automatic type inference for full type safety
 */
export const UserStore = UserStoreModel;

/**
 * Initial state for UserStore
 * Provides default values that match the model structure
 */
export const initialUserStore = {
  user: null,
  auth: {
    email: "",
    password: "",
  },
};

// Export types using MobX-State-Tree's automatic type inference
export type IUserStore = Instance<typeof UserStore>;
export type UserStoreType = typeof UserStore;

// Export individual model types for convenience
export type { IUserModel } from "./User/types";
export type { IAuth } from "./Auth/types";

// Export UserStore actions interface
export interface IUserStoreActions {
  setUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  }): void;
  clearUser(): void;
  initializeUser(): Promise<void>;
}
