# MobX-State-Tree Modular Store Architecture

This project uses a modular approach to organize MobX-State-Tree stores for better maintainability, testability, and team collaboration.

## 📁 Directory Structure

```
app/stores/
├── README.md                 # This documentation file
├── index.ts                  # Main exports for all stores
├── types.ts                  # Shared TypeScript types
├── RootStore.ts             # Root store combining all stores
├── StoreProvider.tsx        # React provider and hooks
├── UserStore/               # User management store (modular)
│   ├── index.ts            # UserStore exports
│   ├── UserStore.ts        # Main store definition
│   ├── models.ts           # Data models (User, UserSession, UserPreferences)
│   ├── views.ts            # Computed values and getters
│   └── actions.ts          # State mutations and business logic
└── ProductStore/           # Example of another modular store
    ├── models.ts           # Product, Category, CartItem models
    ├── views.ts            # Product-related computed values
    └── actions.ts          # Product management actions
```

## 🏗️ Modular Store Architecture

### Why Modular?

Instead of putting everything in a single file, we separate stores into:

1. **Models** (`models.ts`) - Data structure definitions
2. **Views** (`views.ts`) - Computed values and getters
3. **Actions** (`actions.ts`) - State mutations and business logic
4. **Main Store** (`StoreType.ts`) - Combines all parts together

### Benefits

✅ **Separation of Concerns** - Each file has a specific responsibility  
✅ **Easier Testing** - Test models, views, and actions separately  
✅ **Better Maintainability** - Large stores don't become unwieldy  
✅ **Reusability** - Models can be reused across different stores  
✅ **Team Development** - Multiple developers can work on different aspects  
✅ **Code Organization** - Related functionality is grouped together

## 🧩 Creating a New Modular Store

### Step 1: Create Models (`models.ts`)

```typescript
import { types } from "mobx-state-tree"

export const MyModel = types.model("MyModel", {
  id: types.string,
  name: types.string,
  // ... other properties
})

export type MyModelType = typeof MyModel
```

### Step 2: Create Views (`views.ts`)

```typescript
export const myStoreViews = (self: any) => ({
  get computedValue() {
    return self.someProperty.length > 0
  },

  searchItems(query: string) {
    return self.items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  },
})
```

### Step 3: Create Actions (`actions.ts`)

```typescript
import { flow } from "mobx-state-tree"

export const myStoreActions = (self: any) => ({
  // Synchronous actions
  setLoading(loading: boolean) {
    self.isLoading = loading
  },
})

export const myStoreAsyncActions = (self: any) => ({
  // Asynchronous actions using flow
  fetchData: flow(function* () {
    self.setLoading(true)
    try {
      const data = yield api.fetchData()
      self.setData(data)
    } catch (error) {
      self.setError(error.message)
    } finally {
      self.setLoading(false)
    }
  }),
})
```

### Step 4: Create Main Store (`MyStore.ts`)

```typescript
import { types } from "mobx-state-tree"
import { MyModel } from "./models"
import { myStoreViews } from "./views"
import { myStoreActions, myStoreAsyncActions } from "./actions"

export const MyStore = types
  .model("MyStore", {
    items: types.array(MyModel),
    isLoading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .views(myStoreViews)
  .actions(myStoreActions)
  .actions(myStoreAsyncActions)

export type MyStoreType = typeof MyStore
```

### Step 5: Create Index File (`index.ts`)

```typescript
export { MyStore } from "./MyStore"
export type { MyStoreType } from "./MyStore"
export { MyModel } from "./models"
export type { MyModelType } from "./models"
```

## 🔧 Usage Patterns

### Basic Store Usage

```tsx
import { useStore, withStore } from "@/stores"

const MyComponent = withStore(() => {
  const store = useStore()
  const myStore = store.myStore

  // Use computed values
  console.log(myStore.computedValue)

  // Call actions
  const handleSubmit = async () => {
    await myStore.fetchData()
  }

  return <View>...</View>
})
```

### Using Store Hooks

```tsx
import { useUserStore, withStore } from "@/stores"

const ProfileScreen = withStore(() => {
  const userStore = useUserStore()

  // Access computed values
  const { isAuthenticated, userDisplayName, authStatus } = userStore

  // Call actions
  const handleUpdateProfile = async (updates) => {
    const result = await userStore.updateUserProfile(updates)
    if (result.success) {
      // Handle success
    }
  }

  return (
    <View>
      <Text>{userDisplayName}</Text>
      <Button onPress={() => handleUpdateProfile({ name: "New Name" })} />
    </View>
  )
})
```

## 🧪 Testing Modular Stores

### Testing Models

```typescript
import { User } from "@/stores/UserStore/models"

describe("User Model", () => {
  it("should create user with required fields", () => {
    const user = User.create({
      id: "1",
      email: "test@example.com",
    })

    expect(user.id).toBe("1")
    expect(user.email).toBe("test@example.com")
  })
})
```

### Testing Views

```typescript
import { UserStore } from "@/stores/UserStore"

describe("UserStore Views", () => {
  it("should compute display name correctly", () => {
    const store = UserStore.create({
      currentUser: { id: "1", email: "test@example.com", name: "Test User" },
    })

    expect(store.userDisplayName).toBe("Test User")
  })
})
```

### Testing Actions

```typescript
import { UserStore } from "@/stores/UserStore"

describe("UserStore Actions", () => {
  it("should set loading state", () => {
    const store = UserStore.create({})

    store.setLoading(true)
    expect(store.isLoading).toBe(true)

    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })
})
```

## 📝 Best Practices

### 1. Keep Models Simple

- Only define data structure, no business logic
- Use appropriate MST types (`types.string`, `types.boolean`, etc.)
- Add optional fields with `types.maybe()` or `types.optional()`

### 2. Use Views for Computed Values

- Never put business logic in views
- Keep views pure (no side effects)
- Use descriptive names for computed properties

### 3. Organize Actions by Complexity

- Simple synchronous mutations in basic actions
- Complex async operations in async actions using `flow`
- Group related actions together

### 4. Error Handling

- Always handle errors in async actions
- Provide meaningful error messages
- Clear errors when starting new operations

### 5. State Management

- Keep state flat when possible
- Use loading states for better UX
- Validate data before setting it

## 🔄 Migration from Monolithic Store

If you have an existing large store file, here's how to migrate:

1. **Extract Models** - Move all `types.model()` definitions to `models.ts`
2. **Extract Views** - Move all computed values and getters to `views.ts`
3. **Extract Actions** - Move all actions (sync and async) to `actions.ts`
4. **Update Main Store** - Import and compose everything in the main store file
5. **Update Imports** - Update all imports throughout your app
6. **Test** - Ensure everything works the same as before

## 🤝 Team Development

This modular structure enables better team collaboration:

- **Frontend Developers** can work on views and UI integration
- **Backend Developers** can work on actions and API integration
- **Data Architects** can work on models and data structure
- **QA Engineers** can easily test individual components

## 📚 Additional Resources

- [MobX-State-Tree Documentation](https://mobx-state-tree.js.org/)
- [MST Best Practices](https://mobx-state-tree.js.org/concepts/best-practices)
- [Testing MST Stores](https://mobx-state-tree.js.org/concepts/testing)
