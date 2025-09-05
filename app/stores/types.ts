import { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree"

import type { RootStore } from "./RootStore"
import type { UserStore } from "./UserStore"

/**
 * Root store instance type
 */
export interface RootStoreInstance extends Instance<typeof RootStore> {}

/**
 * Root store snapshot out type
 */
export interface RootStoreSnapshotOut extends SnapshotOut<typeof RootStore> {}

/**
 * Root store snapshot in type
 */
export interface RootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}

/**
 * User store instance type
 */
export interface UserStoreInstance extends Instance<typeof UserStore> {}

/**
 * User store snapshot out type
 */
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStore> {}

/**
 * User store snapshot in type
 */
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStore> {}

/**
 * Navigation reference type for store usage
 */
export interface NavigationStore {
  navigate: (routeName: string, params?: any) => void
  goBack: () => void
  reset: (state: any) => void
}
