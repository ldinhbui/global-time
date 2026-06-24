import { Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { Spacing, darkColors, lightColors } from "@/constants/theme";
import { City } from "@/constants/cities";
import { useAppPreferences } from "@/contexts/app-preferences-context";
import {
  useThemeInterpolateStyle,
  useThemeStyle,
} from "@/hooks/use-theme-color";
import { formatTime, getClockAngles, getTimezoneLabel, isDaytime } from "@/utils/time";

import { AnalogClock } from "./AnalogClock";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CITY_LIST_ITEM_HEIGHT = Spacing.md * 2 + 44;

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
  const { preferences } = useAppPreferences();
  const { hourAngle, minuteAngle, secondAngle } = getClockAngles(now, city.timezone);
  const daytime = isDaytime(now, city.timezone);

  const rowStyle = useThemeInterpolateStyle(
    "backgroundColor",
    selected ? darkColors.surfaceSelected : darkColors.surface,
    selected ? lightColors.surfaceSelected : lightColors.surface,
    [selected],
  );
  const cityNameStyle = useThemeStyle("text", "color");
  const pinBadgeStyle = useThemeStyle("accent", "color");
  const timezoneStyle = useThemeStyle("textSecondary", "color");
  const digitalTimeStyle = useThemeStyle("text", "color");
  const chevronStyle = useThemeStyle("textSecondary", "color");

  return (
    <AnimatedPressable onPress={onPress} style={[styles.row, rowStyle]}>
      <AnalogClock
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
        secondAngle={secondAngle}
        variant={daytime ? "light" : "dark"}
      />

      <Animated.View style={styles.details}>
        <Animated.View style={styles.titleRow}>
          <Animated.Text style={[styles.cityName, cityNameStyle]}>
            {city.name}, {city.country}
          </Animated.Text>
          {pinned ? (
            <Animated.Text style={[styles.pinBadge, pinBadgeStyle]}>
              Pinned
            </Animated.Text>
          ) : null}
        </Animated.View>
        <Animated.Text style={[styles.timezone, timezoneStyle]}>
          {getTimezoneLabel(now, city.timezone)}
        </Animated.Text>
      </Animated.View>

      <Animated.Text style={[styles.digitalTime, digitalTimeStyle]}>
        {formatTime(now, city.timezone, preferences.timeFormat)}
      </Animated.Text>

      <Animated.Text style={[styles.chevron, chevronStyle]}>›</Animated.Text>
    </AnimatedPressable>
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
    fontSize: 15,
    fontWeight: "600",
  },
  pinBadge: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  timezone: {
    fontSize: 13,
  },
  digitalTime: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 72,
    textAlign: "right",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "300",
    marginLeft: -4,
  },
});
