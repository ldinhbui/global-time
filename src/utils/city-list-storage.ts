import AsyncStorage from "@react-native-async-storage/async-storage";

import { City } from "@/constants/cities";

const STORAGE_KEY = "@global-time/city-list";

export type PersistedCityList = {
  addedCities: City[];
  pinnedCityId: string | null;
  selectedCityId: string | null;
  currentLocationCity: City | null;
};

function isCity(value: unknown): value is City {
  if (!value || typeof value !== "object") return false;

  const city = value as Record<string, unknown>;
  return (
    typeof city.id === "string" &&
    typeof city.name === "string" &&
    typeof city.country === "string" &&
    typeof city.timezone === "string" &&
    typeof city.longitude === "number" &&
    typeof city.latitude === "number"
  );
}

function parsePersisted(data: string): PersistedCityList | null {
  try {
    const parsed = JSON.parse(data) as Partial<PersistedCityList>;
    if (!parsed || typeof parsed !== "object") return null;

    return {
      addedCities: Array.isArray(parsed.addedCities)
        ? parsed.addedCities.filter(isCity)
        : [],
      pinnedCityId:
        typeof parsed.pinnedCityId === "string" ? parsed.pinnedCityId : null,
      selectedCityId:
        typeof parsed.selectedCityId === "string" ? parsed.selectedCityId : null,
      currentLocationCity: isCity(parsed.currentLocationCity)
        ? parsed.currentLocationCity
        : null,
    };
  } catch {
    return null;
  }
}

export async function loadCityList(): Promise<PersistedCityList | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  return parsePersisted(raw);
}

export async function saveCityList(state: PersistedCityList): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
