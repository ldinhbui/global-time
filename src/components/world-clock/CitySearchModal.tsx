import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { City, WORLD_CITIES } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";
import { searchCities } from "@/utils/search-cities";
import { formatTime, getTimezoneLabel } from "@/utils/time";

type CitySearchModalProps = {
  visible: boolean;
  now: Date;
  onClose: () => void;
  onSelectCity: (city: City) => void;
};

export function CitySearchModal({
  visible,
  now,
  onClose,
  onSelectCity,
}: CitySearchModalProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!visible) {
      setQuery("");
    }
  }, [visible]);

  const results = useMemo(
    () => searchCities(query, WORLD_CITIES),
    [query],
  );

  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
      visible={visible}
    >
      <View style={[styles.container, { paddingTop: insets.top + Spacing.sm }]}>
        <View style={styles.header}>
          <Text style={styles.title}>Search Cities</Text>
          <Pressable
            accessibilityLabel="Close search"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Text style={styles.closeLabel}>Cancel</Text>
          </Pressable>
        </View>

        <View style={styles.searchField}>
          <View style={styles.searchIcon}>
            <View style={styles.searchCircle} />
            <View style={styles.searchHandle} />
          </View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            clearButtonMode="while-editing"
            onChangeText={setQuery}
            placeholder="City or country"
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="search"
            style={styles.input}
            value={query}
          />
        </View>

        <FlatList
          data={results}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No cities match your search.</Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelectCity(item)}
              style={({ pressed }) => [
                styles.resultRow,
                pressed && styles.resultRowPressed,
              ]}
            >
              <View style={styles.resultDetails}>
                <Text style={styles.resultCity}>
                  {item.name}, {item.country}
                </Text>
                <Text style={styles.resultTimezone}>
                  {getTimezoneLabel(now, item.timezone)}
                </Text>
              </View>
              <Text style={styles.resultTime}>{formatTime(now, item.timezone)}</Text>
            </Pressable>
          )}
          style={styles.list}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  closeLabel: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "500",
  },
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    width: 18,
    height: 18,
    position: "relative",
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 6,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.textSecondary,
    position: "absolute",
    bottom: 1,
    right: 0,
    transform: [{ rotate: "45deg" }],
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: Spacing.xs,
  },
  list: {
    flex: 1,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  resultRowPressed: {
    backgroundColor: Colors.accentMuted,
  },
  resultDetails: {
    flex: 1,
    gap: 2,
  },
  resultCity: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  resultTimezone: {
    color: Colors.textSecondary,
    fontSize: 13,
  },
  resultTime: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: "center",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
});
