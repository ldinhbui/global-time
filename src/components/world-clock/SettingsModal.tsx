import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  COLOR_SCHEME_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
} from "@/constants/preferences";
import { Spacing } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";

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

function OptionRow<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: OptionRowProps<T>) {
  const { colors } = useAppPreferences();

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <View
        style={[
          styles.optionGroup,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {options.map((option, index) => {
          const isSelected = option.value === selected;
          const isLast = index === options.length - 1;

          return (
            <Pressable
              key={option.value}
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
              <View style={styles.optionContent}>
                <Text
                  style={[
                    styles.optionLabel,
                    { color: isSelected ? colors.accent : colors.text },
                  ]}
                >
                  {option.label}
                </Text>
                {option.example ? (
                  <Text
                    style={[
                      styles.optionExample,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {option.example}
                  </Text>
                ) : null}
              </View>
              {isSelected ? (
                <Text style={[styles.checkmark, { color: colors.accent }]}>
                  ✓
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const insets = useSafeAreaInsets();
  const {
    colors,
    preferences,
    setColorScheme,
    setDateFormat,
    setTimeFormat,
  } = useAppPreferences();

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={visible}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + Spacing.sm,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          <Pressable
            accessibilityLabel="Close settings"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={[styles.closeLabel, { color: colors.accent }]}>
              Done
            </Text>
          </Pressable>
        </View>

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
      </View>
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
