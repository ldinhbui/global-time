import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { SharedValue } from "react-native-reanimated";
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  AppPreferences,
  ColorScheme,
  DateFormat,
  DEFAULT_PREFERENCES,
  TimeFormat,
} from "@/constants/preferences";
import {
  ColorPalette,
  darkColors,
  getColorsForScheme,
} from "@/constants/theme";
import {
  loadPreferences,
  savePreferences,
} from "@/utils/preferences-storage";

const THEME_TRANSITION_MS = 400;

type AppPreferencesContextValue = {
  preferences: AppPreferences;
  colors: ColorPalette;
  themeProgress: SharedValue<number>;
  isLightAppearance: boolean;
  isHydrated: boolean;
  setTimeFormat: (format: TimeFormat) => void;
  setDateFormat: (format: DateFormat) => void;
  setColorScheme: (scheme: ColorScheme) => void;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | null>(
  null,
);

export function AppPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [colors, setColors] = useState<ColorPalette>(darkColors);
  const [isLightAppearance, setIsLightAppearance] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasAppliedInitialTheme = useRef(false);
  const themeProgress = useSharedValue(0);

  const finalizeTheme = useCallback((scheme: ColorScheme) => {
    setColors(getColorsForScheme(scheme));
    setIsLightAppearance(scheme === "light");
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadPreferences().then((saved) => {
      if (cancelled) return;
      if (saved) setPreferences(saved);
      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const scheme = preferences.colorScheme;
    const target = scheme === "light" ? 1 : 0;

    if (!hasAppliedInitialTheme.current) {
      hasAppliedInitialTheme.current = true;
      themeProgress.value = target;
      finalizeTheme(scheme);
      return;
    }

    cancelAnimation(themeProgress);
    themeProgress.value = withTiming(
      target,
      {
        duration: THEME_TRANSITION_MS,
        easing: Easing.inOut(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(finalizeTheme)(scheme);
        }
      },
    );
  }, [finalizeTheme, isHydrated, preferences.colorScheme, themeProgress]);

  useEffect(() => {
    if (!isHydrated) return;
    void savePreferences(preferences);
  }, [preferences, isHydrated]);

  const setTimeFormat = useCallback((timeFormat: TimeFormat) => {
    setPreferences((current) => ({ ...current, timeFormat }));
  }, []);

  const setDateFormat = useCallback((dateFormat: DateFormat) => {
    setPreferences((current) => ({ ...current, dateFormat }));
  }, []);

  const setColorScheme = useCallback((colorScheme: ColorScheme) => {
    setPreferences((current) => ({ ...current, colorScheme }));
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      colors,
      themeProgress,
      isLightAppearance,
      isHydrated,
      setTimeFormat,
      setDateFormat,
      setColorScheme,
    }),
    [
      preferences,
      colors,
      themeProgress,
      isLightAppearance,
      isHydrated,
      setTimeFormat,
      setDateFormat,
      setColorScheme,
    ],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error(
      "useAppPreferences must be used within AppPreferencesProvider",
    );
  }
  return context;
}
