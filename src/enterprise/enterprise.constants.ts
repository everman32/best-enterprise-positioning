export const EARTH_MEAN_RADIUS = 6371;
export const DEGREE_RADIAN_DIFFERENCE = 180;

export const LAST_POSITIONING_INDEX = -1;
export const PENULTIMATE_POSITIONING_INDEX = -2;

export const GOOGLE_COORDINATES_PRECISION = 10e4;

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
