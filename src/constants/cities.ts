export const CURRENT_LOCATION_ID = "current-location";

export type City = {
  id: string;
  name: string;
  country: string;
  timezone: string;
  longitude: number;
  latitude: number;
  /** Region/state from geocoding, optional */
  region?: string;
};
