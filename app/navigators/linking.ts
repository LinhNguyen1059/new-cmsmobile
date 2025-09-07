import * as Linking from "expo-linking"

export const prefix = Linking.createURL("/")
export const config = {
  screens: {
    Login: {
      path: "",
    },
    Welcome: "welcome",
  },
}
