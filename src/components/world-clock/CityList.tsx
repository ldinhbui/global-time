import { FlatList, StyleSheet, View } from "react-native";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";

import { CityListItem } from "./CityListItem";

type CityListProps = {
  cities: City[];
  now: Date;
  selectedCityId: string;
  onSelectCity: (city: City) => void;
};

export function CityList({ cities, now, selectedCityId, onSelectCity }: CityListProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CityListItem
            city={item}
            now={now}
            onPress={() => onSelectCity(item)}
            selected={item.id === selectedCityId}
            variant={item.id === "london" ? "light" : "dark"}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
