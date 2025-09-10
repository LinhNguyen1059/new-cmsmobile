# Component Library

> Comprehensive guide to CMSMobile's UI component library with examples and best practices

## 🎨 Overview

CMSMobile provides a robust component library built with modern React Native patterns, TypeScript, and Tailwind CSS (NativeWind). All components are designed with accessibility, theming, and internationalization in mind.

## 📁 Component Structure

```
components/
├── ui/                    # Base UI components
│   ├── Button.tsx        # Primary button component
│   ├── Text.tsx          # Typography component
│   ├── Input.tsx         # Form input component
│   ├── Checkbox.tsx      # Checkbox component
│   ├── Skeleton.tsx      # Loading skeleton component
│   └── index.ts          # Barrel exports
├── AutoImage.tsx         # Smart image component
├── Header.tsx            # Screen header component
├── Icon.tsx              # Icon component with types
├── ListItem.tsx          # List item component
└── Screen.tsx            # Screen wrapper component
```

## 🧩 Base UI Components

### Text Component

The `Text` component provides a consistent typography system with variants and internationalization support.

#### Props

```typescript
interface TextProps extends RNTextProps {
  tx?: TxKeyPath // i18n translation key
  text?: string // Direct text content
  txOptions?: TOptions // i18n options
  children?: ReactNode // Child components
  variant?: TextVariant // Typography variant
}
```

#### Variants

| Variant     | Usage               | Font Weight | Size |
| ----------- | ------------------- | ----------- | ---- |
| `h1`        | Page titles         | Bold        | 36px |
| `h2`        | Section headers     | Bold        | 30px |
| `h3`        | Subsection headers  | Bold        | 24px |
| `h4`        | Component titles    | Bold        | 20px |
| `h5`        | Small headers       | Bold        | 18px |
| `subtitle1` | Large subtitles     | Medium      | 18px |
| `subtitle2` | Medium subtitles    | Medium      | 16px |
| `body1`     | Default body text   | Regular     | 16px |
| `body2`     | Small body text     | Regular     | 14px |
| `button`    | Button labels       | SemiBold    | 14px |
| `caption`   | Captions and labels | Regular     | 12px |
| `header`    | Navigation headers  | Medium      | 16px |

#### Examples

```typescript
// Basic usage
<Text variant="h1" text="Welcome" />

// With i18n
<Text variant="body1" tx="common.welcome" />

// With interpolation
<Text
  tx="greeting.hello"
  txOptions={{ name: "John" }}
/>

// Custom styling
<Text
  variant="body2"
  className="text-blue-500 text-center"
  text="Custom styled text"
/>

// Nested content
<Text variant="body1">
  Welcome to <Text variant="button">CMSMobile</Text>
</Text>
```

### Button Component

Feature-rich button component with variants, sizes, and accessibility support.

#### Props

```typescript
interface ButtonProps extends PressableProps {
  tx?: TextProps["tx"] // i18n text key
  text?: string // Button text
  txOptions?: TextProps["txOptions"] // i18n options
  variant?: ButtonVariant // Button style variant
  size?: ButtonSize // Button size
  RightAccessory?: ComponentType // Right side component
  LeftAccessory?: ComponentType // Left side component
  children?: React.ReactNode // Child content
  disabled?: boolean // Disabled state
}
```

#### Variants & Sizes

**Variants:**

- `default` - Primary blue button
- `destructive` - Red danger button
- `outline` - Outlined button
- `secondary` - Gray secondary button
- `ghost` - Transparent button
- `link` - Text-only button

**Sizes:**

- `sm` - Small (32px height)
- `default` - Regular (40px height)
- `lg` - Large (44px height)
- `icon` - Square icon button (40x40px)

#### Examples

```typescript
// Basic usage
<Button text="Submit" onPress={handleSubmit} />

// With variant and size
<Button
  variant="destructive"
  size="lg"
  text="Delete Account"
  onPress={handleDelete}
/>

// With accessories
<Button
  text="Next"
  RightAccessory={(props) => (
    <Icon icon="chevron-right" className={props.className} />
  )}
  onPress={handleNext}
/>

// Disabled state
<Button
  text="Loading..."
  disabled={isLoading}
  onPress={handleAction}
/>

// Icon-only button
<Button
  variant="ghost"
  size="icon"
  LeftAccessory={(props) => (
    <Icon icon="settings" className={props.className} />
  )}
  onPress={handleSettings}
/>
```

