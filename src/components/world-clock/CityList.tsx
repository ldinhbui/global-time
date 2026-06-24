import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  LinearTransition,
  clamp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { CITY_LIST_ITEM_HEIGHT } from "./CityListItem";
import { SwipeableCityListItem } from "./SwipeableCityListItem";

const COLLAPSED_ITEM_COUNT = 3;
const HANDLE_HEIGHT = 28;
const SEPARATOR_HEIGHT = StyleSheet.hairlineWidth;

const SPRING_CONFIG = {
  damping: 32,
  stiffness: 220,
  mass: 0.9,
};

type CityListProps = {
  cities: City[];
  now: Date;
  selectedCityId: string;
  pinnedCityId: string | null;
  hostHeight: number;
  canRemoveCity: (city: City) => boolean;
  onSelectCity: (city: City) => void;
  onPinCity: (city: City) => void;
  onRemoveCity: (city: City) => void;
  onSearchPress?: () => void;
  onExpandedChange?: (expanded: boolean) => void;
};

function orderCities(
  cities: City[],
  selectedCityId: string,
  pinnedCityId: string | null,
) {
  const pinned = pinnedCityId
    ? cities.filter((city) => city.id === pinnedCityId)
    : [];

  const unpinned = cities.filter((city) => city.id !== pinnedCityId);

  if (pinnedCityId !== selectedCityId) {
    const selectedIndex = unpinned.findIndex(
      (city) => city.id === selectedCityId,
    );
    if (selectedIndex > 0) {
      const selected = unpinned[selectedIndex];
      return [
        ...pinned,
        selected,
        ...unpinned.filter((city) => city.id !== selectedCityId),
      ];
    }
  }

  return [...pinned, ...unpinned];
}

function getCollapsedListHeight(itemCount: number) {
  const visibleCount = Math.min(itemCount, COLLAPSED_ITEM_COUNT);
  const separators = Math.max(0, visibleCount - 1);

  return visibleCount * CITY_LIST_ITEM_HEIGHT + separators * SEPARATOR_HEIGHT;
}

const STATE_SWITCH_DRAG_DELTA = 1.5 * CITY_LIST_ITEM_HEIGHT;
const DRAG_VELOCITY_THRESHOLD = 500;

