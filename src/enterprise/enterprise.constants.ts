export const LAST_POSITIONING_INDEX = -1;
export const PENULTIMATE_POSITIONING_INDEX = -2;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Customer = {
  coordinates: Coordinates;
  transportTariff: number;
  productVolume: number;
};

export type Enterprise = {
  coordinates: Coordinates;
  transportCosts: number;
};
