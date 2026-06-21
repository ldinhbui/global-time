import { StyleSheet, View } from "react-native";

import { Colors } from "@/constants/theme";

type AnalogClockProps = {
  hourAngle: number;
  minuteAngle: number;
  size?: number;
  variant?: "dark" | "light";
};

export function AnalogClock({
  hourAngle,
  minuteAngle,
  size = 44,
  variant = "dark",
}: AnalogClockProps) {
  const isLight = variant === "light";
  const faceColor = isLight ? "#FFFFFF" : Colors.surface;
  const borderColor = isLight ? "rgba(0,0,0,0.12)" : Colors.border;
  const handColor = isLight ? "#1A1A1A" : Colors.text;
  const tickColor = isLight ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.25)";

  const hourHandHeight = size * 0.22;
  const minuteHandHeight = size * 0.32;
  const handWidth = Math.max(2, size * 0.04);

  return (
    <View
      style={[
        styles.face,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: faceColor,
          borderColor,
        },
      ]}
    >
      {[0, 90, 180, 270].map((angle) => (
        <View
          key={angle}
          style={[
            styles.tick,
            {
              backgroundColor: tickColor,
              transform: [{ rotate: `${angle}deg` }, { translateY: -(size / 2 - 4) }],
            },
          ]}
        />
      ))}

      <View
        style={[
          styles.hand,
          {
            width: handWidth,
            height: hourHandHeight,
            backgroundColor: handColor,
            borderRadius: handWidth / 2,
            transform: [{ rotate: `${hourAngle}deg` }, { translateY: -hourHandHeight / 2 }],
          },
        ]}
      />

      <View
        style={[
          styles.hand,
          {
            width: handWidth - 0.5,
            height: minuteHandHeight,
            backgroundColor: handColor,
            borderRadius: handWidth / 2,
            opacity: 0.85,
            transform: [{ rotate: `${minuteAngle}deg` }, { translateY: -minuteHandHeight / 2 }],
          },
        ]}
      />

      <View
        style={[
          styles.centerDot,
          {
            width: size * 0.1,
            height: size * 0.1,
            borderRadius: size * 0.05,
            backgroundColor: handColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tick: {
    position: "absolute",
    width: 2,
    height: 4,
    borderRadius: 1,
  },
  hand: {
    position: "absolute",
    top: "50%",
  },
  centerDot: {
    position: "absolute",
  },
});
