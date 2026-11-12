import type { ActivityManager } from "../managers/ActivityManager";
import type { NewGpsPoint } from "../models/gpsPoint";
import {
  calculateDistanceMeters,
  calculateRouteDistanceMeters,
} from "../calculations/distance";
import { calculatePaceSecondsPerKilometer } from "../calculations/pace";

type GpsPosition = Pick<NewGpsPoint, "latitude" | "longitude" | "accuracyMeters">;

export class GpsRecorder {
  private running = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private pending: Promise<void> = Promise.resolve();
  private distanceMeters = 0;

  constructor(
    private readonly manager: ActivityManager,
    private readonly source: {
      getNextPosition: () => GpsPosition | null | Promise<GpsPosition | null>;
      stop?: () => void;
    },
  ) {}

  start(
    activityId: string,
    userId: number,
    onPoint: (
      point: NewGpsPoint,
      distanceMeters: number,
      paceSecondsPerKilometer: number | null,
    ) => void,
    onError: (error: unknown) => void,
  ): void {
    if (this.running) {
      throw new Error("GPS-registreringen kører allerede.");
    }

    this.running = true;
    this.distanceMeters = 0;

    let previousPoint: NewGpsPoint | null = null;
    let recentPoints: NewGpsPoint[] = [];

    const recordNext = async (): Promise<void> => {
      if (!this.running) {
        return;
      }

      try {
        const position = await this.source.getNextPosition();
        if (!this.running || position === null) {
          return;
        }

        const point = await this.manager.recordPosition(
          activityId,
          userId,
          position,
        );

        if (previousPoint !== null) {
          this.distanceMeters += calculateDistanceMeters(previousPoint, point);
        }

        previousPoint = point;
        const cutoff = point.elapsedMilliseconds - 10_000;
        recentPoints = [...recentPoints, point].filter(
          (savedPoint) => savedPoint.elapsedMilliseconds >= cutoff,
        );

        const firstPoint = recentPoints[0];
        const windowMilliseconds = firstPoint
          ? point.elapsedMilliseconds - firstPoint.elapsedMilliseconds
          : 0;
        const paceSecondsPerKilometer = calculatePaceSecondsPerKilometer(
          calculateRouteDistanceMeters(recentPoints),
          windowMilliseconds,
        );

        if (this.running) {
          onPoint(point, this.distanceMeters, paceSecondsPerKilometer);
        }
      } catch (error) {
        this.running = false;
        this.source.stop?.();
        onError(error);
      } finally {
        if (this.running) {
          this.timer = setTimeout(() => {
            this.pending = recordNext();
          }, 2000);
        }
      }
    };

    this.pending = recordNext();
  }

  async stop(): Promise<number> {
    this.running = false;
    clearTimeout(this.timer);
    this.source.stop?.();
    await this.pending;
    return this.distanceMeters;
  }
}
