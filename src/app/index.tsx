import { useCallback, useMemo, useState } from "react";
import { Alert, LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { CityList } from "@/components/world-clock/CityList";
import { CitySearchModal } from "@/components/world-clock/CitySearchModal";
import { GlobeSection } from "@/components/world-clock/GlobeSection";
import { Header } from "@/components/world-clock/Header";
import { SettingsModal } from "@/components/world-clock/SettingsModal";
import { CURRENT_LOCATION_ID, City } from "@/constants/cities";
import { useThemeStyle } from "@/hooks/use-theme-color";
import { useCurrentTime } from "@/hooks/use-current-time";
import { usePersistedCityList } from "@/hooks/use-persisted-city-list";
import { getCurrentLocationCity, LocationError } from "@/utils/location";

export default function WorldClockScreen() {
  const now = useCurrentTime();
  const backgroundStyle = useThemeStyle("background", "backgroundColor");
  const {
    addedCities,
    setAddedCities,
    pinnedCityId,
    setPinnedCityId,
    selectedCityId,
    setSelectedCityId,
    currentLocationCity,
    setCurrentLocationCity,
  } = usePersistedCityList();
  const [isLocating, setIsLocating] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [mainHeight, setMainHeight] = useState(0);

  const handleMainLayout = useCallback((event: LayoutChangeEvent) => {
    setMainHeight(event.nativeEvent.layout.height);
  }, []);

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
    <Animated.View style={[styles.root, backgroundStyle]}>
      <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
        <Animated.View style={styles.container}>
        <Header
          onSearchPress={() => setIsSearchOpen(true)}
          onSettingsPress={() => setIsSettingsOpen(true)}
        />

        <View onLayout={handleMainLayout} style={styles.main}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            pointerEvents={isListExpanded ? "none" : "auto"}
            scrollEnabled={!isListExpanded}
            showsVerticalScrollIndicator={false}
            style={styles.globeScroll}
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
            hostHeight={mainHeight}
            now={now}
            onExpandedChange={setIsListExpanded}
            onPinCity={handlePinCity}
            onRemoveCity={handleRemoveCity}
            onSearchPress={() => setIsSearchOpen(true)}
            onSelectCity={selectCity}
            pinnedCityId={pinnedCityId}
            selectedCityId={selectedCityId ?? ""}
          />
        </View>

        <CitySearchModal
          now={now}
          onClose={() => setIsSearchOpen(false)}
          onSelectCity={handleSearchSelect}
          visible={isSearchOpen}
        />

        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          visible={isSettingsOpen}
        />
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  main: {
    flex: 1,
    position: "relative",
  },
  globeScroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 8,
  },
});
