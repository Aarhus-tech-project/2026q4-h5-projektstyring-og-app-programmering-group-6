import type { NewGpsPoint } from "../models/gpsPoint";

type Coordinates = Pick<NewGpsPoint, "latitude" | "longitude">;

export function calculateDirectionDegrees(
  from: Coordinates,
  to: Coordinates
): number {
  const radians = Math.PI / 180;

  const fromLatitude = from.latitude * radians;
  const toLatitude = to.latitude * radians;
  const longitudeDifference = (to.longitude - from.longitude) * radians;

  const y = Math.sin(longitudeDifference) * Math.cos(toLatitude);

  const x =
    Math.cos(fromLatitude) * Math.sin(toLatitude) -
    Math.sin(fromLatitude) *
      Math.cos(toLatitude) *
      Math.cos(longitudeDifference);

  const degrees = Math.atan2(y, x) / radians;

  return (degrees + 360) % 360;
}