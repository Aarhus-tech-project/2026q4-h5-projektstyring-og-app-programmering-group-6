import * as Location from "expo-location";
import type { NewGpsPoint } from "../models/gpsPoint";
import { calculateDistanceMeters } from "../calculations/distance";

type GpsPosition = Pick<NewGpsPoint, "latitude" | "longitude" | "accuracyMeters">;

export class DeviceGpsSource {
  private subscription: Location.LocationSubscription | null = null;
  private latestPosition: GpsPosition | null = null;
  private lastAcceptedPosition: GpsPosition | null = null;
  private stopped = false;

  async start(onError: (reason: string) => void): Promise<void> {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 2000,
        distanceInterval: 0,
      },
      ({ coords }) => {
        if (
          this.stopped ||
          coords.accuracy === null ||
          !Number.isFinite(coords.accuracy) ||
          coords.accuracy < 0 ||
          coords.accuracy > 20 ||
          !Number.isFinite(coords.latitude) ||
          Math.abs(coords.latitude) > 90 ||
          !Number.isFinite(coords.longitude) ||
          Math.abs(coords.longitude) > 180
        ) {
          return;
        }

        this.latestPosition = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracyMeters: coords.accuracy,
        };
      },
      (reason) => {
        if (!this.stopped) {
          onError(reason);
        }
      },
    );

    if (this.stopped) {
      subscription.remove();
      return;
    }

    this.subscription = subscription;
  }

  getNextPosition(): GpsPosition | null {
    const position = this.latestPosition;
    this.latestPosition = null;

    if (position === null) {
      return null;
    }

    if (
      this.lastAcceptedPosition !== null &&
      calculateDistanceMeters(this.lastAcceptedPosition, position) < 5
    ) {
      return null;
    }

    this.lastAcceptedPosition = position;
    return position;
  }

  stop(): void {
    this.stopped = true;
    this.subscription?.remove();
    this.subscription = null;
    this.latestPosition = null;
  }
}
