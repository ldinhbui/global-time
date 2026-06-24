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
  useAnimatedScrollHandler,
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

function getListContentHeight(itemCount: number) {
  const separators = Math.max(0, itemCount - 1);

  return itemCount * CITY_LIST_ITEM_HEIGHT + separators * SEPARATOR_HEIGHT;
}

function getCollapsedListHeight(itemCount: number) {
  const visibleCount = Math.min(itemCount, COLLAPSED_ITEM_COUNT);
  const separators = Math.max(0, visibleCount - 1);

  return visibleCount * CITY_LIST_ITEM_HEIGHT + separators * SEPARATOR_HEIGHT;
}

const STATE_SWITCH_DRAG_DELTA = 1.5 * CITY_LIST_ITEM_HEIGHT;
const DRAG_VELOCITY_THRESHOLD = 500;
const SCROLL_EDGE_THRESHOLD = 1;
const INSTANT_DRAG_THRESHOLD = 2;

function isAtListBottom(
  scrollOffset: number,
  scrollContentHeight: number,
  scrollViewportHeight: number,
  atScrollBottom: boolean,
) {
  "worklet";

  return (
    atScrollBottom ||
    scrollContentHeight <= scrollViewportHeight + SCROLL_EDGE_THRESHOLD ||
    scrollOffset + scrollViewportHeight >=
      scrollContentHeight - SCROLL_EDGE_THRESHOLD
  );
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

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
  const listContentHeight = getListContentHeight(orderedCities.length);

  const sheetHeight = useSharedValue(collapsedHeight);
  const dragStartHeight = useSharedValue(collapsedHeight);
  const expandedAtDragStart = useSharedValue(false);
  const expandedHeight = useSharedValue(hostHeight);
  const collapsedHeightShared = useSharedValue(collapsedHeight);
  const isExpandedShared = useSharedValue(false);
  const scrollOffset = useSharedValue(0);
  const scrollContentHeight = useSharedValue(listContentHeight);
  const scrollViewportHeight = useSharedValue(collapsedListHeight);
  const atScrollTop = useSharedValue(true);
  const atScrollBottom = useSharedValue(true);
  const lastTouchY = useSharedValue(0);
  const listSheetDragActive = useSharedValue(false);

  useEffect(() => {
    isExpandedShared.value = expanded;
    expandedHeight.value = hostHeight;
    collapsedHeightShared.value = collapsedHeight;
    scrollContentHeight.value = listContentHeight;
    scrollViewportHeight.value = expanded
      ? Math.max(0, hostHeight - HANDLE_HEIGHT)
      : collapsedListHeight;
  }, [
    collapsedHeight,
    collapsedHeightShared,
    collapsedListHeight,
    expanded,
    expandedHeight,
    hostHeight,
    isExpandedShared,
    listContentHeight,
    scrollContentHeight,
    scrollViewportHeight,
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

  const toggleSheet = useCallback(() => {
    snapSheet(!expanded);
  }, [expanded, snapSheet]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const { contentOffset, contentSize, layoutMeasurement } = event;

      scrollOffset.value = contentOffset.y;
      scrollContentHeight.value = contentSize.height;
      scrollViewportHeight.value = layoutMeasurement.height;
      atScrollTop.value = contentOffset.y <= SCROLL_EDGE_THRESHOLD;
      atScrollBottom.value =
        contentSize.height <= layoutMeasurement.height + SCROLL_EDGE_THRESHOLD ||
        contentOffset.y + layoutMeasurement.height >=
          contentSize.height - SCROLL_EDGE_THRESHOLD;
    },
  });

  const nativeScrollGesture = useMemo(() => Gesture.Native(), []);

  const tapGesture = useMemo(
    () =>
      Gesture.Tap().onEnd(() => {
        runOnJS(toggleSheet)();
      }),
    [toggleSheet],
  );

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

          let nextExpanded = expandedAtDragStart.value;

          if (Math.abs(dragDelta) >= STATE_SWITCH_DRAG_DELTA) {
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

  const handleGesture = useMemo(
    () => Gesture.Exclusive(tapGesture, panGesture),
    [panGesture, tapGesture],
  );

  const listPanGesture = useMemo(
    () =>
      Gesture.Pan()
        .manualActivation(true)
        .simultaneousWithExternalGesture(nativeScrollGesture)
        .onTouchesDown((event) => {
          lastTouchY.value = event.allTouches[0]?.y ?? 0;
        })
        .onTouchesMove((event, state) => {
          const touch = event.allTouches[0];
          if (!touch) return;

          const instantDy = touch.y - lastTouchY.value;
          lastTouchY.value = touch.y;

          if (Math.abs(instantDy) < INSTANT_DRAG_THRESHOLD) return;

          const isAtBottom = isAtListBottom(
            scrollOffset.value,
            scrollContentHeight.value,
            scrollViewportHeight.value,
            atScrollBottom.value,
          );
          const wantsCollapse =
            isExpandedShared.value && atScrollTop.value && instantDy > 0;
          const wantsExpand =
            !isExpandedShared.value && isAtBottom && instantDy < 0;

          if (wantsCollapse || wantsExpand) {
            state.activate();
          }
        })
        .onStart(() => {
          listSheetDragActive.value = false;
          dragStartHeight.value = sheetHeight.value;
          expandedAtDragStart.value = isExpandedShared.value;
        })
        .onUpdate((event) => {
          const maxHeight = expandedHeight.value;
          const minHeight = collapsedHeightShared.value;

          if (maxHeight <= minHeight) return;

          const isAtBottom = isAtListBottom(
            scrollOffset.value,
            scrollContentHeight.value,
            scrollViewportHeight.value,
            atScrollBottom.value,
          );
          const shouldCollapse =
            expandedAtDragStart.value &&
            atScrollTop.value &&
            event.translationY > 0;
          const shouldExpand =
            !expandedAtDragStart.value && isAtBottom && event.translationY < 0;

          if (!shouldCollapse && !shouldExpand) {
            return;
          }

          listSheetDragActive.value = true;
          sheetHeight.value = clamp(
            dragStartHeight.value - event.translationY,
            minHeight,
            maxHeight,
          );
        })
        .onEnd((event) => {
          if (!listSheetDragActive.value) return;

          listSheetDragActive.value = false;

          const maxHeight = expandedHeight.value;
          const minHeight = collapsedHeightShared.value;

          if (maxHeight <= minHeight) return;

          const dragDelta = sheetHeight.value - dragStartHeight.value;

          let nextExpanded = expandedAtDragStart.value;

          if (Math.abs(dragDelta) >= STATE_SWITCH_DRAG_DELTA) {
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
      atScrollBottom,
      atScrollTop,
      collapsedHeightShared,
      dragStartHeight,
      expandedAtDragStart,
      expandedHeight,
      handleExpandedChange,
      lastTouchY,
      listSheetDragActive,
      nativeScrollGesture,
      scrollContentHeight,
      scrollOffset,
      scrollViewportHeight,
      sheetHeight,
    ],
  );

  const listGesture = useMemo(
    () => Gesture.Simultaneous(listPanGesture, nativeScrollGesture),
    [listPanGesture, nativeScrollGesture],
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
      <GestureDetector gesture={handleGesture}>
        <Animated.View
          accessibilityLabel={
            expanded ? "Collapse city list" : "Expand city list"
          }
          accessibilityRole="button"
          style={styles.handle}
        >
          <View style={styles.handlePill} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={listGesture}>
        <AnimatedScrollView
          bounces={orderedCities.length > COLLAPSED_ITEM_COUNT}
          nestedScrollEnabled
          onContentSizeChange={(_, height) => {
            scrollContentHeight.value = height;
            atScrollBottom.value =
              height <= scrollViewportHeight.value + SCROLL_EDGE_THRESHOLD ||
              scrollOffset.value + scrollViewportHeight.value >=
                height - SCROLL_EDGE_THRESHOLD;
          }}
          onLayout={(event) => {
            const viewportHeight = event.nativeEvent.layout.height;
            scrollViewportHeight.value = viewportHeight;
            atScrollBottom.value =
              scrollContentHeight.value <= viewportHeight + SCROLL_EDGE_THRESHOLD ||
              scrollOffset.value + viewportHeight >=
                scrollContentHeight.value - SCROLL_EDGE_THRESHOLD;
          }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={
            expanded || orderedCities.length > COLLAPSED_ITEM_COUNT
          }
          style={styles.list}
        >
          {listContent}
        </AnimatedScrollView>
      </GestureDetector>
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
