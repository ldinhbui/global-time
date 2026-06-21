import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { SwipeableCityListItem } from "./SwipeableCityListItem";

type CityListProps = {
  cities: City[];
  now: Date;
  selectedCityId: string;
  pinnedCityIds: string[];
  canRemoveCity: (city: City) => boolean;
  onSelectCity: (city: City) => void;
  onPinCity: (city: City) => void;
  onRemoveCity: (city: City) => void;
};

function orderCities(
  cities: City[],
  selectedCityId: string,
  pinnedCityIds: string[],
) {
  const pinned = pinnedCityIds
    .map((id) => cities.find((city) => city.id === id))
    .filter((city): city is City => city !== undefined);

  const unpinned = cities.filter((city) => !pinnedCityIds.includes(city.id));

  if (!pinnedCityIds.includes(selectedCityId)) {
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
  pinnedCityIds,
  canRemoveCity,
  onSelectCity,
  onPinCity,
  onRemoveCity,
}: CityListProps) {
  const orderedCities = useMemo(
    () => orderCities(cities, selectedCityId, pinnedCityIds),
    [cities, selectedCityId, pinnedCityIds],
  );

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
            pinned={pinnedCityIds.includes(item.id)}
            selected={item.id === selectedCityId}
            variant={item.id === "london" ? "light" : "dark"}
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
});
