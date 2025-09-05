import { useState } from "react"
import { Alert, ScrollView, View, ViewStyle } from "react-native"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Header } from "@/components/Header"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAuth, useStore, withStore } from "../stores"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

/**
 * Demo screen showing how to use MobX-State-Tree stores
 */
export const MSTDemoScreen = withStore(function MSTDemoScreen() {
  const [email, setEmail] = useState("demo@example.com")
  const [password, setPassword] = useState("password")
  const { themed } = useAppTheme()

  // Using the useAuth hook (similar to your existing pattern)
  const {
    isAuthenticated,
    isLoading,
    currentUser,
    userEmail,
    validationError,
    isLoginValid,
    login,
    logout,
    setUserEmail,
    error,
    clearError,
  } = useAuth()

  // You can also access the store directly
  const store = useStore()

  const handleLogin = async () => {
    clearError()
    const result = await login(email, password)
    if (result.success) {
      Alert.alert("Success", "Logged in successfully!")
    } else {
      Alert.alert("Error", result.error || "Login failed")
    }
  }

  const handleLogout = async () => {
    await logout()
    Alert.alert("Success", "Logged out successfully!")
  }

  const handleSetEmail = () => {
    setUserEmail(email)
  }

  return (
    <Screen preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Header title="MobX-State-Tree Demo" />
      <ScrollView style={themed($container)}>
        {/* Authentication Status */}
        <Card
          heading="Authentication Status"
          content={`Is Authenticated: ${isAuthenticated}`}
          style={themed($card)}
        />

        {/* Current User Info */}
        {currentUser && (
          <Card
            heading="Current User"
            content={`ID: ${currentUser.id}\nEmail: ${currentUser.email}\nName: ${currentUser.name || "N/A"}`}
            style={themed($card)}
          />
        )}

        {/* Store State Debug */}
        <Card
          heading="Store State"
          content={`Loading: ${isLoading}\nUser Email: ${userEmail}\nValidation Error: ${validationError || "None"}\nIs Login Valid: ${isLoginValid}`}
          style={themed($card)}
        />

        {/* Login Form */}
        {!isAuthenticated && (
          <View style={themed($loginForm)}>
            <Text preset="subheading" text="Login Form" style={themed($sectionTitle)} />

            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              status={validationError ? "error" : undefined}
              helper={validationError || undefined}
              containerStyle={themed($textField)}
            />

            <TextField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              secureTextEntry
              containerStyle={themed($textField)}
            />

            {error && <Text preset="formHelper" text={error} style={themed($errorText)} />}

            <Button
              text="Login"
              onPress={handleLogin}
              disabled={!isLoginValid || isLoading}
              preset="filled"
              style={themed($button)}
            />
          </View>
        )}

        {/* User Actions */}
        {isAuthenticated && (
          <View style={themed($userActions)}>
            <Text preset="subheading" text="User Actions" style={themed($sectionTitle)} />

            <Button
              text="Logout"
              onPress={handleLogout}
              disabled={isLoading}
              preset="reversed"
              style={themed($button)}
            />

            <View style={themed($emailSection)}>
              <TextField
                label="Update Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter new email"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={themed($textField)}
              />

              <Button
                text="Update Email"
                onPress={handleSetEmail}
                disabled={isLoading}
                style={themed($button)}
              />
            </View>
          </View>
        )}

        {/* Store Actions */}
        <View style={themed($storeActions)}>
          <Text preset="subheading" text="Store Actions" style={themed($sectionTitle)} />

          <Button
            text="Clear Error"
            onPress={clearError}
            disabled={!error}
            style={themed($button)}
          />
          <Button text="Reset Store" onPress={() => store.reset()} style={themed($button)} />
          <Button
            text="Reinitialize Store"
            onPress={() => store.initialize()}
            style={themed($button)}
          />
        </View>

        {/* Instructions */}
        <Card
          heading="Instructions"
          content="1. Try logging in with email: demo@example.com and password: password\n2. Observe how the store state changes\n3. Test the validation by entering invalid emails\n4. Use logout and see how the state resets\n5. The store persists data using MMKV storage"
          style={themed($card)}
        />
      </ScrollView>
    </Screen>
  )
})

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
})

const $card: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.md,
})

const $sectionTitle: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $loginForm: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $userActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $storeActions: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.lg,
})

const $emailSection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.md,
})

const $textField: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $button: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $errorText: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})
