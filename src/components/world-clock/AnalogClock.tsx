import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";

// Hand positioning and styling from the first reference SCSS.
const CLOCK_SIZE_SMALL = 12 * 20;
const CLOCK_WEIGHT = 6;
const CLOCK_WEIGHT_SMALL = 3;
const CLOCK_SECONDS_LENGTH = 95;
const CLOCK_MINUTES_LENGTH = 85;
const CLOCK_HOURS_LENGTH = 75;
const HAND_SECONDS_OPACITY = 0.25;
const HAND_MINUTES_OPACITY = 0.5;
const HAND_HOURS_OPACITY = 0.75;
const HAND_CAP_SIZE_RATIO = 0.05;

type AnalogClockProps = {
  hourAngle: number;
  minuteAngle: number;
  secondAngle?: number;
  size?: number;
  showSeconds?: boolean;
};

type HandProps = {
  angle: number;
  color: string;
  handWeight: number;
  lengthPercent: number;
  opacity: number;
  size: number;
};

function getHandWidth(size: number, lengthPercent: number) {
  return size * ((lengthPercent - 50) / 100);
}

function ClockHand({
  angle,
  color,
  handWeight,
  lengthPercent,
  opacity,
  size,
}: HandProps) {
  const width = getHandWidth(size, lengthPercent);
  const top = (size - handWeight) / 2;
  const center = size / 2;

  // SCSS: horizontal hand, transform-origin right center, extends left from hub.
  return (
    <View
      style={[
        styles.handPivot,
        {
          left: center,
          top: top + handWeight / 2,
          transform: [{ rotate: `${angle + 90}deg` }],
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: -width,
          top: -handWeight / 2,
          width,
          height: handWeight,
          borderTopLeftRadius: handWeight,
          borderBottomLeftRadius: handWeight,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: color,
          opacity,
        }}
      />
    </View>
  );
}

function ClockTick({
  angle,
  color,
  size,
}: {
  angle: number;
  color: string;
  size: number;
}) {
  const center = size / 2;

  return (
    <View
      style={[
        styles.handPivot,
        {
          left: center,
          top: center,
          transform: [{ rotate: `${angle}deg` }],
        },
      ]}
    >
      <View
        style={{
          position: "absolute",
          left: -1,
          top: -(size / 2 - 4),
          width: 2,
          height: 4,
          borderRadius: 1,
          backgroundColor: color,
        }}
      />
    </View>
  );
}

export function AnalogClock({
  hourAngle,
  minuteAngle,
  secondAngle = 0,
  size = 44,
  showSeconds,
}: AnalogClockProps) {
  const isSmall = size < CLOCK_SIZE_SMALL;
  const referenceSize = isSmall ? CLOCK_SIZE_SMALL : 12 * 32;
  const referenceWeight = isSmall ? CLOCK_WEIGHT_SMALL : CLOCK_WEIGHT;
  const handWeight = Math.max(
    2,
    Math.round((size / referenceSize) * referenceWeight),
  );
  const shouldShowSeconds = showSeconds ?? !isSmall;
  const capSize = Math.max(3, Math.round(size * HAND_CAP_SIZE_RATIO));

  const faceColor = Colors.background;
  const ringColor = "rgba(255,255,255,0.16)";
  const handColor = Colors.text;
  const tickColor = "rgba(255,255,255,0.35)";

  return (
    <View style={{ width: size, height: size }}>
      <View
        pointerEvents="none"
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ringColor,
          },
        ]}
      />

      <View
        style={[
          styles.wrap,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: faceColor,
          },
        ]}
      >
        {[0, 90, 180, 270].map((angle) => (
          <ClockTick key={angle} angle={angle} color={tickColor} size={size} />
        ))}

        {shouldShowSeconds ? (
          <ClockHand
            angle={secondAngle}
            color={handColor}
            handWeight={handWeight}
            lengthPercent={CLOCK_SECONDS_LENGTH}
            opacity={HAND_SECONDS_OPACITY}
            size={size}
          />
        ) : null}

        <ClockHand
          angle={minuteAngle}
          color={handColor}
          handWeight={handWeight}
          lengthPercent={CLOCK_MINUTES_LENGTH}
          opacity={HAND_MINUTES_OPACITY}
          size={size}
        />

        <ClockHand
          angle={hourAngle}
          color={handColor}
          handWeight={handWeight}
          lengthPercent={CLOCK_HOURS_LENGTH}
          opacity={HAND_HOURS_OPACITY}
          size={size}
        />

        <View
          pointerEvents="none"
          style={[
            styles.handCap,
            {
              width: capSize,
              height: capSize,
              borderRadius: capSize / 2,
              top: size * 0.5 - capSize / 2,
              left: size * 0.5 - capSize / 2,
              backgroundColor: handColor,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
  },
  wrap: {
    overflow: "hidden",
    position: "relative",
  },
  handPivot: {
    position: "absolute",
    width: 0,
    height: 0,
    zIndex: 1,
  },
  handCap: {
    position: "absolute",
    zIndex: 2,
  },
});
