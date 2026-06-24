export type TimeFormat = "12h" | "24h";
export type DateFormat = "long" | "medium" | "short" | "numeric";
export type ColorScheme = "dark" | "light";

export type AppPreferences = {
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  colorScheme: ColorScheme;
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  timeFormat: "12h",
  dateFormat: "long",
  colorScheme: "dark",
};

export const TIME_FORMAT_OPTIONS: {
  value: TimeFormat;
  label: string;
  example: string;
}[] = [
  { value: "12h", label: "12-hour", example: "3:45 PM" },
  { value: "24h", label: "24-hour", example: "15:45" },
];

export const DATE_FORMAT_OPTIONS: {
  value: DateFormat;
  label: string;
  example: string;
}[] = [
  { value: "long", label: "Long", example: "June 24, 2026" },
  { value: "medium", label: "Medium", example: "Jun 24, 2026" },
  { value: "short", label: "Short", example: "6/24/26" },
  { value: "numeric", label: "Numeric", example: "06/24/2026" },
];

export const COLOR_SCHEME_OPTIONS: {
  value: ColorScheme;
  label: string;
}[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];
