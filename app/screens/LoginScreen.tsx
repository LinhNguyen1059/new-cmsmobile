import { FC } from "react"

import { Screen } from "@/components/Screen"
import { Button, Input, Text } from "@/components/ui"
import type { AppStackScreenProps } from "@/navigators/AppNavigator"
import { useStores } from "@/stores"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = () => {
  const {
    userStore: { setUser },
  } = useStores()

  const onLogin = () => {
    setUser({
      id: "1",
      email: "user@example.com",
      firstName: "User",
      lastName: "Example",
    })
  }

  return (
    <Screen preset="auto" safeAreaEdges={["top", "bottom"]} className="px-4">
      <Text testID="login-heading" tx="loginScreen:logIn" variant="h3" className="mb-4" />
      <Text tx="loginScreen:enterDetails" className="mb-4 text-red-500" />

      <Input placeholder="Email" rootClassName="mb-4" />
      <Input placeholder="Password" />

      <Button tx="loginScreen:logIn" className="mt-4" onPress={onLogin} />
    </Screen>
  )
}
