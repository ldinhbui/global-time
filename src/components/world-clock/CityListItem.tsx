import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors, Spacing } from "@/constants/theme";
import { City } from "@/constants/cities";
import { formatTime, getClockAngles, getTimezoneLabel, isDaytime } from "@/utils/time";

import { AnalogClock } from "./AnalogClock";

type CityListItemProps = {
  city: City;
  now: Date;
  selected?: boolean;
  pinned?: boolean;
  onPress?: () => void;
};

export function CityListItem({
  city,
  now,
  selected = false,
  pinned = false,
  onPress,
}: CityListItemProps) {
  const { hourAngle, minuteAngle, secondAngle } = getClockAngles(now, city.timezone);
  const daytime = isDaytime(now, city.timezone);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected && styles.rowSelected]}
    >
      <AnalogClock
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
        secondAngle={secondAngle}
        variant={daytime ? "light" : "dark"}
      />

      <View style={styles.details}>
        <View style={styles.titleRow}>
          <Text style={styles.cityName}>
            {city.name}, {city.country}
          </Text>
          {pinned ? <Text style={styles.pinBadge}>Pinned</Text> : null}
        </View>
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
    backgroundColor: Colors.surface,
  },
  rowSelected: {
    backgroundColor: Colors.surfaceSelected,
  },
  details: {
    flex: 1,
    gap: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  cityName: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  pinBadge: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
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
