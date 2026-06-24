import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AppPreferences,
  ColorScheme,
  DateFormat,
  DEFAULT_PREFERENCES,
  TimeFormat,
} from "@/constants/preferences";
import {
  ColorPalette,
  getColorsForScheme,
} from "@/constants/theme";
import {
  loadPreferences,
  savePreferences,
} from "@/utils/preferences-storage";

type AppPreferencesContextValue = {
  preferences: AppPreferences;
  colors: ColorPalette;
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
  const [isHydrated, setIsHydrated] = useState(false);

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

  const colors = useMemo(
    () => getColorsForScheme(preferences.colorScheme),
    [preferences.colorScheme],
  );

  const value = useMemo(
    () => ({
      preferences,
      colors,
      isHydrated,
      setTimeFormat,
      setDateFormat,
      setColorScheme,
    }),
    [
      preferences,
      colors,
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