export function CityList({
  cities,
  now,
  selectedCityId,
  pinnedCityId,
  hostHeight,
  canRemoveCity,
  onSelectCity,
  onPinCity,
  onRemoveCity,
  onSearchPress,
  onExpandedChange,
}: CityListProps) {
  const [expanded, setExpanded] = useState(false);

  const orderedCities = useMemo(
    () => orderCities(cities, selectedCityId, pinnedCityId),
    [cities, selectedCityId, pinnedCityId],
  );

  const collapsedListHeight = getCollapsedListHeight(orderedCities.length);
  const collapsedHeight = HANDLE_HEIGHT + collapsedListHeight;

  const sheetHeight = useSharedValue(collapsedHeight);
  const dragStartHeight = useSharedValue(collapsedHeight);
  const expandedAtDragStart = useSharedValue(false);
  const expandedHeight = useSharedValue(hostHeight);
  const collapsedHeightShared = useSharedValue(collapsedHeight);
  const isExpandedShared = useSharedValue(false);

  useEffect(() => {
    isExpandedShared.value = expanded;
    expandedHeight.value = hostHeight;
    collapsedHeightShared.value = collapsedHeight;
  }, [
    collapsedHeight,
    collapsedHeightShared,
    expanded,
    expandedHeight,
    hostHeight,
    isExpandedShared,
  ]);

  useEffect(() => {
    const target = isExpandedShared.value ? hostHeight : collapsedHeight;
    if (isExpandedShared.value && hostHeight <= 0) return;

    sheetHeight.value = withSpring(target, SPRING_CONFIG);
  }, [collapsedHeight, hostHeight, isExpandedShared, sheetHeight]);

  const handleExpandedChange = useCallback(
    (next: boolean) => {
      setExpanded(next);
      onExpandedChange?.(next);
    },
    [onExpandedChange],
  );

  const snapSheet = useCallback(
    (nextExpanded: boolean) => {
      const target = nextExpanded ? hostHeight : collapsedHeight;
      sheetHeight.value = withSpring(target, SPRING_CONFIG);
      handleExpandedChange(nextExpanded);
    },
    [collapsedHeight, handleExpandedChange, hostHeight, sheetHeight],
  );

  useEffect(() => {
    if (orderedCities.length === 0 && expanded) {
      snapSheet(false);
    }
  }, [orderedCities.length, expanded, snapSheet]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-8, 8])
        .onStart(() => {
          dragStartHeight.value = sheetHeight.value;
          expandedAtDragStart.value = isExpandedShared.value;
        })
        .onUpdate((event) => {
          const maxHeight = expandedHeight.value;
          const minHeight = collapsedHeightShared.value;

          if (maxHeight <= minHeight) return;

          sheetHeight.value = clamp(
            dragStartHeight.value - event.translationY,
            minHeight,
            maxHeight,
          );
        })
        .onEnd((event) => {
          const maxHeight = expandedHeight.value;
          const minHeight = collapsedHeightShared.value;

          if (maxHeight <= minHeight) return;

          const dragDelta = sheetHeight.value - dragStartHeight.value;
          const isTap =
            Math.abs(event.translationY) < 10 &&
            Math.abs(event.velocityY) < 150;

          let nextExpanded = expandedAtDragStart.value;

          if (isTap) {
            nextExpanded = !expandedAtDragStart.value;
          } else if (Math.abs(dragDelta) >= STATE_SWITCH_DRAG_DELTA) {
            nextExpanded = !expandedAtDragStart.value;
          } else if (event.velocityY < -DRAG_VELOCITY_THRESHOLD) {
            nextExpanded = true;
          } else if (event.velocityY > DRAG_VELOCITY_THRESHOLD) {
            nextExpanded = false;
          }

          const target = nextExpanded ? maxHeight : minHeight;
          sheetHeight.value = withSpring(target, {
            ...SPRING_CONFIG,
            velocity: -event.velocityY,
          });
          runOnJS(handleExpandedChange)(nextExpanded);
        }),
    [
      collapsedHeightShared,
      dragStartHeight,
      expandedAtDragStart,
      expandedHeight,
      handleExpandedChange,
      sheetHeight,
    ],
  );

  const sheetStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  const listContent = orderedCities.map((item, index) => (
    <Animated.View
      key={item.id}
      layout={LinearTransition.springify().damping(500).stiffness(500)}
    >
      {index > 0 ? <View style={styles.separator} /> : null}
      <SwipeableCityListItem
        canRemove={canRemoveCity(item)}
        city={item}
        now={now}
        onPin={() => onPinCity(item)}
        onPress={() => onSelectCity(item)}
        onRemove={() => onRemoveCity(item)}
        pinned={item.id === pinnedCityId}
        selected={item.id === selectedCityId}
      />
    </Animated.View>
  ));

  if (orderedCities.length === 0) {
    return (
      <View style={styles.container}>
        <Pressable onPress={onSearchPress} style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cities yet</Text>
          <Text style={styles.emptyHint}>Tap to search and add a city</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.sheet, sheetStyle]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          accessibilityLabel={
            expanded ? "Collapse city list" : "Expand city list"
          }
          accessibilityRole="adjustable"
          style={styles.handle}
        >
          <View style={styles.handlePill} />
        </Animated.View>
      </GestureDetector>

      <ScrollView
        bounces={orderedCities.length > COLLAPSED_ITEM_COUNT}
        nestedScrollEnabled
        showsVerticalScrollIndicator={
          expanded || orderedCities.length > COLLAPSED_ITEM_COUNT
        }
        style={styles.list}
      >
        {listContent}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  handle: {
    height: HANDLE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  handlePill: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: SEPARATOR_HEIGHT,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  emptyHint: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
