# Development Guidelines

> Comprehensive development standards, workflows, and best practices for CMSMobile

## 🎯 Overview

This guide establishes coding standards, development workflows, and best practices to ensure consistent, maintainable, and high-quality code across the CMSMobile project.

## 📋 Table of Contents

1. [Code Standards](#code-standards)
2. [TypeScript Guidelines](#typescript-guidelines)
3. [Component Development](#component-development)
4. [State Management](#state-management)
5. [Testing Strategy](#testing-strategy)
6. [Git Workflow](#git-workflow)
7. [Performance Guidelines](#performance-guidelines)
8. [Security Best Practices](#security-best-practices)
9. [Development Tools](#development-tools)

## 🎨 Code Standards

### ESLint Configuration

The project uses a comprehensive ESLint setup with the following key rules:

```javascript
// .eslintrc.js highlights
extends: [
  "plugin:@typescript-eslint/recommended",
  "plugin:react/recommended",
  "plugin:react-native/all",
  "expo",
  "plugin:react/jsx-runtime",
  "prettier"
]
```

#### Key Rules

1. **Import Organization**: Automatic import sorting with groups
2. **No Restricted Imports**: Enforces custom component usage
3. **TypeScript Strict**: Requires proper typing
4. **Prettier Integration**: Code formatting consistency

#### Import Order Standards

```typescript
// 1. React and React Native (external)
import React, { useState, useEffect } from "react"
import { View, TouchableOpacity } from "react-native"

// 2. Expo modules
import { StatusBar } from "expo-status-bar"

// 3. Third-party libraries
import { observer } from "mobx-react-lite"

// 4. Internal modules (@ alias)
import { Button, Text } from "@/components/ui"
import { useStores } from "@/stores"
import { colors } from "@/theme"

// 5. Relative imports
import { LocalComponent } from "./LocalComponent"
import styles from "./styles"
```

### Prettier Configuration

Code formatting is automatically handled by Prettier with these standards:

```json
{
  "semi": false,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

### Pre-commit Hooks

Husky enforces code quality with pre-commit hooks:

```bash
# .husky/pre-commit
yarn pre-commit  # Runs lint:check + prettier:check
```

## 📘 TypeScript Guidelines

### Strict TypeScript Configuration

```json
// tsconfig.json key settings
{
  "strict": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "noImplicitThis": true
}
```

### Type Definitions

#### 1. Interface vs Type

**Use `interface` for:**

- Object shapes that might be extended
- Component props
- API response structures

```typescript
interface UserProps {
  user: User
  onPress: (id: string) => void
}

interface User {
  id: string
  name: string
  email: string
}
```

**Use `type` for:**

- Union types
- Computed types
- Function signatures

```typescript
type Theme = "light" | "dark"
type Status = "loading" | "success" | "error"
type EventHandler<T> = (event: T) => void
```

#### 2. Prop Types Pattern

```typescript
// Component props with variants
interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  children: React.ReactNode
}

// Optional vs required props
interface FormProps {
  // Required props
  onSubmit: (data: FormData) => void
  title: string

  // Optional props with defaults
  showCancel?: boolean // Default: false
  variant?: "modal" | "page" // Default: "page"
}
```

#### 3. Generic Types

```typescript
// API Response wrapper
interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// Store action return type
type ActionResult<T> = { success: true; data: T } | { success: false; error: string }

// Hook return pattern
function useAsyncData<T>(fetcher: () => Promise<T>): {
  data: T | null
  loading: boolean
  error: string | null
} {
  // Implementation
}
```

### Path Aliases

Use configured path aliases for clean imports:

```typescript
// ✅ Good - Use path aliases
import { Button } from "@/components/ui"
import { useStores } from "@/stores"
import { colors } from "@/theme"
import logo from "@assets/images/logo.png"

// ❌ Bad - Relative paths
import { Button } from "../../components/ui"
import { useStores } from "../../../stores"
```

## 🧩 Component Development

### Component Structure Standards

#### 1. File Organization

```
ComponentName/
├── index.ts              # Barrel export
├── ComponentName.tsx     # Main component
├── ComponentName.test.tsx # Unit tests
├── types.ts             # Component-specific types
└── styles.ts            # Styles (if needed)
```

#### 2. Component Template

```typescript
// ComponentName.tsx
import React, { forwardRef, ForwardedRef } from "react"
import { View, ViewProps } from "react-native"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"
import { Text } from "@/components/ui"

// Define variants with CVA
const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Props interface
export interface ComponentNameProps
  extends ViewProps,
  VariantProps<typeof componentVariants> {
  children: React.ReactNode
  title?: string
  onPress?: () => void
}

// Component implementation
const ComponentName = forwardRef<View, ComponentNameProps>(
  function ComponentName(props, ref) {
    const {
      children,
      title,
      variant,
      size,
      className,
      onPress,
      ...rest
    } = props

    return (
      <View
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...rest}
      >
        {title && <Text variant="h3" text={title} />}
        {children}
      </View>
    )
  }
)

export { ComponentName }
```

#### 3. Custom Hooks Pattern

```typescript
// useComponentName.ts
import { useState, useEffect, useCallback } from "react"

interface UseComponentNameOptions {
  initialValue?: string
  autoSave?: boolean
}

export function useComponentName(options: UseComponentNameOptions = {}) {
  const { initialValue = "", autoSave = false } = options

  const [value, setValue] = useState(initialValue)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Save logic
      await saveValue(value)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed")
    } finally {
      setLoading(false)
    }
  }, [value])

  useEffect(() => {
    if (autoSave && value !== initialValue) {
      const timeout = setTimeout(handleSave, 1000)
      return () => clearTimeout(timeout)
    }
  }, [value, autoSave, initialValue, handleSave])

  return {
    value,
    setValue,
    loading,
    error,
    save: handleSave,
  }
}
```

## 🏪 State Management

### MobX-State-Tree Best Practices

Following the project's established MobX patterns:

#### 1. Store Structure

```typescript
// UserStore/User/models.ts
import { types } from "mobx-state-tree"

export const UserModel = types
  .model("User", {
    id: types.identifier,
    email: types.string,
    firstName: types.string,
    lastName: types.string,
    avatar: types.maybe(types.string),
    createdAt: types.string,
    updatedAt: types.string,
  })
  .views((self) => ({
    get fullName() {
      return `${self.firstName} ${self.lastName}`
    },

    get initials() {
      return `${self.firstName[0]}${self.lastName[0]}`.toUpperCase()
    },
  }))
  .actions((self) => ({
    setFirstName(firstName: string) {
      self.firstName = firstName
    },

    setLastName(lastName: string) {
      self.lastName = lastName
    },

    setEmail(email: string) {
      self.email = email
    },
  }))
```

#### 2. Async Actions Pattern

```typescript
// UserStore/actions.ts
import { flow, types } from "mobx-state-tree"

import { userService } from "@/services/api/user"
import { withSetPropAction } from "../utils/withSetPropAction"

export const userActions = (self: any) =>
  withSetPropAction(self, {
    // Loading states
    setLoading(loading: boolean) {
      self.loading = loading
    },

    setError(error: string | null) {
      self.error = error
    },

    // Async action with flow
    loadProfile: flow(function* (userId: string) {
      self.setLoading(true)
      self.setError(null)

      try {
        const result = yield userService.getProfile(userId)

        if (result.kind === "ok") {
          self.setUser(result.user)
        } else {
          self.setError(self.getErrorMessage(result))
        }
      } catch (error) {
        self.setError("Failed to load profile")
      } finally {
        self.setLoading(false)
      }
    }),

    // Individual field updates
    updateFirstName: flow(function* (firstName: string) {
      if (!self.user) return

      try {
        const result = yield userService.updateUser(self.user.id, { firstName })

        if (result.kind === "ok") {
          self.user.setFirstName(firstName)
        } else {
          throw new Error(self.getErrorMessage(result))
        }
      } catch (error) {
        // Handle error appropriately
        throw error
      }
    }),
  })
```

#### 3. Store Composition

```typescript
// UserStore/index.ts
import { Instance, types } from "mobx-state-tree"

import { UserModel } from "./User/models"
import { userActions } from "./actions"
import { userViews } from "./views"

export const UserStore = types
  .model("UserStore")
  .props({
    user: types.maybe(UserModel),
    loading: types.optional(types.boolean, false),
    error: types.maybe(types.string),
  })
  .views(userViews)
  .actions(userActions)

export interface IUserStore extends Instance<typeof UserStore> {}
```

### Store Usage in Components

```typescript
// Component with store integration
const ProfileScreen = observer(function ProfileScreen() {
  const { userStore } = useStores()

  useEffect(() => {
    if (userStore.user?.id) {
      userStore.loadProfile(userStore.user.id)
    }
  }, [userStore.user?.id])

  if (userStore.loading) {
    return <LoadingScreen />
  }

  if (userStore.error) {
    return <ErrorScreen error={userStore.error} />
  }

  return (
    <Screen>
      <Text variant="h1" text={userStore.user?.fullName} />
      {/* Profile content */}
    </Screen>
  )
})
```

## 🧪 Testing Strategy

### Test Structure

```
__tests__/
├── components/           # Component tests
│   ├── ui/              # UI component tests
│   └── screens/         # Screen tests
├── stores/              # Store tests
├── services/            # API service tests
├── utils/               # Utility function tests
└── __mocks__/           # Mock implementations
```

### Unit Testing Patterns

#### 1. Component Testing

```typescript
// __tests__/components/Button.test.tsx
import React from "react"
import { render, fireEvent, screen } from "@testing-library/react-native"

import { Button } from "@/components/ui"

describe("Button Component", () => {
  it("renders text correctly", () => {
    render(<Button text="Click me" />)
    expect(screen.getByText("Click me")).toBeTruthy()
  })

  it("handles press events", () => {
    const onPress = jest.fn()
    render(<Button text="Click me" onPress={onPress} />)

    fireEvent.press(screen.getByText("Click me"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("applies disabled state correctly", () => {
    render(<Button text="Disabled" disabled />)

    const button = screen.getByRole("button")
    expect(button.props.accessibilityState.disabled).toBe(true)
  })

  it("renders with correct variant classes", () => {
    const { rerender } = render(<Button text="Primary" variant="default" />)

    // Test different variants
    const variants = ["default", "secondary", "destructive"] as const
    variants.forEach(variant => {
      rerender(<Button text="Test" variant={variant} />)
      // Assert variant-specific styling
    })
  })
})
```

#### 2. Store Testing

```typescript
// __tests__/stores/UserStore.test.ts
import { userService } from "@/services/api/user"
import { UserStore } from "@/stores/UserStore"

// Mock API service
jest.mock("@/services/api/user")
const mockUserService = userService as jest.Mocked<typeof userService>

describe("UserStore", () => {
  let store: any

  beforeEach(() => {
    store = UserStore.create()
    jest.clearAllMocks()
  })

  it("loads user profile successfully", async () => {
    const mockUser = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    }

    mockUserService.getProfile.mockResolvedValue({
      kind: "ok",
      user: mockUser,
    })

    await store.loadProfile("1")

    expect(store.user).toEqual(expect.objectContaining(mockUser))
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it("handles profile loading errors", async () => {
    mockUserService.getProfile.mockResolvedValue({
      kind: "server",
    })

    await store.loadProfile("1")

    expect(store.user).toBe(undefined)
    expect(store.loading).toBe(false)
    expect(store.error).toBeTruthy()
  })

  it("updates individual fields", async () => {
    // Setup existing user
    store.setUser({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    })

    mockUserService.updateUser.mockResolvedValue({
      kind: "ok",
      user: { ...store.user, firstName: "Jane" },
    })

    await store.updateFirstName("Jane")

    expect(store.user.firstName).toBe("Jane")
  })
})
```

#### 3. Integration Testing

```typescript
// __tests__/integration/LoginFlow.test.tsx
import React from "react"
import { render, fireEvent, waitFor, screen } from "@testing-library/react-native"

import { LoginScreen } from "@/screens/LoginScreen"
import { setupRootStore } from "@/stores/utils/setupRootStore"

describe("Login Flow Integration", () => {
  let rootStore: any

  beforeEach(async () => {
    rootStore = await setupRootStore()
  })

  it("completes login flow successfully", async () => {
    render(<LoginScreen />)

    // Fill in form
    fireEvent.changeText(screen.getByLabelText("Email"), "test@example.com")
    fireEvent.changeText(screen.getByLabelText("Password"), "password123")

    // Submit form
    fireEvent.press(screen.getByText("Login"))

    // Wait for navigation or success state
    await waitFor(() => {
      expect(rootStore.userStore.user).toBeTruthy()
    })
  })
})
```

### E2E Testing with Maestro

```yaml
# .maestro/flows/login.yaml
appId: com.i3international.cmsapp
---
- launchApp
- tapOn: "Login"
- inputText: "test@example.com"
- tapOn: "Password"
- inputText: "password123"
- tapOn: "Sign In"
- assertVisible: "Welcome"
```

## 🔄 Git Workflow

### Branch Naming Convention

```bash
# Feature branches
feature/user-authentication
feature/payment-integration

# Bug fixes
bugfix/login-validation-error
bugfix/memory-leak-flatlist

# Hotfixes
hotfix/critical-crash-android

# Release branches
release/v1.2.0
```

### Commit Message Format

Follow conventional commits:

```bash
# Format: <type>(<scope>): <description>
feat(auth): add biometric authentication
fix(navigation): resolve deep link handling
docs(readme): update installation instructions
style(components): fix button spacing
refactor(stores): optimize user store actions
test(login): add unit tests for login form
chore(deps): update react-native to 0.79.4
```

### Pull Request Process

1. **Create feature branch** from `main`
2. **Develop and test** changes thoroughly
3. **Run quality checks**:
   ```bash
   yarn lint:check      # ESLint validation
   yarn prettier:check  # Code formatting
   yarn compile         # TypeScript compilation
   yarn test           # Unit tests
   ```
4. **Create pull request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Test results
   - Breaking changes noted
5. **Code review** by team members
6. **Merge** after approval and CI passes

## ⚡ Performance Guidelines

### React Native Performance

#### 1. Component Optimization

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <ComplexRendering data={data} />
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id
})

// Use useCallback for event handlers
const MyComponent = () => {
  const handlePress = useCallback((id: string) => {
    navigation.navigate("Details", { id })
  }, [navigation])

  return <Button onPress={() => handlePress(item.id)} />
}

// Use useMemo for expensive calculations
const MyComponent = ({ items }) => {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  return <FlatList data={sortedItems} />
}
```

#### 2. List Optimization

```typescript
// Use FlashList for large datasets
import { FlashList } from "@shopify/flash-list"

const OptimizedList = ({ data }) => {
  const renderItem = useCallback(({ item }) => (
    <ListItem key={item.id} item={item} />
  ), [])

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      estimatedItemSize={100}
      keyExtractor={(item) => item.id}
    />
  )
}

// Implement proper keyExtractor
const keyExtractor = (item: Item) => item.id

// Use getItemLayout when possible
const getItemLayout = (data: any, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
})
```

#### 3. Image Optimization

```typescript
// Use appropriate image formats and sizes
<AutoImage
  source={{ uri: imageUrl }}
  maxWidth={300}
  resizeMode="cover"
  style={{ borderRadius: 8 }}
/>

// Implement image caching
const CachedImage = ({ uri, ...props }) => {
  return (
    <Image
      source={{ uri, cache: "force-cache" }}
      {...props}
    />
  )
}
```

### Bundle Size Optimization

```typescript
// Use dynamic imports for code splitting
const LazyScreen = React.lazy(() => import("./LazyScreen"))

// Tree shake unused imports
import { debounce } from "lodash-es" // ✅ Tree-shakeable
import _ from "lodash" // ❌ Imports entire library

// Use barrel exports efficiently
// index.ts - Only export what's needed
export { Button } from "./Button"
export { Input } from "./Input"
// Don't export everything with export *
```

## 🔒 Security Best Practices

### Data Security

```typescript
// Secure storage for sensitive data
import { storage } from "@/utils/storage"

// Store tokens securely
await storage.set("authToken", token) // Uses MMKV with encryption

// Never log sensitive data
if (__DEV__) {
  console.log("User profile:", {
    ...user,
    password: "[REDACTED]",
    token: "[REDACTED]",
  })
}

// Validate all inputs
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
```

### API Security

```typescript
// Always use HTTPS endpoints
const API_CONFIG = {
  url: "https://api.example.com", // ✅ HTTPS
  timeout: 30000,
}

// Implement proper error handling
const handleApiError = (error: ApiError) => {
  // Don't expose internal errors to users
  if (error.status === 500) {
    return "Something went wrong. Please try again."
  }
  return error.userMessage || "Request failed"
}

// Sanitize user inputs
const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
}
```

## 🛠 Development Tools

### Reactotron Configuration

```typescript
// Only in development
if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"))
}

// Useful Reactotron commands
console.tron.log("Debug message")
console.tron.warn("Warning message")
console.tron.error("Error message")
console.tron.display({
  name: "User Data",
  value: userData,
  important: true,
})
```

### Metro Configuration

```javascript
// metro.config.js optimization
module.exports = {
  resolver: {
    alias: {
      "@": path.resolve(__dirname, "app"),
      "@assets": path.resolve(__dirname, "assets"),
    },
  },
  transformer: {
    // Enable inlineRequires for better performance
    inlineRequires: true,
  },
}
```

### VS Code Configuration

Recommended VS Code extensions:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

## 📊 Code Review Checklist

### Before Submitting PR

- [ ] Code follows established patterns
- [ ] TypeScript types are properly defined
- [ ] Components are accessible
- [ ] Tests are written and passing
- [ ] Performance considerations addressed
- [ ] Security implications reviewed
- [ ] Documentation updated if needed

### Review Guidelines

- [ ] Code is readable and well-structured
- [ ] Props and state management follow patterns
- [ ] Error handling is comprehensive
- [ ] No console.logs in production code
- [ ] Imports are organized correctly
- [ ] Breaking changes are documented

## 🎯 Quick Reference Commands

```bash
# Development
yarn start                  # Start Expo development server
yarn compile               # TypeScript compilation check
yarn lint                  # Run ESLint with auto-fix
yarn lint:check            # ESLint check only
yarn prettier:write        # Format all files
yarn pre-commit           # Run pre-commit checks

# Testing
yarn test                  # Run Jest unit tests
yarn test:watch            # Run tests in watch mode
yarn test:maestro          # Run E2E tests

# Build
yarn build:ios:sim         # iOS simulator build
yarn build:android:dev     # Android development build

# Utilities
yarn align-deps            # Update Expo dependencies
yarn convert-colors        # Convert theme colors to CSS
```

Following these development guidelines ensures consistent, maintainable, and high-quality code across the CMSMobile project.
