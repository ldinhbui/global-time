import type { TextStyle, ViewStyle } from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";

import type { ColorPalette } from "@/constants/theme";
import { darkColors, lightColors } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";

type ThemeColorProperty = keyof Pick<
  ViewStyle & TextStyle,
  "color" | "backgroundColor" | "borderColor"
>;

export function useThemeStyle(
  key: keyof ColorPalette,
  property: ThemeColorProperty,
) {
  const { themeProgress } = useAppPreferences();
  const from = darkColors[key];
  const to = lightColors[key];

  return useAnimatedStyle(
    () => ({
      [property]: interpolateColor(themeProgress.value, [0, 1], [from, to]),
    }),
    [from, property, to],
  );
}

export function useThemeInterpolateStyle(
  property: ThemeColorProperty,
  dark: string,
  light: string,
  deps: unknown[] = [],
) {
  const { themeProgress } = useAppPreferences();

  return useAnimatedStyle(
    () => ({
      [property]: interpolateColor(themeProgress.value, [0, 1], [dark, light]),
    }),
    [dark, light, property, ...deps],
  );
}
