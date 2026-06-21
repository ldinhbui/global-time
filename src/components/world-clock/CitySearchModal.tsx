import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { City } from "@/constants/cities";
import { Colors, Spacing } from "@/constants/theme";
import {
  GeocodingError,
  MIN_QUERY_LENGTH,
  searchCities,
} from "@/utils/geocoding";
import { formatTime, getTimezoneLabel } from "@/utils/time";

type CitySearchModalProps = {
  visible: boolean;
  now: Date;
  onClose: () => void;
  onSelectCity: (city: City) => void;
};

function getEmptyMessage(query: string, isSearching: boolean, error: string | null) {
  if (error) return error;
  if (isSearching) return null;
  if (query.trim().length < MIN_QUERY_LENGTH) {
    return `Type at least ${MIN_QUERY_LENGTH} characters to search any city.`;
  }
  return "No cities found. Try a different spelling.";
}

export function CitySearchModal({
  visible,
  now,
  onClose,
  onSelectCity,
}: CitySearchModalProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setQuery("");
      setResults([]);
      setError(null);
      setIsSearching(false);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setError(null);

    let isCancelled = false;

    const timeoutId = setTimeout(async () => {
      try {
        const cities = await searchCities(trimmed);
        if (!isCancelled) {
          setResults(cities);
          setError(null);
        }
      } catch (searchError) {
        if (!isCancelled) {
          setResults([]);
          setError(
            searchError instanceof GeocodingError
              ? searchError.message
              : "City search failed. Please try again.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 350);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [query, visible]);

  const emptyMessage = getEmptyMessage(query, isSearching, error);
  const showEmptyState = !isSearching && results.length === 0 && emptyMessage;

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
            placeholder="Search any city"
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="search"
            style={styles.input}
            value={query}
          />
          {isSearching ? (
            <ActivityIndicator color={Colors.accent} size="small" />
          ) : null}
        </View>

        <FlatList
          data={results}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            showEmptyState ? (
              <Text
                style={[
                  styles.emptyText,
                  error ? styles.errorText : null,
                ]}
              >
                {emptyMessage}
              </Text>
            ) : null
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
                  {item.region
                    ? `${item.region} · ${getTimezoneLabel(now, item.timezone)}`
                    : getTimezoneLabel(now, item.timezone)}
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
  errorText: {
    color: "#F87171",
  },
});
