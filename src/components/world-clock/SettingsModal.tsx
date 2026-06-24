import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COLOR_SCHEME_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
} from "@/constants/preferences";
import { Spacing, darkColors, lightColors } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";
import {
  useThemeInterpolateStyle,
  useThemeStyle,
} from "@/hooks/use-theme-color";

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

type OptionRowProps<T extends string> = {
  label: string;
  options: { value: T; label: string; example?: string }[];
  selected: T;
  onSelect: (value: T) => void;
};

type OptionItemProps<T extends string> = {
  option: { value: T; label: string; example?: string };
  isSelected: boolean;
  isLast: boolean;
  onSelect: (value: T) => void;
};

function OptionItem<T extends string>({
  option,
  isSelected,
  isLast,
  onSelect,
}: OptionItemProps<T>) {
  const { colors } = useAppPreferences();
  const accentStyle = useThemeStyle("accent", "color");
  const exampleStyle = useThemeStyle("textSecondary", "color");
  const labelStyle = useThemeInterpolateStyle(
    "color",
    isSelected ? darkColors.accent : darkColors.text,
    isSelected ? lightColors.accent : lightColors.text,
    [isSelected],
  );

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      onPress={() => onSelect(option.value)}
      style={({ pressed }) => [
        styles.optionRow,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
        pressed && { backgroundColor: colors.accentMuted },
      ]}
    >
      <Animated.View style={styles.optionContent}>
        <Animated.Text style={[styles.optionLabel, labelStyle]}>
          {option.label}
        </Animated.Text>
        {option.example ? (
          <Animated.Text style={[styles.optionExample, exampleStyle]}>
            {option.example}
          </Animated.Text>
        ) : null}
      </Animated.View>
      {isSelected ? (
        <Animated.Text style={[styles.checkmark, accentStyle]}>✓</Animated.Text>
      ) : null}
    </Pressable>
  );
}

function OptionRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: OptionRowProps<T>) {
  const sectionLabelStyle = useThemeStyle("textSecondary", "color");
  const groupBackgroundStyle = useThemeStyle("surface", "backgroundColor");
  const groupBorderStyle = useThemeStyle("border", "borderColor");

  return (
    <Animated.View style={styles.section}>
      <Animated.Text style={[styles.sectionLabel, sectionLabelStyle]}>
        {label}
      </Animated.Text>
      <Animated.View
        style={[
          styles.optionGroup,
          groupBackgroundStyle,
          groupBorderStyle,
        ]}
      >
        {options.map((option, index) => (
          <OptionItem
            key={option.value}
            isLast={index === options.length - 1}
            isSelected={option.value === selected}
            onSelect={onSelect}
            option={option}
          />
        ))}
      </Animated.View>
    </Animated.View>
  );
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const insets = useSafeAreaInsets();
  const {
    preferences,
    setColorScheme,
    setDateFormat,
    setTimeFormat,
  } = useAppPreferences();

  const backgroundStyle = useThemeStyle("background", "backgroundColor");
  const titleStyle = useThemeStyle("text", "color");
  const closeLabelStyle = useThemeStyle("accent", "color");

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={visible}
    >
      <Animated.View
        style={[
          styles.container,
          backgroundStyle,
          { paddingTop: insets.top + Spacing.sm },
        ]}
      >
        <Animated.View style={styles.header}>
          <Animated.Text style={[styles.title, titleStyle]}>Settings</Animated.Text>
          <Pressable
            accessibilityLabel="Close settings"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Animated.Text style={[styles.closeLabel, closeLabelStyle]}>
              Done
            </Animated.Text>
          </Pressable>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <OptionRow
            label="Appearance"
            onSelect={setColorScheme}
            options={COLOR_SCHEME_OPTIONS}
            selected={preferences.colorScheme}
          />

          <OptionRow
            label="Time Format"
            onSelect={setTimeFormat}
            options={TIME_FORMAT_OPTIONS}
            selected={preferences.timeFormat}
          />

          <OptionRow
            label="Date Format"
            onSelect={setDateFormat}
            options={DATE_FORMAT_OPTIONS}
            selected={preferences.dateFormat}
          />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  closeLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginLeft: Spacing.xs,
  },
  optionGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  optionContent: {
    flex: 1,
    gap: 2,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionExample: {
    fontSize: 13,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "700",
  },
});
