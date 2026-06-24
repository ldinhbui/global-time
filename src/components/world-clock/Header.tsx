import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { Spacing } from "@/constants/theme";
import { useThemeStyle } from "@/hooks/use-theme-color";

type HeaderProps = {
  onSettingsPress?: () => void;
  onSearchPress?: () => void;
};

export function Header({ onSettingsPress, onSearchPress }: HeaderProps) {
  const titleStyle = useThemeStyle("text", "color");
  const lineStyle = useThemeStyle("text", "backgroundColor");
  const borderStyle = useThemeStyle("text", "borderColor");

  return (
    <Animated.View style={styles.container}>
      <Pressable
        accessibilityLabel="Open settings"
        hitSlop={12}
        onPress={onSettingsPress}
        style={styles.iconButton}
      >
        <Animated.View style={styles.menuIcon}>
          <Animated.View style={[styles.menuLine, lineStyle]} />
          <Animated.View style={[styles.menuLine, lineStyle]} />
          <Animated.View style={[styles.menuLine, lineStyle]} />
        </Animated.View>
      </Pressable>

      <Animated.Text style={[styles.title, titleStyle]}>World Clock</Animated.Text>

      <Pressable
        accessibilityLabel="Search cities"
        hitSlop={12}
        onPress={onSearchPress}
        style={styles.iconButton}
      >
        <Animated.View style={styles.searchIcon}>
          <Animated.View style={[styles.searchCircle, borderStyle]} />
          <Animated.View style={[styles.searchHandle, lineStyle]} />
        </Animated.View>
      </Pressable>
    </Animated.View>
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
