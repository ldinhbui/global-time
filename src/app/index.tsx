import { useCallback, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CityList } from "@/components/world-clock/CityList";
import { GlobeSection } from "@/components/world-clock/GlobeSection";
import { Header } from "@/components/world-clock/Header";
import { CITIES, CURRENT_LOCATION_ID, City } from "@/constants/cities";
import { Colors } from "@/constants/theme";
import { useCurrentTime } from "@/hooks/use-current-time";
import { getCurrentLocationCity, LocationError } from "@/utils/location";

export default function WorldClockScreen() {
  const now = useCurrentTime();
  const [selectedCityId, setSelectedCityId] = useState(CITIES[0].id);
  const [currentLocationCity, setCurrentLocationCity] = useState<City | null>(
    null,
  );
  const [isLocating, setIsLocating] = useState(false);

  const displayedCities = useMemo(
    () =>
      currentLocationCity ? [currentLocationCity, ...CITIES] : CITIES,
    [currentLocationCity],
  );

  const selectedCity = useMemo(() => {
    if (selectedCityId === CURRENT_LOCATION_ID && currentLocationCity) {
      return currentLocationCity;
    }
    return CITIES.find((city) => city.id === selectedCityId) ?? CITIES[0];
  }, [selectedCityId, currentLocationCity]);

  const selectCity = useCallback((city: City) => {
    setSelectedCityId(city.id);
  }, []);

  const selectPrevious = useCallback(() => {
    const index = displayedCities.findIndex((city) => city.id === selectedCityId);
    const previous =
      (index - 1 + displayedCities.length) % displayedCities.length;
    setSelectedCityId(displayedCities[previous].id);
  }, [displayedCities, selectedCityId]);

  const selectNext = useCallback(() => {
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
        <Header />

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
          cities={displayedCities}
          now={now}
          onSelectCity={selectCity}
          selectedCityId={selectedCityId}
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
