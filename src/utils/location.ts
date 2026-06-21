import * as Location from "expo-location";
import tzLookup from "tz-lookup";

import { City, CURRENT_LOCATION_ID } from "@/constants/cities";

export class LocationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocationError";
  }
}

export async function getCurrentLocationCity(): Promise<City> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    throw new LocationError(
      "Location permission is required to show your local time.",
    );
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const { latitude, longitude } = position.coords;
  const timezone = tzLookup(latitude, longitude);

  let name = "Current Location";
  let country = "";

  try {
    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (place) {
      name = place.city ?? place.subregion ?? place.region ?? name;
      country = place.country ?? place.isoCountryCode ?? "";
    }
  } catch {
    // Reverse geocoding is optional; timezone still works from GPS coordinates.
  }

  return {
    id: CURRENT_LOCATION_ID,
    name,
    country,
    timezone,
    latitude,
    longitude,
  };
}
