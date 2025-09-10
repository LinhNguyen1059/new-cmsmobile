# CMSMobile - React Native Application

> A modern, scalable React Native application built with Expo and powered by Infinite Red's Ignite framework

CMSMobile is a comprehensive React Native mobile application boilerplate that provides a solid foundation for building cross-platform mobile apps. Built on top of Expo SDK with TypeScript, MobX-State-Tree for state management, and a modern UI component library.

## 🚀 Key Features

- **Modern Tech Stack**: React Native 0.79.4, Expo SDK 53, TypeScript 5.8.3
- **State Management**: MobX-State-Tree with modular store architecture
- **Navigation**: React Navigation 7 with type-safe routing
- **UI Library**: Custom component library with Tailwind CSS (NativeWind)
- **Internationalization**: Multi-language support with i18next
- **Testing**: Jest for unit testing, Maestro for E2E testing
- **Development Tools**: Reactotron, ESLint, Prettier
- **Build System**: EAS Build with multiple environment configurations

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md) - Detailed system architecture overview
- [API Development Guide](./docs/API.md) - Services and data management patterns
- [Component Library](./docs/COMPONENTS.md) - UI component documentation and examples
- [Development Guidelines](./docs/DEVELOPMENT.md) - Coding standards and best practices
- [Deployment Guide](./docs/DEPLOYMENT.md) - Build and deployment instructions

## 🏁 Quick Start

### Prerequisites

- **Node.js**: v20.0.0 or higher
- **Yarn**: v1.x or v3+
- **Expo CLI**: Latest version
- **Development Environment**:
  - iOS: Xcode (for iOS development)
  - Android: Android Studio (for Android development)

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd CMSMobile
   yarn install
   ```

2. **Start the development server:**

   ```bash
   yarn start
   ```

3. **Run on platforms:**

   ```bash
   # iOS Simulator
   yarn ios

   # Android Emulator
   yarn android

   # Web Browser
   yarn web
   ```

### Development Builds

For native development builds using EAS:

```bash
# iOS Builds
yarn build:ios:sim      # iOS Simulator build
yarn build:ios:dev      # iOS Device (Development)
yarn build:ios:prod     # iOS Device (Production)

# Android Builds
yarn build:android:sim  # Android Emulator build
yarn build:android:dev  # Android Device (Development)
yarn build:android:prod # Android Device (Production)
```

## 📁 Project Structure

```
CMSMobile/
├── app/                    # Main application code
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Text, Input, etc.)
│   │   └── ...            # Complex components (Header, Screen, etc.)
│   ├── config/            # App configuration (dev/prod environments)
│   ├── i18n/              # Internationalization files
│   ├── navigators/        # Navigation setup and routing
│   ├── screens/           # Screen components
│   ├── services/          # API services and data fetching
│   │   └── api/           # API client and endpoints
│   ├── stores/            # MobX-State-Tree stores
│   │   ├── UserStore/     # User-related state management
│   │   └── utils/         # Store utilities and hooks
│   ├── theme/             # Theme configuration and styling
│   └── utils/             # Utility functions and helpers
├── assets/                # Static assets (icons, images)
├── docs/                  # Project documentation
├── ios/                   # iOS native code
├── android/               # Android native code
├── test/                  # Test configuration and utilities
└── plugins/               # Expo config plugins
```

### Key Directories

- **`app/components/ui/`**: Base UI components with consistent theming and TypeScript support
- **`app/stores/`**: Modular MobX-State-Tree stores for state management
- **`app/services/api/`**: API layer with type-safe service definitions
- **`app/theme/`**: Comprehensive theming system with light/dark mode support
- **`app/navigators/`**: Type-safe navigation with React Navigation 7

## 🧪 Testing

### Unit Tests

Run Jest unit tests:

```bash
yarn test          # Run tests once
yarn test:watch    # Run tests in watch mode
```

### End-to-End Tests

Run Maestro E2E tests:

```bash
yarn test:maestro
```

_Note: Follow the [Maestro Setup Guide](https://ignitecookbook.com/docs/recipes/MaestroSetup) for initial configuration._

## 🛠 Development Scripts

```bash
# Development
yarn start                  # Start Expo development server
yarn ios                   # Run on iOS simulator
yarn android               # Run on Android emulator
yarn web                   # Run on web browser

# Code Quality
yarn compile               # TypeScript compilation check
yarn lint                  # Run ESLint with auto-fix
yarn lint:check            # Run ESLint check only
yarn prettier:check        # Check code formatting
yarn prettier:write        # Format code with Prettier
yarn pre-commit            # Run pre-commit checks

# Testing
yarn test                  # Run unit tests
yarn test:watch            # Run tests in watch mode
yarn test:maestro          # Run E2E tests

# Build & Deploy
yarn build:ios:sim         # Build for iOS simulator
yarn build:android:dev     # Build for Android device
yarn bundle:web            # Bundle for web deployment
```

## 🔧 Configuration

### Environment Configuration

The app supports multiple environments:

- **Development** (`config.dev.ts`): Development settings with debugging enabled
- **Production** (`config.prod.ts`): Production optimized settings

### Theme Configuration

Customizable theming system supporting:

- Light and dark themes
- Typography scales
- Color systems
- Spacing and timing configurations

## 📖 Learn More

### Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [MobX-State-Tree](https://mobx-state-tree.js.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Ignite Cookbook](https://ignitecookbook.com/)

## Next Steps

### Ignite Cookbook

[Ignite Cookbook](https://ignitecookbook.com/) is an easy way for developers to browse and share code snippets (or “recipes”) that actually work.

### Upgrade Ignite boilerplate

Read our [Upgrade Guide](https://ignitecookbook.com/docs/recipes/UpdatingIgnite) to learn how to upgrade your Ignite project.

## Community

⭐️ Help us out by [starring on GitHub](https://github.com/infinitered/ignite), filing bug reports in [issues](https://github.com/infinitered/ignite/issues) or [ask questions](https://github.com/infinitered/ignite/discussions).

💬 Join us on [Slack](https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1f137np4h-zPTq_CbaRFUOR_glUFs2UA) to discuss.

📰 Make our Editor-in-chief happy by [reading the React Native Newsletter](https://reactnativenewsletter.com/).

## 📄 License

[Add your license information here]

---

**Built with ❤️ using [Ignite](https://github.com/infinitered/ignite) by [Infinite Red](https://infinite.red)**
