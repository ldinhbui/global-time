export const CURRENT_LOCATION_ID = "current-location";

export type City = {
  id: string;
  name: string;
  country: string;
  timezone: string;
  longitude: number;
  latitude: number;
};

export const WORLD_CITIES: City[] = [
  {
    id: "new-york",
    name: "New York",
    country: "USA",
    timezone: "America/New_York",
    longitude: -74,
    latitude: 40.7,
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    timezone: "Europe/London",
    longitude: -0.1,
    latitude: 51.5,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    timezone: "Asia/Tokyo",
    longitude: 139.7,
    latitude: 35.7,
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    country: "USA",
    timezone: "America/Los_Angeles",
    longitude: -118.2,
    latitude: 34.1,
  },
  {
    id: "chicago",
    name: "Chicago",
    country: "USA",
    timezone: "America/Chicago",
    longitude: -87.6,
    latitude: 41.9,
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    timezone: "Europe/Paris",
    longitude: 2.3,
    latitude: 48.9,
  },
  {
    id: "berlin",
    name: "Berlin",
    country: "Germany",
    timezone: "Europe/Berlin",
    longitude: 13.4,
    latitude: 52.5,
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "UAE",
    timezone: "Asia/Dubai",
    longitude: 55.3,
    latitude: 25.2,
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    timezone: "Asia/Singapore",
    longitude: 103.8,
    latitude: 1.3,
  },
  {
    id: "sydney",
    name: "Sydney",
    country: "Australia",
    timezone: "Australia/Sydney",
    longitude: 151.2,
    latitude: -33.9,
  },
  {
    id: "hong-kong",
    name: "Hong Kong",
    country: "China",
    timezone: "Asia/Hong_Kong",
    longitude: 114.2,
    latitude: 22.3,
  },
  {
    id: "mumbai",
    name: "Mumbai",
    country: "India",
    timezone: "Asia/Kolkata",
    longitude: 72.9,
    latitude: 19.1,
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    timezone: "Africa/Cairo",
    longitude: 31.2,
    latitude: 30.0,
  },
  {
    id: "moscow",
    name: "Moscow",
    country: "Russia",
    timezone: "Europe/Moscow",
    longitude: 37.6,
    latitude: 55.8,
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    country: "Brazil",
    timezone: "America/Sao_Paulo",
    longitude: -46.6,
    latitude: -23.5,
  },
  {
    id: "mexico-city",
    name: "Mexico City",
    country: "Mexico",
    timezone: "America/Mexico_City",
    longitude: -99.1,
    latitude: 19.4,
  },
  {
    id: "toronto",
    name: "Toronto",
    country: "Canada",
    timezone: "America/Toronto",
    longitude: -79.4,
    latitude: 43.7,
  },
  {
    id: "johannesburg",
    name: "Johannesburg",
    country: "South Africa",
    timezone: "Africa/Johannesburg",
    longitude: 28.0,
    latitude: -26.2,
  },
  {
    id: "seoul",
    name: "Seoul",
    country: "South Korea",
    timezone: "Asia/Seoul",
    longitude: 127.0,
    latitude: 37.6,
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    timezone: "Asia/Bangkok",
    longitude: 100.5,
    latitude: 13.8,
  },
  {
    id: "istanbul",
    name: "Istanbul",
    country: "Turkey",
    timezone: "Europe/Istanbul",
    longitude: 29.0,
    latitude: 41.0,
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    timezone: "Europe/Amsterdam",
    longitude: 4.9,
    latitude: 52.4,
  },
  {
    id: "madrid",
    name: "Madrid",
    country: "Spain",
    timezone: "Europe/Madrid",
    longitude: -3.7,
    latitude: 40.4,
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    timezone: "Europe/Rome",
    longitude: 12.5,
    latitude: 41.9,
  },
  {
    id: "auckland",
    name: "Auckland",
    country: "New Zealand",
    timezone: "Pacific/Auckland",
    longitude: 174.8,
    latitude: -36.8,
  },
];

export const CITIES = WORLD_CITIES.filter((city) =>
  ["new-york", "london", "tokyo"].includes(city.id),
);

export function findCityById(id: string): City | undefined {
  return WORLD_CITIES.find((city) => city.id === id);
}
