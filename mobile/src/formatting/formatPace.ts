export function formatPace(
  secondsPerKilometer: number | null
): string {
  if (
    secondsPerKilometer === null ||
    !Number.isFinite(secondsPerKilometer) ||
    secondsPerKilometer <= 0
  ) {
    return "—";
  }

  const totalSeconds = Math.round(secondsPerKilometer);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