### Input Component

Comprehensive form input component with validation, accessories, and theming.

#### Props

```typescript
interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  status?: "error" | "disabled" // Input state
  label?: string // Label text
  labelTx?: TextProps["tx"] // i18n label key
  helper?: string // Helper text
  helperTx?: TextProps["tx"] // i18n helper key
  placeholder?: string // Placeholder text
  placeholderTx?: TextProps["tx"] // i18n placeholder key
  RightAccessory?: ComponentType // Right side component
  LeftAccessory?: ComponentType // Left side component
  // Custom className props for styling
  rootClassName?: string
  wrapperInputClassName?: string
  labelTextClassName?: string
  helperTextClassName?: string
}
```

#### Examples

```typescript
// Basic text input
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
/>

// With validation error
<Input
  label="Password"
  status="error"
  helper="Password must be at least 8 characters"
  value={password}
  onChangeText={setPassword}
  secureTextEntry
/>

// With accessories
<Input
  label="Search"
  placeholder="Type to search..."
  value={searchTerm}
  onChangeText={setSearchTerm}
  LeftAccessory={(props) => (
    <Icon icon="search" className={props.className} />
  )}
  RightAccessory={(props) => (
    <TouchableOpacity onPress={clearSearch}>
      <Icon icon="x" className={props.className} />
    </TouchableOpacity>
  )}
/>

// Multiline input
<Input
  label="Description"
  placeholder="Enter description..."
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={4}
/>

// With i18n
<Input
  labelTx="form.username"
  placeholderTx="form.usernamePlaceholder"
  helperTx="form.usernameHelper"
  value={username}
  onChangeText={setUsername}
/>
```

### Checkbox Component

Accessible checkbox component with customizable styling.

#### Examples

```typescript
import { Checkbox } from "@/components/ui"

// Basic checkbox
<Checkbox
  checked={isAccepted}
  onCheckedChange={setIsAccepted}
  label="I accept the terms and conditions"
/>

// Custom styling
<Checkbox
  checked={rememberMe}
  onCheckedChange={setRememberMe}
  label="Remember me"
  className="mb-4"
/>
```

### Skeleton Component

Loading skeleton for better perceived performance.

#### Examples

```typescript
import { Skeleton } from "@/components/ui"

// Basic skeleton
<Skeleton className="h-4 w-32 mb-2" />

// Multiple skeletons for list items
{isLoading && Array.from({ length: 3 }).map((_, index) => (
  <View key={index} className="mb-4">
    <Skeleton className="h-12 w-12 rounded-full mb-2" />
    <Skeleton className="h-4 w-full mb-1" />
    <Skeleton className="h-4 w-3/4" />
  </View>
))}
```

## 🧱 Layout Components

### Header Component

Flexible header component for screens with customizable actions and titles.

#### Props

```typescript
interface HeaderProps {
  titleMode?: "center" | "flex" // Title alignment mode
  title?: string // Header title
  titleTx?: TextProps["tx"] // i18n title key
  backgroundColor?: string // Background color

  // Left side
  leftIcon?: IconTypes // Left icon
  leftText?: string // Left text
  leftTx?: TextProps["tx"] // i18n left text
  LeftActionComponent?: ReactElement // Custom left component
  onLeftPress?: () => void // Left action handler

  // Right side
  rightIcon?: IconTypes // Right icon
  rightText?: string // Right text
  rightTx?: TextProps["tx"] // i18n right text
  RightActionComponent?: ReactElement // Custom right component
  onRightPress?: () => void // Right action handler

  safeAreaEdges?: ExtendedEdge[] // Safe area configuration
}
```

#### Examples

