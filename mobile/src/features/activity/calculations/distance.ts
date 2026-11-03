import { distance } from "@turf/distance";
import type { NewGpsPoint } from "../models/gpsPoint";

type Coordinates = Pick<NewGpsPoint, "latitude" | "longitude">;

export function calculateDistanceMeters(
  from: Coordinates,
  to: Coordinates
): number {
  return distance(
    [from.longitude, from.latitude],
    [to.longitude, to.latitude],
    { units: "meters" }
  );
}

export function calculateRouteDistanceMeters(
  points: readonly Coordinates[]
): number {
  let totalDistanceMeters = 0;
  let previousPoint: Coordinates | null = null;

  for (const point of points) {
    if (previousPoint !== null) {
      totalDistanceMeters += calculateDistanceMeters(previousPoint, point);
    }

    previousPoint = point;
  }

  return totalDistanceMeters;
}