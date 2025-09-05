# Typed MobX-State-Tree Stores - Complete Example

This document shows how to create properly typed MobX-State-Tree stores for full TypeScript IntelliSense support.

## 🎯 The Problem

When using `self: any`, you lose all type safety and IntelliSense:

```typescript
// ❌ BAD - No type safety
export const userStoreViews = (self: any) => ({
  get isAuthenticated() {
    return self.isLoading // ❌ No IntelliSense, could be wrong property name
  },
})
```

## ✅ The Solution

Use proper TypeScript interfaces to get full type safety:

```typescript
// ✅ GOOD - Full type safety
export const userStoreViews = (self: IUserStoreModel) => ({
  get isAuthenticated() {
    return self.isLoading // ✅ Full IntelliSense, compile-time type checking
  },
})
```

## 📁 Complete Typed Store Structure

### 1. Create Types File (`types.ts`)

```typescript
import { Instance } from "mobx-state-tree"
import { MyModel } from "./models"

/**
 * Base store model interface
 */
export interface IMyStoreModel {
  // Primitive states
  items: Instance<typeof MyModel>[]
  isLoading: boolean
  error?: string

  // Model instances
  selectedItem?: Instance<typeof MyModel>
}

/**
 * Store views interface
 */
export interface IMyStoreViews {
  readonly itemCount: number
  readonly hasItems: boolean
  readonly isReady: boolean
}

/**
 * Store actions interface
 */
export interface IMyStoreActions {
  setLoading(loading: boolean): void
  setError(error: string | null): void
  addItem(item: any): void
  removeItem(id: string): void
}

/**
 * Async actions interface
 */
export interface IMyStoreAsyncActions {
  fetchItems(): Promise<void>
  saveItem(item: any): Promise<{ success: boolean; error?: string }>
}

/**
 * Complete store interface
 */
export interface IMyStore
  extends IMyStoreModel,
    IMyStoreViews,
    IMyStoreActions,
    IMyStoreAsyncActions {}
```

### 2. Create Models (`models.ts`)

```typescript
import { types } from "mobx-state-tree"

export const MyModel = types.model("MyModel", {
  id: types.string,
  name: types.string,
  isActive: types.optional(types.boolean, true),
})

export type MyModelType = typeof MyModel
```

### 3. Create Views with Typing (`views.ts`)

```typescript
import type { IMyStoreModel } from "./types"

export const myStoreViews = (self: IMyStoreModel) => ({
  /**
   * Get total item count
   * Now you have full IntelliSense for self.items!
   */
  get itemCount() {
    return self.items.length // ✅ TypeScript knows self.items is an array
  },

  /**
   * Check if store has any items
   */
  get hasItems() {
    return self.items.length > 0 // ✅ Full type safety
  },

  /**
   * Check if store is ready (not loading and no error)
   */
  get isReady() {
    return !self.isLoading && !self.error // ✅ IntelliSense for isLoading and error
  },

  /**
   * Search items by name
   */
  searchItems(query: string) {
    return self.items.filter(
      (
        item, // ✅ TypeScript knows items structure
      ) => item.name.toLowerCase().includes(query.toLowerCase()),
    )
  },
})
```

### 4. Create Actions with Typing (`actions.ts`)

