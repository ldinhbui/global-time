import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CityList } from "@/components/world-clock/CityList";
import { CitySearchModal } from "@/components/world-clock/CitySearchModal";
import { GlobeSection } from "@/components/world-clock/GlobeSection";
import { Header } from "@/components/world-clock/Header";
import { CURRENT_LOCATION_ID, City } from "@/constants/cities";
import { Colors } from "@/constants/theme";
import { useCurrentTime } from "@/hooks/use-current-time";
import { getCurrentLocationCity, LocationError } from "@/utils/location";

export default function WorldClockScreen() {
  const now = useCurrentTime();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [currentLocationCity, setCurrentLocationCity] = useState<City | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [addedCities, setAddedCities] = useState<City[]>([]);
  const [pinnedCityId, setPinnedCityId] = useState<string | null>(null);

  const displayedCities = useMemo(() => {
    const cities: City[] = [];
    const seen = new Set<string>();

    const addCity = (city: City) => {
      if (seen.has(city.id)) return;
      seen.add(city.id);
      cities.push(city);
    };

    if (currentLocationCity) {
      addCity(currentLocationCity);
    }

    for (const city of addedCities) {
      addCity(city);
    }

    return cities;
  }, [currentLocationCity, addedCities]);

  const selectedCity = useMemo(() => {
    if (!selectedCityId) return null;
    if (selectedCityId === CURRENT_LOCATION_ID && currentLocationCity) {
      return currentLocationCity;
    }
    return displayedCities.find((city) => city.id === selectedCityId) ?? null;
  }, [selectedCityId, currentLocationCity, displayedCities]);

  const selectCity = useCallback((city: City) => {
    setSelectedCityId(city.id);
  }, []);

  const canRemoveCity = useCallback(
    (_city: City) => displayedCities.length > 1,
    [displayedCities],
  );

  const handlePinCity = useCallback((city: City) => {
    setPinnedCityId((current) => (current === city.id ? null : city.id));
    setSelectedCityId(city.id);
  }, []);

  const handleRemoveCity = useCallback(
    (city: City) => {
      if (displayedCities.length <= 1) return;

      if (city.id === CURRENT_LOCATION_ID) {
        setCurrentLocationCity(null);
      } else {
        setAddedCities((current) => current.filter((item) => item.id !== city.id));
      }

      setPinnedCityId((current) => (current === city.id ? null : current));

      if (selectedCityId === city.id) {
        const remaining = displayedCities.filter((item) => item.id !== city.id);
        setSelectedCityId(remaining[0]?.id ?? null);
      }
    },
    [displayedCities, selectedCityId],
  );

  const handleSearchSelect = useCallback((city: City) => {
    if (city.id !== CURRENT_LOCATION_ID) {
      setAddedCities((current) => {
        if (current.some((item) => item.id === city.id)) {
          return current;
        }
        return [...current, city];
      });
    }

    setSelectedCityId(city.id);
    setIsSearchOpen(false);
  }, []);

  const selectPrevious = useCallback(() => {
    if (displayedCities.length === 0) return;

    const index = displayedCities.findIndex((city) => city.id === selectedCityId);
    const previous =
      (index - 1 + displayedCities.length) % displayedCities.length;
    setSelectedCityId(displayedCities[previous].id);
  }, [displayedCities, selectedCityId]);

  const selectNext = useCallback(() => {
    if (displayedCities.length === 0) return;

    const index = displayedCities.findIndex((city) => city.id === selectedCityId);
    const next = (index + 1) % displayedCities.length;
    setSelectedCityId(displayedCities[next].id);
  }, [displayedCities, selectedCityId]);

  const centerToCurrentLocation = useCallback(async () => {
    if (isLocating) return;

    setIsLocating(true);
    try {
      const locationCity = await getCurrentLocationCity();
      setCurrentLocationCity(locationCity);
      setSelectedCityId(CURRENT_LOCATION_ID);
    } catch (error) {
      const message =
        error instanceof LocationError
          ? error.message
          : "Unable to get your current location. Please try again.";
      Alert.alert("Location unavailable", message);
    } finally {
      setIsLocating(false);
    }
  }, [isLocating]);

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Header onSearchPress={() => setIsSearchOpen(true)} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <GlobeSection
            city={selectedCity}
            isLocating={isLocating}
            now={now}
            onCenterLocation={centerToCurrentLocation}
            onNext={selectNext}
            onPrevious={selectPrevious}
          />
        </ScrollView>

        <CityList
          canRemoveCity={canRemoveCity}
          cities={displayedCities}
          now={now}
          onPinCity={handlePinCity}
          onRemoveCity={handleRemoveCity}
          onSearchPress={() => setIsSearchOpen(true)}
          onSelectCity={selectCity}
          pinnedCityId={pinnedCityId}
          selectedCityId={selectedCityId ?? ""}
        />

        <CitySearchModal
          now={now}
          onClose={() => setIsSearchOpen(false)}
          onSelectCity={handleSearchSelect}
          visible={isSearchOpen}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
});
