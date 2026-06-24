import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AppPreferences,
  ColorScheme,
  DateFormat,
  DEFAULT_PREFERENCES,
  TimeFormat,
} from "@/constants/preferences";

const STORAGE_KEY = "@global-time/preferences";

function isTimeFormat(value: unknown): value is TimeFormat {
  return value === "12h" || value === "24h";
}

function isDateFormat(value: unknown): value is DateFormat {
  return (
    value === "long" ||
    value === "medium" ||
    value === "short" ||
    value === "numeric"
  );
}

function isColorScheme(value: unknown): value is ColorScheme {
  return value === "dark" || value === "light";
}

function parsePersisted(data: string): AppPreferences | null {
  try {
    const parsed = JSON.parse(data) as Partial<AppPreferences>;
    if (!parsed || typeof parsed !== "object") return null;

    return {
      timeFormat: isTimeFormat(parsed.timeFormat)
        ? parsed.timeFormat
        : DEFAULT_PREFERENCES.timeFormat,
      dateFormat: isDateFormat(parsed.dateFormat)
        ? parsed.dateFormat
        : DEFAULT_PREFERENCES.dateFormat,
      colorScheme: isColorScheme(parsed.colorScheme)
        ? parsed.colorScheme
        : DEFAULT_PREFERENCES.colorScheme,
    };
  } catch {
    return null;
  }
}

export async function loadPreferences(): Promise<AppPreferences | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return parsePersisted(raw);
}

export async function savePreferences(
  preferences: AppPreferences,
): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}
