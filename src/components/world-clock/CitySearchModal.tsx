import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { City } from "@/constants/cities";
import { Spacing } from "@/constants/theme";
import { useAppPreferences } from "@/contexts/app-preferences-context";
import { useThemeStyle } from "@/hooks/use-theme-color";
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
  const { colors, preferences } = useAppPreferences();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backgroundStyle = useThemeStyle("background", "backgroundColor");
  const titleStyle = useThemeStyle("text", "color");
  const closeLabelStyle = useThemeStyle("accent", "color");
  const searchFieldBackgroundStyle = useThemeStyle("surface", "backgroundColor");
  const searchFieldBorderStyle = useThemeStyle("border", "borderColor");
  const searchIconBorderStyle = useThemeStyle("textSecondary", "borderColor");
  const searchIconFillStyle = useThemeStyle("textSecondary", "backgroundColor");
  const inputStyle = useThemeStyle("text", "color");
  const resultCityStyle = useThemeStyle("text", "color");
  const resultTimezoneStyle = useThemeStyle("textSecondary", "color");
  const resultTimeStyle = useThemeStyle("text", "color");
  const separatorStyle = useThemeStyle("border", "backgroundColor");
  const emptyTextStyle = useThemeStyle("textSecondary", "color");

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
      <Animated.View
        style={[
          styles.container,
          backgroundStyle,
          { paddingTop: insets.top + Spacing.sm },
        ]}
      >
        <Animated.View style={styles.header}>
          <Animated.Text style={[styles.title, titleStyle]}>
            Search Cities
          </Animated.Text>
          <Pressable
            accessibilityLabel="Close search"
            hitSlop={12}
            onPress={onClose}
            style={styles.closeButton}
          >
            <Animated.Text style={[styles.closeLabel, closeLabelStyle]}>
              Cancel
            </Animated.Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          style={[
            styles.searchField,
            searchFieldBackgroundStyle,
            searchFieldBorderStyle,
          ]}
        >
          <Animated.View style={styles.searchIcon}>
            <Animated.View style={[styles.searchCircle, searchIconBorderStyle]} />
            <Animated.View style={[styles.searchHandle, searchIconFillStyle]} />
          </Animated.View>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            clearButtonMode="while-editing"
            onChangeText={setQuery}
            placeholder="Search any city"
            placeholderTextColor={colors.textSecondary}
            returnKeyType="search"
            style={[styles.input, { color: colors.text }]}
            value={query}
          />
          {isSearching ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : null}
        </Animated.View>

        <FlatList
          data={results}
          ItemSeparatorComponent={() => (
            <Animated.View style={[styles.separator, separatorStyle]} />
          )}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            showEmptyState ? (
              <Animated.Text
                style={[
                  styles.emptyText,
                  emptyTextStyle,
                  error ? styles.errorText : null,
                ]}
              >
                {emptyMessage}
              </Animated.Text>
            ) : null
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onSelectCity(item)}
              style={({ pressed }) => [
                styles.resultRow,
                pressed && { backgroundColor: colors.accentMuted },
              ]}
            >
              <Animated.View style={styles.resultDetails}>
                <Animated.Text style={[styles.resultCity, resultCityStyle]}>
                  {item.name}, {item.country}
                </Animated.Text>
                <Animated.Text
                  style={[styles.resultTimezone, resultTimezoneStyle]}
                >
                  {item.region
                    ? `${item.region} · ${getTimezoneLabel(now, item.timezone)}`
                    : getTimezoneLabel(now, item.timezone)}
                </Animated.Text>
              </Animated.View>
              <Animated.Text style={[styles.resultTime, resultTimeStyle]}>
                {formatTime(now, item.timezone, preferences.timeFormat)}
              </Animated.Text>
            </Pressable>
          )}
          style={styles.list}
        />
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
  searchField: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
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
    position: "absolute",
    top: 0,
    left: 0,
  },
  searchHandle: {
    width: 6,
    height: 2,
    borderRadius: 1,
    position: "absolute",
    bottom: 1,
    right: 0,
    transform: [{ rotate: "45deg" }],
  },
  input: {
    flex: 1,
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
  resultDetails: {
    flex: 1,
    gap: 2,
  },
  resultCity: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultTimezone: {
    fontSize: 13,
  },
  resultTime: {
    fontSize: 16,
    fontWeight: "700",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: Spacing.md,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    color: "#F87171",
  },
});
