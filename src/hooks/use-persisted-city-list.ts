import { useEffect, useState } from "react";

import { City } from "@/constants/cities";
import { loadCityList, saveCityList } from "@/utils/city-list-storage";

export function usePersistedCityList() {
  const [addedCities, setAddedCities] = useState<City[]>([]);
  const [pinnedCityId, setPinnedCityId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [currentLocationCity, setCurrentLocationCity] = useState<City | null>(
    null,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadCityList().then((saved) => {
      if (cancelled) return;

      if (saved) {
        setAddedCities(saved.addedCities);
        setPinnedCityId(saved.pinnedCityId);
        setSelectedCityId(saved.selectedCityId);
        setCurrentLocationCity(saved.currentLocationCity);
      }

      setIsHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    void saveCityList({
      addedCities,
      pinnedCityId,
      selectedCityId,
      currentLocationCity,
    });
  }, [
    addedCities,
    pinnedCityId,
    selectedCityId,
    currentLocationCity,
    isHydrated,
  ]);

  return {
    addedCities,
    setAddedCities,
    pinnedCityId,
    setPinnedCityId,
    selectedCityId,
    setSelectedCityId,
    currentLocationCity,
    setCurrentLocationCity,
    isHydrated,
  };
}
