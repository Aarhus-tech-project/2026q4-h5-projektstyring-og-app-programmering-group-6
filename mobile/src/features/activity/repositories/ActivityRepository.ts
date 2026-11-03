import type { SQLiteDatabase } from "expo-sqlite";
import type { Activity } from "../models/activity";

export class ActivityRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async addActivity(activity: Activity): Promise<void> {
    await this.database.runAsync(
      `INSERT INTO Activity (
        Id,
        UserId,
        StartedAt,
        DurationSeconds,
        Status
      ) VALUES (?, ?, ?, ?, ?);`,
      activity.id,
      activity.userId,
      activity.startedAt,
      activity.durationSeconds,
      activity.status
    );
  }

  async getActivity(
  activityId: string,
  userId: number
): Promise<Activity | null> {
  return await this.database.getFirstAsync<Activity>(
    `SELECT
      Id AS id,
      UserId AS userId,
      StartedAt AS startedAt,
      DurationSeconds AS durationSeconds,
      Status AS status
    FROM Activity
    WHERE Id = ? AND UserId = ?;`,
    activityId,
    userId
  );

  
}

async updateActivity(activity: Activity): Promise<void> {
  const result = await this.database.runAsync(
    `UPDATE Activity
     SET DurationSeconds = ?, Status = ?
     WHERE Id = ? AND UserId = ?;`,
    activity.durationSeconds,
    activity.status,
    activity.id,
    activity.userId
  );

  if (result.changes !== 1) {
    throw new Error("Aktiviteten kunne ikke opdateres.");
  }
}
}