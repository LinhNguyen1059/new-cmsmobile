/**
 * User models
 */
export interface IUserModel {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

/**
 * User views (computed properties)
 */
export interface IUserViews {
  readonly fullname: string;
}

/**
 * User basic actions (synchronous)
 */
export interface IUserActions {
  updateUserFields?(updates: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
  }): void;
}

/**
 * User async actions
 */
export interface IUserAsyncActions {
  hydrate?(): Promise<void>;
  updateUserProfile?(updates: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    email?: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }>;
}

/**
 * Complete User interface
 * Combines model, views, and actions for full type safety
 */
export interface IUser extends IUserModel, IUserViews, IUserActions, IUserAsyncActions {}
