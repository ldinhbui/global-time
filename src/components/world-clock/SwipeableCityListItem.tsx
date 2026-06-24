import { SymbolView } from "expo-symbols";
import { useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";

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
  const swipeableRef = useRef<SwipeableMethods>(null);
  const actionTriggeredRef = useRef(false);

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

  const handleSwipeableWillOpen = (direction: SwipeDirection) => {
    if (actionTriggeredRef.current) return;
    actionTriggeredRef.current = true;

    if (direction === SwipeDirection.RIGHT) handlePin();
    if (direction === SwipeDirection.LEFT) handleRemove();
  };

  const handleSwipeableClose = () => {
    actionTriggeredRef.current = false;
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
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={1}
      leftThreshold={ACTION_WIDTH}
      onSwipeableClose={handleSwipeableClose}
      onSwipeableWillOpen={handleSwipeableWillOpen}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      rightThreshold={ACTION_WIDTH}
      animationOptions={{
        stiffness: 900,
        damping: 120,
        mass: 0.5,
      }}
    >
      <View style={[styles.foreground, selected && styles.foregroundSelected]}>
        <CityListItem
          city={city}
          now={now}
          onPress={onPress}
          pinned={pinned}
          selected={selected}
          variant={variant}
        />
      </View>
    </ReanimatedSwipeable>
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
