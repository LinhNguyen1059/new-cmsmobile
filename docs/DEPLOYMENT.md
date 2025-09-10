# Deployment Guide

> Comprehensive guide for building, testing, and deploying CMSMobile across platforms

## 🚀 Overview

This guide covers the complete deployment pipeline for CMSMobile, including local development builds, staging deployments, and production releases using Expo Application Services (EAS).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Build Configuration](#build-configuration)
3. [Local Development Builds](#local-development-builds)
4. [EAS Cloud Builds](#eas-cloud-builds)
5. [Platform-Specific Deployment](#platform-specific-deployment)
6. [Environment Management](#environment-management)
7. [Testing & Quality Assurance](#testing--quality-assurance)
8. [Release Process](#release-process)
9. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Development Environment

#### Required Tools

```bash
# Node.js (v20.0.0 or higher)
node --version

# Yarn package manager
yarn --version

# Expo CLI
npm install -g @expo/cli
expo --version

# EAS CLI
npm install -g eas-cli
eas --version
```

#### Platform-Specific Requirements

**iOS Development:**

- macOS with Xcode 15+
- iOS Simulator
- Apple Developer Account (for device builds)
- Valid code signing certificates

**Android Development:**

- Android Studio with SDK
- Android Emulator or physical device
- Google Play Console access (for store deployment)

### EAS Setup

```bash
# Login to Expo account
eas login

# Initialize EAS in project (if not already done)
eas build:configure

# Check project configuration
eas config
```

## ⚙️ Build Configuration

### EAS Build Profiles

The project uses multiple build profiles defined in `eas.json`:

```json
{
  "build": {
    "development": {
      "extends": "production",
      "distribution": "internal",
      "android": {
        "gradleCommand": ":app:assembleDebug"
      },
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": true
      }
    },
    "development:device": {
      "extends": "development",
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": false
      }
    },
    "preview": {
      "extends": "production",
      "distribution": "internal",
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    },
    "production": {
      // Production configuration
    }
  }
}
```

### Build Profile Usage

| Profile              | Purpose                     | Distribution | Platform                        |
| -------------------- | --------------------------- | ------------ | ------------------------------- |
| `development`        | Development with simulators | Internal     | iOS Simulator, Android Emulator |
| `development:device` | Development on real devices | Internal     | iOS/Android Devices             |
| `preview`            | Testing/staging builds      | Internal     | Simulators + APK                |
| `production`         | App Store releases          | Store        | iOS App Store, Google Play      |

### App Configuration

Key settings in `app.json`:

```json
{
  "name": "CMS",
  "slug": "cms-mobile",
  "version": "1.0.0",
  "scheme": "cmsmobile",
  "newArchEnabled": true,
  "jsEngine": "hermes",
  "android": {
    "package": "com.i3international.cmsapp"
  },
  "ios": {
    "bundleIdentifier": "com.i3international.cmsapp"
  }
}
```

## 🏗 Local Development Builds

### Quick Start Commands

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Run on simulators/emulators
yarn ios      # iOS Simulator
yarn android  # Android Emulator
yarn web      # Web browser
```

### Local EAS Builds

For testing native functionality locally:

```bash
# iOS Simulator builds
yarn build:ios:sim

# iOS Device builds (requires Apple Developer account)
yarn build:ios:dev

# Android Emulator builds
yarn build:android:sim

# Android Device builds
yarn build:android:dev
```

### Build Process Details

1. **Pre-build Setup**: Expo prebuild generates native code
2. **Dependency Installation**: Native dependencies are installed
3. **Code Compilation**: TypeScript compilation and bundling
4. **Native Build**: Platform-specific compilation
5. **Code Signing**: Certificate application (device builds)
6. **Package Generation**: IPA/APK file creation

## ☁️ EAS Cloud Builds

### Cloud Build Advantages

- **No Local Setup**: Build without iOS/Android dev environment
- **Scalable**: Multiple builds in parallel
- **Consistent**: Same environment every time
- **Team Sharing**: Shareable build artifacts

### Cloud Build Commands

```bash
# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android
eas build --profile development --platform all

# Preview builds for testing
eas build --profile preview --platform ios
eas build --profile preview --platform android

# Production builds for store submission
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Build Status Monitoring

```bash
# Check build status
eas build:list

# View specific build details
eas build:view [BUILD_ID]

# Cancel running build
eas build:cancel [BUILD_ID]
```

## 📱 Platform-Specific Deployment

### iOS Deployment

#### Development & Testing

```bash
# iOS Simulator build
eas build --profile development --platform ios

# iOS Device build (requires Apple Developer Program)
eas build --profile development:device --platform ios

# Install on device via TestFlight or direct install
eas device:create  # Register test devices
```

#### App Store Submission

```bash
# Production build for App Store
eas build --profile production --platform ios

# Submit to App Store Connect
eas submit --platform ios

# Check submission status
eas submit:list
```

#### App Store Connect Requirements

- **App Store Connect Account**: Apple Developer Program membership
- **App Information**: Complete app metadata
- **Screenshots**: Required sizes for all supported devices
- **Privacy Policy**: Required for apps collecting user data
- **App Review Guidelines**: Compliance with Apple's guidelines

### Android Deployment

#### Development & Testing

```bash
# Android Emulator build
eas build --profile development --platform android

# Android APK for testing
eas build --profile preview --platform android

# Install APK on device
adb install path/to/app.apk
```

#### Google Play Store Submission

```bash
# Production AAB build
eas build --profile production --platform android

# Submit to Google Play Console
eas submit --platform android

# Check submission status
eas submit:list
```

#### Google Play Console Requirements

- **Google Play Console Account**: Developer registration
- **App Bundle**: AAB format for optimal delivery
- **Store Listing**: Complete app information
- **Content Rating**: Age-appropriate content rating
- **Target API Level**: Meet Google's requirements

## 🌍 Environment Management

### Environment Configuration

The app supports multiple environments through configuration files:

```typescript
// app/config/index.ts
import BaseConfig from "./config.base"
import DevConfig from "./config.dev"
import ProdConfig from "./config.prod"

let ExtraConfig = ProdConfig
if (__DEV__) {
  ExtraConfig = DevConfig
}

const Config = { ...BaseConfig, ...ExtraConfig }
export default Config
```

### Environment Variables

```typescript
// config.dev.ts - Development
export default {
  API_URL: "https://dev-api.example.com",
  enableReactotron: true,
  catchErrors: "dev",
  debugMode: true,
}

// config.prod.ts - Production
export default {
  API_URL: "https://api.example.com",
  enableReactotron: false,
  catchErrors: "always",
  debugMode: false,
}
```

### Build-Time Variables

```json
// app.json - Environment-specific values
{
  "extra": {
    "apiUrl": process.env.API_URL,
    "environment": process.env.NODE_ENV
  }
}
```

## 🧪 Testing & Quality Assurance

### Pre-Deployment Testing

#### Automated Testing

```bash
# Unit tests
yarn test

# TypeScript compilation
yarn compile

# Linting
yarn lint:check

# Code formatting
yarn prettier:check

# Full CI checks
yarn pre-commit
```

#### E2E Testing

```bash
# Maestro E2E tests
yarn test:maestro

# Manual test scenarios
- Login/logout flows
- Core user journeys
- Payment processes
- Offline functionality
- Push notifications
```

### Device Testing Matrix

#### iOS Testing

- **Simulators**: iPhone SE, iPhone 15, iPhone 15 Pro Max, iPad
- **Physical Devices**: At least one recent iPhone and iPad
- **OS Versions**: iOS 15.0+ (minimum supported version)

#### Android Testing

- **Emulators**: Various screen sizes and API levels
- **Physical Devices**: Different manufacturers (Samsung, Google, etc.)
- **OS Versions**: Android 8.0+ (API level 26+)

### Performance Testing

```bash
# Bundle analysis
npx expo export --platform ios --analyze

# Memory usage monitoring
# Use Xcode Instruments (iOS) or Android Studio Profiler

# Network performance
# Test with various network conditions (3G, 4G, WiFi)
```

## 🚢 Release Process

### Version Management

#### Semantic Versioning

```json
// app.json
{
  "version": "1.2.3" // MAJOR.MINOR.PATCH
}
```

Version bump strategy:

- **MAJOR**: Breaking changes or major feature releases
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes and minor improvements

#### Build Number Management

```json
// Automatic build numbers via EAS
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

### Release Workflow

#### 1. Pre-Release Checklist

- [ ] All features tested and approved
- [ ] Unit tests passing
- [ ] E2E tests passing
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] App store metadata prepared
- [ ] Release notes written

#### 2. Build Generation

```bash
# Create production builds
eas build --profile production --platform all

# Verify build artifacts
eas build:list --status=finished --limit=5
```

#### 3. Internal Testing

```bash
# Generate preview builds for final testing
eas build --profile preview --platform all

# Distribute to internal testers
# iOS: TestFlight beta testing
# Android: Internal testing track
```

#### 4. Store Submission

```bash
# Submit to app stores
eas submit --platform ios
eas submit --platform android

# Monitor review status
eas submit:list
```

#### 5. Release Monitoring

- Monitor crash reports
- Track user adoption
- Monitor performance metrics
- Prepare hotfix if needed

### Hotfix Process

For critical issues in production:

```bash
# Create hotfix branch
git checkout -b hotfix/critical-fix

# Implement fix and test
yarn test
yarn build:preview

# Deploy hotfix
eas build --profile production --platform all
eas submit --platform all
```

## 🔧 Advanced Configuration

### Custom Native Code

When custom native functionality is needed:

```bash
# Eject to bare workflow (irreversible)
npx expo eject

# Or use development builds with custom native code
npx expo install expo-dev-client
eas build --profile development
```

### Code Signing

#### iOS Code Signing

```bash
# Manage certificates via EAS
eas credentials

# View iOS credentials
eas credentials -p ios

# Create/update certificates
eas credentials -p ios --clear-provisioning-profile
```

#### Android Signing

```bash
# Manage Android keystore
eas credentials -p android

# View Android credentials
eas credentials -p android --clear-keystore
```

### Build Optimization

#### Bundle Size Optimization

```json
// metro.config.js
module.exports = {
  transformer: {
    minifierConfig: {
      // Optimize bundle size
      drop_console: true,  // Remove console.log in production
      pure_funcs: ["console.log", "console.warn"]
    }
  }
}
```

#### Performance Optimizations

```typescript
// Enable Hermes (already configured)
// "jsEngine": "hermes" in app.json

// Use New Architecture
// "newArchEnabled": true in app.json

// Optimize images
// Use WebP format when possible
// Implement proper image caching
```

## 🔍 Troubleshooting

### Common Build Issues

#### iOS Build Failures

```bash
# Clear iOS build cache
rm -rf ios/build
rm -rf ios/Pods
cd ios && pod install --repo-update

# Certificate issues
eas credentials -p ios
# Follow prompts to regenerate certificates
```

#### Android Build Failures

```bash
# Clear Android build cache
cd android
./gradlew clean
cd ..

# Dependency issues
npx expo install --fix
```

#### Common Errors

**"Module not found"**

```bash
# Clear Metro cache
npx expo start --clear

# Reset node modules
rm -rf node_modules
yarn install
```

**"Build failed: No certificate"**

```bash
# Regenerate certificates
eas credentials -p ios
```

**"Gradle build failed"**

```bash
# Check Android dependencies
npx expo doctor
```

### Debug Information

#### Build Logs

```bash
# View detailed build logs
eas build:view [BUILD_ID] --logs

# Download build artifacts
eas build:list --json | jq -r '.[0].artifacts.buildUrl'
```

#### Local Debugging

```bash
# Enable verbose logging
DEBUG=expo:* yarn start

# Check bundle analyzer
npx expo export --analyze

# Profile performance
npx react-devtools
```

## 📊 Monitoring & Analytics

### Build Metrics

Track important metrics:

- Build success rate
- Build duration
- Bundle size trends
- Crash-free sessions
- User adoption rates

### Performance Monitoring

```typescript
// Implement crash reporting
import crashlytics from "@react-native-firebase/crashlytics"

// Track custom events
import analytics from "@react-native-firebase/analytics"
```

## 📚 Additional Resources

### Documentation Links

- [Expo Application Services](https://docs.expo.dev/eas/)
- [App Store Connect Guide](https://developer.apple.com/app-store-connect/)
- [Google Play Console](https://developer.android.com/distribute/console)
- [React Native Performance](https://reactnative.dev/docs/performance)

### Support Channels

- [Expo Discord](https://discord.gg/expo)
- [Expo Forums](https://forums.expo.dev/)
- [React Native Community](https://reactnative.dev/community/overview)

Following this deployment guide ensures reliable, consistent builds and smooth releases across all platforms for CMSMobile.
