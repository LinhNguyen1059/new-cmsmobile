// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native";
import {
  Roboto_300Light as RobotoLight,
  Roboto_400Regular as RobotoRegular,
  Roboto_500Medium as RobotoMedium,
  Roboto_600SemiBold as RobotoSemiBold,
  Roboto_700Bold as RobotoBold,
} from "@expo-google-fonts/roboto";

export const customFontsToLoad = {
  RobotoLight,
  RobotoRegular,
  RobotoMedium,
  RobotoSemiBold,
  RobotoBold,
};

const fonts = {
  Roboto: {
    // Cross-platform Google font.
    light: "RobotoLight",
    normal: "RobotoRegular",
    medium: "RobotoMedium",
    semiBold: "RobotoSemiBold",
    bold: "RobotoBold",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.Roboto,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
};
