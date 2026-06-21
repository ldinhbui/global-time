import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { CityListItem } from "./CityListItem";

const ACTION_WIDTH = 96;
const ACTION_ICON_SIZE = 22;

type SwipeableCityListItemProps = {
  city: City;
  now: Date;
  selected?: boolean;
  pinned?: boolean;
  canRemove?: boolean;
  onPress?: () => void;
  onPin?: () => void;
  onRemove?: () => void;
  variant?: "dark" | "light";
};

export function SwipeableCityListItem({
  city,
  now,
  selected = false,
  pinned = false,
  canRemove = true,
  onPress,
  onPin,
  onRemove,
  variant = "dark",
}: SwipeableCityListItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const closeSwipeable = () => {
    swipeableRef.current?.close();
  };

  const handlePin = () => {
    closeSwipeable();
    onPin?.();
  };

  const handleRemove = () => {
    if (!canRemove) {
      closeSwipeable();
      return;
    }
    closeSwipeable();
    onRemove?.();
  };

  const handleSwipeableOpen = (direction: "left" | "right") => {
    if (direction === "left") {
      handlePin();
      return;
    }

    if (direction === "right") {
      handleRemove();
    }
  };

  const renderLeftActions = () => (
    <View style={styles.actionContainer}>
      <Pressable
        accessibilityLabel={pinned ? "Unpin city" : "Pin city to top"}
        onPress={handlePin}
        style={[styles.action, styles.pinAction]}
      >
        <SymbolView
          name={{
            ios: pinned ? "pin.slash.fill" : "pin.fill",
            android: "push_pin",
            web: "push_pin",
          }}
          size={ACTION_ICON_SIZE}
          tintColor={Colors.text}
        />
      </Pressable>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.actionContainer}>
      <Pressable
        accessibilityLabel="Remove city"
        onPress={handleRemove}
        style={[
          styles.action,
          styles.removeAction,
          !canRemove && styles.actionDisabled,
        ]}
      >
        <SymbolView
          name={{
            ios: "trash.fill",
            android: "delete",
            web: "delete",
          }}
          size={ACTION_ICON_SIZE}
          tintColor={Colors.text}
        />
      </Pressable>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      friction={2}
      leftThreshold={ACTION_WIDTH / 2}
      onSwipeableOpen={handleSwipeableOpen}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      rightThreshold={ACTION_WIDTH / 2}
    >
      <View
        style={[
          styles.foreground,
          selected && styles.foregroundSelected,
        ]}
      >
        <CityListItem
          city={city}
          now={now}
          onPress={onPress}
          pinned={pinned}
          selected={selected}
          variant={variant}
        />
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  foreground: {
    backgroundColor: Colors.surface,
  },
  foregroundSelected: {
    backgroundColor: Colors.surfaceSelected,
  },
  actionContainer: {
    width: ACTION_WIDTH,
    height: "100%",
  },
  action: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.sm,
  },
  pinAction: {
    backgroundColor: Colors.accent,
  },
  removeAction: {
    backgroundColor: "#DC2626",
  },
  actionDisabled: {
    opacity: 0.45,
  },
});