```typescript
import { flow } from "mobx-state-tree"
import type { IMyStoreModel } from "./types"
import { MyModel } from "./models"

/**
 * Basic synchronous actions
 */
export const myStoreActions = (self: IMyStoreModel) => ({
  /**
   * Set loading state
   * Full type checking for self.isLoading
   */
  setLoading(loading: boolean) {
    self.isLoading = loading // ✅ TypeScript ensures isLoading is boolean
  },

  /**
   * Set error message
   */
  setError(error: string | null) {
    self.error = error || undefined // ✅ Type-safe error handling
  },

  /**
   * Add new item
   */
  addItem(itemData: { id: string; name: string; isActive?: boolean }) {
    const item = MyModel.create(itemData)
    self.items.push(item) // ✅ TypeScript knows items is an array
  },

  /**
   * Remove item by ID
   */
  removeItem(id: string) {
    const index = self.items.findIndex((item) => item.id === id) // ✅ Full IntelliSense
    if (index > -1) {
      self.items.splice(index, 1) // ✅ Type-safe array operations
    }
  },
})

/**
 * Async actions using flow
 */
export const myStoreAsyncActions = (self: IMyStoreModel) => ({
  /**
   * Fetch items from API
   */
  fetchItems: flow(function* () {
    self.setLoading(true) // ✅ TypeScript knows this method exists
    self.setError(null) // ✅ Full type safety

    try {
      // Simulate API call
      const response = yield fetch("/api/items")
      const data = yield response.json()

      // Clear existing items and add new ones
      self.items.clear() // ✅ TypeScript knows clear() exists on arrays
      data.forEach((itemData: any) => {
        self.addItem(itemData) // ✅ IntelliSense for addItem method
      })
    } catch (error) {
      self.setError(error instanceof Error ? error.message : "Failed to fetch items")
    } finally {
      self.setLoading(false)
    }
  }),
})
```

### 5. Create Main Store (`MyStore.ts`)

```typescript
import { types } from "mobx-state-tree"
import { MyModel } from "./models"
import { myStoreViews } from "./views"
import { myStoreActions, myStoreAsyncActions } from "./actions"
import type { IMyStore } from "./types"

const MyStoreModel = types.model("MyStore", {
  items: types.array(MyModel),
  isLoading: types.optional(types.boolean, false),
  error: types.maybe(types.string),
  selectedItem: types.maybe(MyModel),
})

/**
 * Fully typed store with complete IntelliSense support
 */
export const MyStore = MyStoreModel.views(myStoreViews)
  .actions(myStoreActions)
  .actions(myStoreAsyncActions)

export type MyStoreType = typeof MyStore

// Export the interface for external use
export type { IMyStore } from "./types"
```

## 🚀 Benefits of This Approach

### ✅ Full IntelliSense Support

```typescript
const store = useMyStore()

// All these have full autocomplete and type checking:
store.items // ✅ TypeScript knows this is an array
store.isLoading // ✅ TypeScript knows this is boolean
store.itemCount // ✅ Computed property with type checking
store.setLoading // ✅ Method signature is fully typed
store.fetchItems() // ✅ Async method with return type
```

### ✅ Compile-Time Error Detection

```typescript
// These will show errors at compile time:
store.isLoadingg = true // ❌ Typo detected
store.setLoading("yes") // ❌ Wrong parameter type
store.items.push("string") // ❌ Wrong array item type
```

### ✅ Better Refactoring Support

- Rename properties safely across the entire codebase
- Find all usages of store properties and methods
- Automated refactoring tools work perfectly

### ✅ Enhanced Development Experience

- No more guessing property names or types
- Instant feedback on API changes
- Self-documenting code through types

## 📝 Usage in Components

```typescript
import { useMyStore, withStore } from "@/stores"

const MyComponent = withStore(() => {
  const myStore = useMyStore()

  // ✅ Full type safety and IntelliSense
  const handleRefresh = async () => {
    await myStore.fetchItems() // ✅ Autocomplete knows this method exists
  }

  return (
    <View>
      <Text>{myStore.itemCount} items</Text> {/* ✅ Knows itemCount is number */}
      {myStore.isLoading && <ActivityIndicator />} {/* ✅ Knows isLoading is boolean */}
      <Button onPress={handleRefresh} title="Refresh" />
    </View>
  )
})
```

## 🧪 Testing with Types

```typescript
import { MyStore } from "@/stores/MyStore"

describe("MyStore", () => {
  let store: typeof MyStore.Type // ✅ Proper typing for tests

  beforeEach(() => {
    store = MyStore.create({
      items: [],
      isLoading: false,
    })
  })

  it("should have correct initial state", () => {
    expect(store.itemCount).toBe(0) // ✅ TypeScript knows itemCount exists
    expect(store.isLoading).toBe(false) // ✅ Full type checking in tests
    expect(store.hasItems).toBe(false) // ✅ Computed properties work
  })
})
```

This approach gives you the best of both worlds: the power and flexibility of MobX-State-Tree with the safety and developer experience of full TypeScript support!
