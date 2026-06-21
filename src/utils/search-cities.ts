import { City } from "@/constants/cities";

export function searchCities(query: string, cities: City[]): City[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return cities;

  return cities.filter((city) => {
    const haystack = `${city.name} ${city.country} ${city.timezone}`.toLowerCase();
    return haystack.includes(normalized);
  });
}
