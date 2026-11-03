export type GpsPoint = {
  id: number;
  activityId: string;
  latitude: number;
  longitude: number;
  elapsedMilliseconds: number;
  accuracyMeters: number;
};

export type NewGpsPoint = Omit<GpsPoint, "id">;