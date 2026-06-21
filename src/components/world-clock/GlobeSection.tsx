import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";
import { formatDate, formatTime } from "@/utils/time";

const GLOBE_SIZE = 280;

type GlobeSectionProps = {
  city: City;
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
}

function GlobeVisual({ size }: { size: number }) {
  return (
    <View style={[styles.globe, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.ocean, { borderRadius: size / 2 }]} />

      <View style={[styles.continent, styles.continentNorthAmerica]} />
      <View style={[styles.continent, styles.continentSouthAmerica]} />
      <View style={[styles.continent, styles.continentEurope]} />
      <View style={[styles.continent, styles.continentAfrica]} />

      <View style={[styles.atmosphere, { borderRadius: size / 2 }]} />
      <View style={styles.globeShade} />
    </View>
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
  const pin = getPinPosition(city.latitude, city.longitude, GLOBE_SIZE);

  return (
    <View style={styles.container}>
      <View style={styles.globeRow}>
        <Pressable
          accessibilityLabel="Previous city"
          hitSlop={16}
          onPress={onPrevious}
          style={styles.arrowButton}
        >
          <Text style={styles.arrow}>‹</Text>
        </Pressable>

        <View style={styles.globeWrapper}>
          <GlobeVisual size={GLOBE_SIZE} />

          <View
            style={[
              styles.pinContainer,
              { left: pin.x - 12, top: pin.y - 28 },
            ]}
          >
            <View style={styles.pinHead} />
            <View style={styles.pinStem} />
            <View style={styles.pinShadow} />
          </View>

          <View style={styles.overlayCard}>
            <Text style={styles.overlayCity}>
              {city.name}, {city.country}
            </Text>
            <Text style={styles.overlayTime}>{formatTime(now, city.timezone)}</Text>
            <Text style={styles.overlayDate}>{formatDate(now, city.timezone)}</Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel="Next city"
          hitSlop={16}
          onPress={onNext}
          style={styles.arrowButton}
        >
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="Center to current location"
        disabled={isLocating}
        onPress={onCenterLocation}
        style={[styles.locationButton, isLocating && styles.locationButtonDisabled]}
      >
        <View style={styles.locationIconOuter}>
          {isLocating ? (
            <ActivityIndicator color={Colors.accent} size="small" />
          ) : (
            <View style={styles.locationIconInner}>
              <View style={styles.locationCrosshairH} />
              <View style={styles.locationCrosshairV} />
              <View style={styles.locationDot} />
            </View>
          )}
        </View>
        <Text style={styles.locationLabel}>
          {isLocating ? "Getting location…" : "Center to Current Location"}
        </Text>
      </Pressable>
    </View>
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
  arrow: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.globeOcean,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  ocean: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.globeOcean,
  },
  continent: {
    position: "absolute",
    backgroundColor: Colors.globeLand,
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
    backgroundColor: Colors.pin,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 2,
  },
  pinStem: {
    width: 2,
    height: 10,
    backgroundColor: Colors.pin,
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
    backgroundColor: Colors.overlay,
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 200,
  },
  overlayCity: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginBottom: 4,
  },
  overlayTime: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  overlayDate: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
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
    backgroundColor: Colors.accentMuted,
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
    backgroundColor: Colors.accent,
  },
  locationCrosshairV: {
    position: "absolute",
    width: 2,
    height: 18,
    borderRadius: 1,
    backgroundColor: Colors.accent,
  },
  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  locationLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
});
