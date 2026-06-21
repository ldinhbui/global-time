import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";

type HeaderProps = {
  onMenuPress?: () => void;
  onSearchPress?: () => void;
};

export function Header({ onMenuPress, onSearchPress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Open menu"
        hitSlop={12}
        onPress={onMenuPress}
        style={styles.iconButton}
      >
        <View style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </View>
      </Pressable>

      <Text style={styles.title}>World Clock</Text>

      <Pressable
        accessibilityLabel="Search cities"
        hitSlop={12}
        onPress={onSearchPress}
        style={styles.iconButton}
      >
        <View style={styles.searchIcon}>
          <View style={styles.searchCircle} />
          <View style={styles.searchHandle} />
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
    color: Colors.text,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  menuIcon: {
    gap: 5,
    width: 20,
  },
  menuLine: {
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.text,
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
    borderColor: Colors.text,
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 7,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.text,
    position: "absolute",
    bottom: 2,
    right: 0,
    transform: [{ rotate: "45deg" }],
  },
});
