import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { SwipeableCityListItem } from "./SwipeableCityListItem";

type CityListProps = {
  cities: City[];
  now: Date;
  selectedCityId: string;
  pinnedCityId: string | null;
  canRemoveCity: (city: City) => boolean;
  onSelectCity: (city: City) => void;
  onPinCity: (city: City) => void;
  onRemoveCity: (city: City) => void;
  onSearchPress?: () => void;
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
    const selectedIndex = unpinned.findIndex((city) => city.id === selectedCityId);
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

export function CityList({
  cities,
  now,
  selectedCityId,
  pinnedCityId,
  canRemoveCity,
  onSelectCity,
  onPinCity,
  onRemoveCity,
  onSearchPress,
}: CityListProps) {
  const orderedCities = useMemo(
    () => orderCities(cities, selectedCityId, pinnedCityId),
    [cities, selectedCityId, pinnedCityId],
  );

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
    <View style={styles.container}>
      {orderedCities.map((item, index) => (
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
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceElevated,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
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
