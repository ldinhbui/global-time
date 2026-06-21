import tzLookup from "tz-lookup";

import { City } from "@/constants/cities";

const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const MIN_QUERY_LENGTH = 2;

type OpenMeteoGeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  country: string;
  admin1?: string;
};

type OpenMeteoGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[];
};

export class GeocodingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodingError";
  }
}

export function mapGeocodingResultToCity(result: OpenMeteoGeocodingResult): City {
  return {
    id: `geocode-${result.id}`,
    name: result.name,
    country: result.country,
    timezone: result.timezone ?? tzLookup(result.latitude, result.longitude),
    latitude: result.latitude,
    longitude: result.longitude,
    region: result.admin1,
  };
}

export async function searchCities(query: string): Promise<City[]> {
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH) {
    return [];
  }

  const url = new URL(GEOCODING_API);
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "15");
  url.searchParams.set("language", "en");

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new GeocodingError(
      "Unable to search cities. Check your internet connection.",
    );
  }

  if (!response.ok) {
    throw new GeocodingError("City search is unavailable right now.");
  }

  const data = (await response.json()) as OpenMeteoGeocodingResponse;
  if (!data.results?.length) {
    return [];
  }

  return data.results.map(mapGeocodingResultToCity);
}

export { MIN_QUERY_LENGTH };
