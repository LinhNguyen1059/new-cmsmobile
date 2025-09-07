import { useColorScheme as useNativewindColorScheme } from "nativewind"

import { colors } from "@/theme/colors"

function useColorScheme() {
  const { colorScheme, setColorScheme: setNativewindColorScheme } = useNativewindColorScheme()

  async function setColorScheme(colorScheme: "light" | "dark") {
    setNativewindColorScheme(colorScheme)
  }

  function toggleColorScheme() {
    return setColorScheme(colorScheme === "light" ? "dark" : "light")
  }

  return {
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
    colors: colors[colorScheme ?? "light"],
  }
}

export { useColorScheme }
