export type ActivityStatus = "active" | "completed";

export type Activity = {
  id: string;
  userId: number;
  startedAt: string;
  durationSeconds: number;
  status: ActivityStatus;
};