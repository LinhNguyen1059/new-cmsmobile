import { colors } from "./colors";
import { spacing } from "./spacing";
import { timing } from "./timing";
import type { Theme } from "./types";
import { typography } from "./typography";

// Here we define our themes.
export const lightTheme: Theme = {
  colors: colors.light,
  spacing: spacing,
  typography,
  timing,
  isDark: false,
};
export const darkTheme: Theme = {
  colors: colors.dark,
  spacing: spacing,
  typography,
  timing,
  isDark: true,
};
