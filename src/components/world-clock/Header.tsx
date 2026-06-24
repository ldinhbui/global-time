import { Pressable, StyleSheet, Text, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";

type HeaderProps = {
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
};

export function Header({ onSettingsPress, onSearchPress }: HeaderProps) {
  const { colors } = useAppPreferences();
  const lineColor = colors.text;

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Open settings"
        hitSlop={12}
        onPress={onSettingsPress}
        style={styles.iconButton}
      >
        <View style={styles.menuIcon}>
          <View style={[styles.menuLine, { backgroundColor: lineColor }]} />
          <View style={[styles.menuLine, { backgroundColor: lineColor }]} />
          <View style={[styles.menuLine, { backgroundColor: lineColor }]} />
        </View>
      </Pressable>

      <Text style={[styles.title, { color: colors.text }]}>World Clock</Text>

      <Pressable
        accessibilityLabel="Search cities"
        hitSlop={12}
        onPress={onSearchPress}
        style={styles.iconButton}
      >
        <View style={styles.searchIcon}>
          <View
            style={[styles.searchCircle, { borderColor: lineColor }]}
          />
          <View
            style={[styles.searchHandle, { backgroundColor: lineColor }]}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  menuIcon: {
    gap: 5,
    width: 20,
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
  },
  searchIcon: {
    width: 20,
    height: 20,
    position: "relative",
  },
  searchCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 7,
    height: 2,
    borderRadius: 1,
    position: "absolute",
    bottom: 2,
    right: 0,
    transform: [{ rotate: "45deg" }],
  },
});
