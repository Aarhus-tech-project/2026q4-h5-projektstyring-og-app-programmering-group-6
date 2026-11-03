import { randomUUID } from "expo-crypto";
import type { Activity } from "../models/activity";
import type { ActivityRepository } from "../repositories/ActivityRepository";
import type { GpsPointRepository } from "../repositories/GpsPointRepository";
import type { NewGpsPoint } from "../models/gpsPoint";

export class ActivityManager {
  constructor(
    private readonly repository: ActivityRepository,
    private readonly gpsPointRepository: GpsPointRepository) {}

  async startActivity(userId: number): Promise<Activity> {
    const activity: Activity = {
      id: randomUUID(),
      userId,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      status: "active",
    };

    await this.repository.addActivity(activity);

    return activity;
  }

  async stopActivity(
  activityId: string,
  userId: number
): Promise<Activity> {
  const stoppedAt = Date.now();

  const activity = await this.repository.getActivity(activityId, userId);

  if (activity === null) {
    throw new Error("Aktiviteten blev ikke fundet.");
  }

  if (activity.status !== "active") {
    throw new Error("Aktiviteten er allerede afsluttet.");
  }

  const durationSeconds = Math.max(
    0,
    Math.floor((stoppedAt - Date.parse(activity.startedAt)) / 1000)
  );

  const completedActivity: Activity = {
    ...activity,
    durationSeconds,
    status: "completed",
  };

  await this.repository.updateActivity(completedActivity);

  return completedActivity;
}

async recordPosition(
  activityId: string,
  userId: number,
  position: Pick<
    NewGpsPoint,
    "latitude" | "longitude" | "accuracyMeters"
  >
): Promise<NewGpsPoint> {
  const recordedAt = Date.now();

  const activity = await this.repository.getActivity(activityId, userId);

  if (activity === null || activity.status !== "active") {
    throw new Error("Aktiviteten er ikke i gang.");
  }

  const point: NewGpsPoint = {
    activityId: activity.id,
    latitude: position.latitude,
    longitude: position.longitude,
    accuracyMeters: position.accuracyMeters,
    elapsedMilliseconds: Math.max(
      0,
      recordedAt - Date.parse(activity.startedAt)
    ),
  };

  await this.gpsPointRepository.addGpsPoint(point);

  return point;
}
}