```typescript
// Basic header
<Header title="Settings" />

// With back navigation
<Header
  title="Profile"
  leftIcon="arrow-left"
  onLeftPress={() => navigation.goBack()}
/>

// With multiple actions
<Header
  title="Messages"
  leftIcon="menu"
  onLeftPress={openDrawer}
  rightIcon="plus"
  onRightPress={createMessage}
/>

// Custom actions
<Header
  title="Chat"
  RightActionComponent={
    <TouchableOpacity onPress={handleVideoCall}>
      <Icon icon="video" size={24} />
    </TouchableOpacity>
  }
/>

// With i18n
<Header
  titleTx="navigation.settings"
  leftIcon="arrow-left"
  onLeftPress={() => navigation.goBack()}
/>
```

### Screen Component

Base screen wrapper component with consistent layout and safe areas.

#### Props

```typescript
interface ScreenProps {
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  safeAreaEdges?: ExtendedEdge[]
  backgroundColor?: string
  statusBarStyle?: "light" | "dark"
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps
}
```

#### Examples

```typescript
// Basic screen
<Screen>
  <Text variant="h1" text="Welcome" />
  {/* Screen content */}
</Screen>

// With custom safe areas
<Screen safeAreaEdges={["top", "bottom"]}>
  <Header title="Settings" />
  {/* Content */}
</Screen>

// With keyboard avoidance
<Screen KeyboardAvoidingViewProps={{ behavior: "padding" }}>
  <Input label="Message" multiline />
  <Button text="Send" />
</Screen>
```

### ListItem Component

Flexible list item component for various content types.

#### Examples

```typescript
// Basic list item
<ListItem
  text="Settings"
  rightIcon="chevron-right"
  onPress={navigateToSettings}
/>

// With avatar and subtitle
<ListItem
  LeftComponent={<Avatar source={{ uri: user.avatar }} />}
  text={user.name}
  bottomSeparator
  rightIcon="chevron-right"
  onPress={() => navigateToProfile(user.id)}
/>

// Custom content
<ListItem>
  <View className="flex-row items-center justify-between flex-1">
    <Text variant="body1" text="Dark Mode" />
    <Switch value={isDark} onValueChange={toggleTheme} />
  </View>
</ListItem>
```

## 🖼 Media Components

### AutoImage Component

Smart image component with automatic sizing and fallbacks.

#### Props

```typescript
interface AutoImageProps extends Omit<ImageProps, "source"> {
  source: ImageSourcePropType
  maxWidth?: number
  maxHeight?: number
}
```

#### Examples

```typescript
// Basic usage
<AutoImage
  source={{ uri: "https://example.com/image.jpg" }}
  maxWidth={300}
/>

// With fallback
<AutoImage
  source={{ uri: userAvatar || defaultAvatar }}
  style={{ width: 50, height: 50, borderRadius: 25 }}
/>

// Local image
<AutoImage
  source={require("@/assets/images/logo.png")}
  maxWidth={200}
/>
```

### Icon Component

Type-safe icon component using system icons or custom icon sets.

#### Examples

```typescript
// Basic icon
<Icon icon="heart" size={24} />

// With color
<Icon
  icon="star"
  size={20}
  color={colors.warning[500]}
/>

// Pressable icon
<PressableIcon
  icon="settings"
  size={24}
  onPress={handleSettings}
  className="p-2"
/>
```

## 🎨 Theming Components

All components automatically support theming through the theme context:

```typescript
// Components automatically adapt to theme
const { theme, isDark } = useAppTheme()

// Manual theme access
<Text
  style={{ color: theme.colors.text }}
  text="Themed text"
/>

// Theme-aware styling with Tailwind
<View className="bg-background border-border">
  <Text className="text-foreground">Auto-themed content</Text>
</View>
```

## 🌐 Internationalization Support

All text components support i18n out of the box:

```typescript
// Translation files (i18n/en.ts)
export const en = {
  common: {
    welcome: "Welcome",
    save: "Save",
    cancel: "Cancel",
  },
  form: {
    email: "Email Address",
    password: "Password",
    emailPlaceholder: "Enter your email",
  }
}

// Component usage
<Text tx="common.welcome" />
<Button tx="common.save" onPress={handleSave} />
<Input
  labelTx="form.email"
  placeholderTx="form.emailPlaceholder"
/>
```

## ♿ Accessibility Features

All components include built-in accessibility support:

