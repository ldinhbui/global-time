export type ColorPalette = {
  background: string;
  surface: string;
  surfaceSelected: string;
  surfaceElevated: string;
  overlay: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentMuted: string;
  border: string;
  globeOcean: string;
  globeLand: string;
  pin: string;
};

export const darkColors: ColorPalette = {
  background: "#0B1628",
  surface: "#152238",
  surfaceSelected: "#182947",
  surfaceElevated: "#152238",
  overlay: "rgba(11, 22, 40, 0.75)",
  text: "#FFFFFF",
  textSecondary: "#8899AA",
  accent: "#3B82F6",
  accentMuted: "rgba(59, 130, 246, 0.2)",
  border: "rgba(255, 255, 255, 0.08)",
  globeOcean: "#1A3A5C",
  globeLand: "#2D5A4A",
  pin: "#3B82F6",
};

export const lightColors: ColorPalette = {
  background: "#F0F4F8",
  surface: "#FFFFFF",
  surfaceSelected: "#E8EFF8",
  surfaceElevated: "#FFFFFF",
  overlay: "rgba(255, 255, 255, 0.88)",
  text: "#0B1628",
  textSecondary: "#5A6B7D",
  accent: "#3B82F6",
  accentMuted: "rgba(59, 130, 246, 0.12)",
  border: "rgba(11, 22, 40, 0.08)",
  globeOcean: "#3B7DD8",
  globeLand: "#4A8B6F",
  pin: "#3B82F6",
};

/** @deprecated Use useAppPreferences().colors instead */
export const Colors = darkColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export function getColorsForScheme(scheme: "dark" | "light"): ColorPalette {
  return scheme === "light" ? lightColors : darkColors;
}
