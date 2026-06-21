import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { City } from "@/constants/cities";
import { formatTime, getClockAngles, getTimezoneLabel } from "@/utils/time";

import { AnalogClock } from "./AnalogClock";

type CityListItemProps = {
  city: City;
  now: Date;
  selected?: boolean;
  onPress?: () => void;
  variant?: "dark" | "light";
};

export function CityListItem({
  city,
  now,
  selected = false,
  onPress,
  variant = "dark",
}: CityListItemProps) {
  const { hourAngle, minuteAngle } = getClockAngles(now, city.timezone);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <AnalogClock
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
        variant={variant}
      />

      <View style={styles.details}>
        <Text style={styles.cityName}>
          {city.name}, {city.country}
        </Text>
        <Text style={styles.timezone}>{getTimezoneLabel(now, city.timezone)}</Text>
      </View>

      <Text style={styles.digitalTime}>{formatTime(now, city.timezone)}</Text>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  rowSelected: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
  },
  details: {
    flex: 1,
    gap: 2,
  },
  cityName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  timezone: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  digitalTime: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
    minWidth: 72,
    textAlign: "right",
  },
  chevron: {
    color: Colors.textSecondary,
    fontSize: 22,
    fontWeight: "300",
    marginLeft: -4,
  },
});
