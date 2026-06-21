import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { CityListItem } from "./CityListItem";

type CityListProps = {
  cities: City[];
  now: Date;
  selectedCityId: string;
  onSelectCity: (city: City) => void;
};

function orderCitiesWithSelectedFirst(cities: City[], selectedCityId: string) {
  const selectedIndex = cities.findIndex((city) => city.id === selectedCityId);
  if (selectedIndex <= 0) return cities;

  const selected = cities[selectedIndex];
  return [selected, ...cities.filter((city) => city.id !== selectedCityId)];
}

export function CityList({
  cities,
  now,
  selectedCityId,
  onSelectCity,
}: CityListProps) {
  const orderedCities = useMemo(
    () => orderCitiesWithSelectedFirst(cities, selectedCityId),
    [cities, selectedCityId],
  );

  return (
    <View style={styles.container}>
      {orderedCities.map((item, index) => (
        <Animated.View
          key={item.id}
          layout={LinearTransition.springify().damping(500).stiffness(500)}
        >
          {index > 0 ? <View style={styles.separator} /> : null}
          <CityListItem
            city={item}
            now={now}
            onPress={() => onSelectCity(item)}
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
