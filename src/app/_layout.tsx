import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppPreferencesProvider, useAppPreferences } from "@/contexts/app-preferences-context";

function RootNavigator() {
  return (
    <>
      <StatusBarController />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </>
  );
}

function StatusBarController() {
  const { isLightAppearance } = useAppPreferences();

  return <StatusBar style={isLightAppearance ? "dark" : "light"} />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppPreferencesProvider>
          <RootNavigator />
        </AppPreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
