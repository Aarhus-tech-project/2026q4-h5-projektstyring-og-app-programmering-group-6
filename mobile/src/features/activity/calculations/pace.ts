export function calculatePaceSecondsPerKilometer(
  distanceMeters: number,
  elapsedMilliseconds: number
): number | null {
  if (
    !Number.isFinite(distanceMeters) ||
    !Number.isFinite(elapsedMilliseconds) ||
    distanceMeters <= 0 ||
    elapsedMilliseconds <= 0
  ) {
    return null;
  }

  const elapsedSeconds = elapsedMilliseconds / 1000;
  const distanceKilometers = distanceMeters / 1000;

  return elapsedSeconds / distanceKilometers;
}