import type { SQLiteDatabase } from "expo-sqlite";
import type { NewGpsPoint, GpsPoint } from "../models/gpsPoint";

export class GpsPointRepository {
  constructor(private readonly database: SQLiteDatabase) {}

  async addGpsPoint(point: NewGpsPoint): Promise<void> {
    await this.database.runAsync(
      `INSERT INTO GpsPoint (
        ActivityId,
        Latitude,
        Longitude,
        ElapsedMilliseconds,
        AccuracyMeters
      ) VALUES (?, ?, ?, ?, ?);`,
      point.activityId,
      point.latitude,
      point.longitude,
      point.elapsedMilliseconds,
      point.accuracyMeters
    );
  }

  async getGpsPoints(
  activityId: string,
  userId: number
): Promise<GpsPoint[]> {
  return await this.database.getAllAsync<GpsPoint>(
    `SELECT
      g.Id AS id,
      g.ActivityId AS activityId,
      g.Latitude AS latitude,
      g.Longitude AS longitude,
      g.ElapsedMilliseconds AS elapsedMilliseconds,
      g.AccuracyMeters AS accuracyMeters
    FROM GpsPoint g
    INNER JOIN Activity a ON a.Id = g.ActivityId
    WHERE g.ActivityId = ? AND a.UserId = ?
    ORDER BY g.ElapsedMilliseconds, g.Id;`,
    activityId,
    userId
  );
}
}