```typescript
// Automatic accessibility labels
<Button text="Submit" />
// Generates: accessibilityRole="button", accessibilityLabel="Submit"

// Custom accessibility
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Close modal"
  accessibilityHint="Closes the current modal"
  onPress={closeModal}
>
  <Icon icon="x" />
</TouchableOpacity>

// Form accessibility
<Input
  label="Email"
  accessibilityLabel="Email address input"
  accessibilityHint="Enter your email address to sign in"
/>
```

## 🎯 Component Variants with CVA

The component library uses `class-variance-authority` for consistent variant management:

```typescript
// Example Button variants
const buttonVariants = cva("group shrink-0 flex-row items-center justify-center gap-2 rounded-md", {
  variants: {
    variant: {
      default: "bg-primary shadow-sm",
      destructive: "bg-destructive shadow-sm",
      outline: "border-border bg-background",
      secondary: "bg-secondary shadow-sm",
      ghost: "bg-transparent",
      link: "underline-offset-4",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-6",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})
```

## 📱 Responsive Design

Components adapt to different screen sizes using Tailwind's responsive prefixes:

```typescript
<View className="p-4 sm:p-6 lg:p-8">
  <Text
    variant="h1"
    className="text-2xl sm:text-3xl lg:text-4xl"
    text="Responsive Title"
  />
</View>
```

## 🧪 Testing Components

### Unit Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, fireEvent } from "@testing-library/react-native"
import { Button } from "@/components/ui"

describe("Button Component", () => {
  it("renders text correctly", () => {
    const { getByText } = render(<Button text="Click me" />)
    expect(getByText("Click me")).toBeTruthy()
  })

  it("calls onPress when pressed", () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <Button text="Click me" onPress={onPress} />
    )

    fireEvent.press(getByRole("button"))
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it("applies disabled state", () => {
    const onPress = jest.fn()
    const { getByRole } = render(
      <Button text="Click me" onPress={onPress} disabled />
    )

    const button = getByRole("button")
    expect(button.props.accessibilityState.disabled).toBe(true)

    fireEvent.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })
})
```

### Snapshot Testing

```typescript
// __tests__/components/__snapshots__/Text.test.tsx
import { render } from "@testing-library/react-native"
import { Text } from "@/components/ui"

describe("Text Component Snapshots", () => {
  it("matches snapshot for all variants", () => {
    const variants = ["h1", "h2", "body1", "button", "caption"] as const

    variants.forEach(variant => {
      const { toJSON } = render(
        <Text variant={variant} text="Sample text" />
      )
      expect(toJSON()).toMatchSnapshot(`Text-${variant}`)
    })
  })
})
```

## 📋 Best Practices

### 1. Component Composition

Use composition patterns for flexibility:

```typescript
// Good: Composable design
<Button>
  <Icon icon="download" />
  <Text text="Download" />
</Button>

// Better: Using accessories for common patterns
<Button
  text="Download"
  LeftAccessory={(props) => <Icon icon="download" {...props} />}
/>
```

### 2. Consistent Prop Naming

Follow established patterns:

- `tx` for translation keys
- `text` for direct text content
- `onPress` for touch handlers
- `className` for Tailwind classes
- `style` for React Native styles

### 3. Accessibility First

Always consider accessibility:

```typescript
// Include accessibility props
<Button
  text="Delete"
  accessibilityHint="This will permanently delete the item"
  onPress={handleDelete}
/>

// Use semantic roles
<TouchableOpacity accessibilityRole="button">
  <Text text="Custom Button" />
</TouchableOpacity>
```

### 4. Performance Optimization

Use React.memo for expensive components:

```typescript
export const ExpensiveListItem = React.memo<ListItemProps>(({ item }) => {
  return (
    <ListItem
      text={item.title}
      subtitle={item.description}
      onPress={() => navigateToDetail(item.id)}
    />
  )
})
```

### 5. Type Safety

Always use proper TypeScript types:

```typescript
// Define strict prop interfaces
interface UserCardProps {
  user: User
  onPress: (userId: string) => void
  variant?: "compact" | "expanded"
}

// Use type-safe icon names
<Icon icon="user" /> // ✅ Type-safe
<Icon icon="invalid-icon" /> // ❌ TypeScript error
```

This component library provides a solid foundation for building consistent, accessible, and maintainable UI components in CMSMobile.
