import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { City } from "@/constants/cities";
import { Spacing } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";
import { useThemeStyle } from "@/hooks/use-theme-color";
import { formatDate, formatTime } from "@/utils/time";

const GLOBE_SIZE = 280;

type GlobeSectionProps = {
  city: City | null;
  now: Date;
  isLocating?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCenterLocation: () => void;
};

function getPinPosition(latitude: number, longitude: number, size: number) {
  const center = size / 2;
  const radius = size / 2 - 16;

  const lonOffset = ((longitude + 95) * Math.PI) / 180;
  const latOffset = (latitude * Math.PI) / 180;

  const x = center + Math.sin(lonOffset) * radius * 0.85;
  const y = center - Math.sin(latOffset) * radius * 0.75;

  return { x, y };
};

function GlobeVisual({ size }: { size: number }) {
  const oceanStyle = useThemeStyle("globeOcean", "backgroundColor");
  const landStyle = useThemeStyle("globeLand", "backgroundColor");

  return (
    <Animated.View
      style={[
        styles.globe,
        oceanStyle,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Animated.View style={[styles.ocean, oceanStyle, { borderRadius: size / 2 }]} />

      <Animated.View style={[styles.continent, styles.continentNorthAmerica, landStyle]} />
      <Animated.View style={[styles.continent, styles.continentSouthAmerica, landStyle]} />
      <Animated.View style={[styles.continent, styles.continentEurope, landStyle]} />
      <Animated.View style={[styles.continent, styles.continentAfrica, landStyle]} />

      <Animated.View style={[styles.atmosphere, { borderRadius: size / 2 }]} />
      <Animated.View style={styles.globeShade} />
    </Animated.View>
  );
}

export function GlobeSection({
  city,
  now,
  isLocating = false,
  onPrevious,
  onNext,
  onCenterLocation,
}: GlobeSectionProps) {
  const { colors, preferences } = useAppPreferences();
  const pin = city
    ? getPinPosition(city.latitude, city.longitude, GLOBE_SIZE)
    : null;

  const arrowStyle = useThemeStyle("textSecondary", "color");
  const pinStyle = useThemeStyle("pin", "backgroundColor");
  const overlayBackgroundStyle = useThemeStyle("overlay", "backgroundColor");
  const overlayBorderStyle = useThemeStyle("border", "borderColor");
  const overlayCityStyle = useThemeStyle("textSecondary", "color");
  const overlayTimeStyle = useThemeStyle("text", "color");
  const overlayDateStyle = useThemeStyle("textSecondary", "color");
  const overlayHintStyle = useThemeStyle("textSecondary", "color");
  const locationIconOuterStyle = useThemeStyle("accentMuted", "backgroundColor");
  const accentFillStyle = useThemeStyle("accent", "backgroundColor");
  const locationLabelStyle = useThemeStyle("text", "color");

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.globeRow}>
        <Pressable
          accessibilityLabel="Previous city"
          disabled={!city}
          hitSlop={16}
          onPress={onPrevious}
          style={[styles.arrowButton, !city && styles.arrowButtonDisabled]}
        >
          <Animated.Text style={[styles.arrow, arrowStyle]}>‹</Animated.Text>
        </Pressable>

        <Animated.View style={styles.globeWrapper}>
          <GlobeVisual size={GLOBE_SIZE} />

          {pin ? (
            <Animated.View
              style={[
                styles.pinContainer,
                { left: pin.x - 12, top: pin.y - 28 },
              ]}
            >
              <Animated.View style={[styles.pinHead, pinStyle]} />
              <Animated.View style={[styles.pinStem, pinStyle]} />
              <Animated.View style={styles.pinShadow} />
            </Animated.View>
          ) : null}

          <Animated.View
            style={[styles.overlayCard, overlayBackgroundStyle, overlayBorderStyle]}
          >
            {city ? (
              <>
                <Animated.Text style={[styles.overlayCity, overlayCityStyle]}>
                  {city.name}, {city.country}
                </Animated.Text>
                <Animated.Text style={[styles.overlayTime, overlayTimeStyle]}>
                  {formatTime(now, city.timezone, preferences.timeFormat)}
                </Animated.Text>
                <Animated.Text style={[styles.overlayDate, overlayDateStyle]}>
                  {formatDate(now, city.timezone, preferences.dateFormat)}
                </Animated.Text>
              </>
            ) : (
              <>
                <Animated.Text style={[styles.overlayCity, overlayCityStyle]}>
                  No city selected
                </Animated.Text>
                <Animated.Text style={[styles.overlayHint, overlayHintStyle]}>
                  Search or use your location to get started
                </Animated.Text>
              </>
            )}
          </Animated.View>
        </Animated.View>

        <Pressable
          accessibilityLabel="Next city"
          disabled={!city}
          hitSlop={16}
          onPress={onNext}
          style={[styles.arrowButton, !city && styles.arrowButtonDisabled]}
        >
          <Animated.Text style={[styles.arrow, arrowStyle]}>›</Animated.Text>
        </Pressable>
      </Animated.View>

      <Pressable
        accessibilityLabel="Center to current location"
        disabled={isLocating}
        onPress={onCenterLocation}
        style={[styles.locationButton, isLocating && styles.locationButtonDisabled]}
      >
        <Animated.View style={[styles.locationIconOuter, locationIconOuterStyle]}>
          {isLocating ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <Animated.View style={styles.locationIconInner}>
              <Animated.View style={[styles.locationCrosshairH, accentFillStyle]} />
              <Animated.View style={[styles.locationCrosshairV, accentFillStyle]} />
              <Animated.View style={[styles.locationDot, accentFillStyle]} />
            </Animated.View>
          )}
        </Animated.View>
        <Animated.Text style={[styles.locationLabel, locationLabelStyle]}>
          {isLocating ? "Getting location…" : "Center to Current Location"}
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
  },
  globeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  arrowButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowButtonDisabled: {
    opacity: 0.35,
  },
  arrow: {
    fontSize: 32,
    fontWeight: "200",
    lineHeight: 34,
  },
  globeWrapper: {
    width: GLOBE_SIZE,
    height: GLOBE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  globe: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  ocean: {
    ...StyleSheet.absoluteFill,
  },
  continent: {
    position: "absolute",
    opacity: 0.9,
  },
  continentNorthAmerica: {
    width: 90,
    height: 70,
    borderRadius: 30,
    top: 58,
    left: 42,
    transform: [{ rotate: "-18deg" }],
  },
  continentSouthAmerica: {
    width: 52,
    height: 78,
    borderRadius: 24,
    top: 128,
    left: 88,
    transform: [{ rotate: "8deg" }],
  },
  continentEurope: {
    width: 48,
    height: 36,
    borderRadius: 16,
    top: 62,
    left: 148,
  },
  continentAfrica: {
    width: 44,
    height: 72,
    borderRadius: 18,
    top: 98,
    left: 152,
    transform: [{ rotate: "4deg" }],
  },
  atmosphere: {
    ...StyleSheet.absoluteFill,
    borderWidth: 3,
    borderColor: "rgba(147, 197, 253, 0.12)",
  },
  globeShade: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(11, 22, 40, 0.2)",
  },
  pinContainer: {
    position: "absolute",
    alignItems: "center",
    width: 24,
  },
  pinHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },
  pinStem: {
    width: 2,
    height: 10,
    marginTop: -2,
    zIndex: 1,
  },
  pinShadow: {
    width: 10,
    height: 4,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.35)",
    marginTop: 1,
  },
  overlayCard: {
    position: "absolute",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    minWidth: 200,
  },
  overlayCity: {
    fontSize: 13,
    marginBottom: 4,
  },
  overlayTime: {
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  overlayDate: {
    fontSize: 13,
    marginTop: 4,
  },
  overlayHint: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
  locationButton: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  locationButtonDisabled: {
    opacity: 0.7,
  },
  locationIconOuter: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.35)",
  },
  locationIconInner: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  locationCrosshairH: {
    position: "absolute",
    width: 18,
    height: 2,
    borderRadius: 1,
  },
  locationCrosshairV: {
    position: "absolute",
    width: 2,
    height: 18,
    borderRadius: 1,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
});
