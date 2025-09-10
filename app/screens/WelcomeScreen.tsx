import { FC } from "react";
import { Image, View } from "react-native";

import { Screen } from "@/components/Screen";
import { Button, Text } from "@/components/ui";
import type { AppStackScreenProps } from "@/navigators/AppNavigator";

const welcomeLogo = require("@assets/images/logo.png");

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen(_props) {
  const { navigation } = _props;

  function goNext() {
    navigation.navigate("Demo", { screen: "DemoShowroom", params: {} });
  }

  return (
    <Screen
      preset="fixed"
      className="px-4"
      contentContainerClassName="flex-1"
      safeAreaEdges={["top", "bottom"]}
    >
      <View className="flex-1 justify-center">
        <Image source={welcomeLogo} resizeMode="contain" className="mx-auto mb-8" />
        <Text
          testID="welcome-heading"
          tx="welcomeScreen:readyForLaunch"
          variant="h3"
          className="text-center"
        />
        <Text tx="welcomeScreen:exciting" variant="h5" className="mb-4 text-center" />
        <Text tx="welcomeScreen:postscript" className="text-center" />
        <Button
          testID="next-screen-button"
          tx="welcomeScreen:letsGo"
          onPress={goNext}
          className="mt-6"
        />
      </View>
    </Screen>
  );
};
