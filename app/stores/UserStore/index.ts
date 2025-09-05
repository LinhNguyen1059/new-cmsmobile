/**
 * UserStore Module
 * 
 * A modular MobX-State-Tree store for user management, authentication,
 * and preferences. This module is organized into separate files for
 * better maintainability:
 * 
 * - models.ts: Data models (User, UserSession, UserPreferences)
 * - views.ts: Computed values and getters
 * - actions.ts: State mutations and business logic
 * - UserStore.ts: Main store combining all parts
 */

// Main store export
export { UserStore } from "./UserStore"
export type { UserStoreType } from "./UserStore"

// Model exports
export { User, UserSession, UserPreferences } from "./models"
export type { UserType, UserSessionType, UserPreferencesType } from "./models"

// Type interfaces export
export type { 
  IUserStore, 
  IUserStoreModel, 
  IUserStoreViews, 
  IUserStoreActions, 
  IUserStoreAsyncActions 
} from "./types"

// Views and actions are not exported directly since they're composed into UserStore
// but you can import them if you need to test them separately:
// import { userStoreViews } from "./views"
// import { userStoreActions, userStoreAsyncActions } from "./actions"

/**
 * Directory Structure:
 * 
 * app/stores/UserStore/
 * ├── index.ts          # This file - main exports
 * ├── UserStore.ts      # Main store definition
 * ├── models.ts         # Data models
 * ├── views.ts          # Computed values
 * └── actions.ts        # Business logic
 * 
 * Benefits of this structure:
 * 
 * 1. **Separation of Concerns**: Each file has a specific responsibility
 * 2. **Easier Testing**: You can test models, views, and actions separately
 * 3. **Better Maintainability**: Large stores don't become unwieldy
 * 4. **Reusability**: Models can be reused in different stores
 * 5. **Team Development**: Multiple developers can work on different aspects
 * 6. **Code Organization**: Related functionality is grouped together
 * 
 * Usage:
 * ```tsx
 * import { UserStore } from "@/stores/UserStore"
 * import { User } from "@/stores/UserStore" // Individual model if needed
 * ```
 */