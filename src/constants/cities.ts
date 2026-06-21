export const CURRENT_LOCATION_ID = "current-location";

export type City = {
  id: string;
  name: string;
  country: string;
  timezone: string;
  /** Approximate longitude for globe pin placement (-180 to 180) */
  longitude: number;
  /** Approximate latitude for globe pin placement (-90 to 90) */
  latitude: number;
};

export const CITIES: City[] = [
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
];
