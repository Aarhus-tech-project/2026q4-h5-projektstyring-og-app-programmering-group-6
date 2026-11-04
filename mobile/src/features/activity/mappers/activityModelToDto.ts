import type { Activity } from "../models/activity";
import type { GpsPoint } from "../models/gpsPoint";
import type { CreateActivityRequest } from "../dtos/activity";

export function activityModelToDto(
  activity: Activity,
  gpsPoints: readonly GpsPoint[],
  distanceMeters: number
): CreateActivityRequest {
  return {
    id: activity.id,
    startedAt: activity.startedAt,
    durationSeconds: activity.durationSeconds,
    distanceMeters,
    gpsPoints: gpsPoints.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
      elapsedMilliseconds: point.elapsedMilliseconds,
      accuracyMeters: point.accuracyMeters,
    })),
  };
}