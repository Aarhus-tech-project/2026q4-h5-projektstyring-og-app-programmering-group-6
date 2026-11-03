import type { SQLiteDatabase } from "expo-sqlite";

export async function initializeDatabase(
  database: SQLiteDatabase
): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS Activity (
        Id TEXT PRIMARY KEY NOT NULL,
        UserId INTEGER NOT NULL,
        StartedAt TEXT NOT NULL,
        DurationSeconds INTEGER NOT NULL DEFAULT 0,
        Status TEXT NOT NULL
);
    CREATE TABLE IF NOT EXISTS GpsPoint (
        Id INTEGER PRIMARY KEY NOT NULL,
        ActivityId TEXT NOT NULL,
        Latitude REAL NOT NULL,
        Longitude REAL NOT NULL,
        ElapsedMilliseconds INTEGER NOT NULL,
        AccuracyMeters REAL NOT NULL,
        FOREIGN KEY (ActivityId) REFERENCES Activity(Id) ON DELETE CASCADE
        );
  `);
  
}