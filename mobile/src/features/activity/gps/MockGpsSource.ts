import { calculateDistanceMeters } from "../calculations/distance";
import { mockRoute } from "./mockRoute";

const secondsBetweenSamples = 2;
const pauseSamples = 5;
const halfwayIndex = Math.floor(mockRoute.length / 2);

export class MockGpsSource {
  private pointIndex = 0;
  private pauseSamplesRemaining = pauseSamples;

  getNextPosition() {
    const previousPosition = mockRoute[this.pointIndex];

    if (this.pauseSamplesRemaining > 0) {
      this.pauseSamplesRemaining--;
    } else if (this.pointIndex < mockRoute.length - 1) {
      this.pointIndex++;

      if (this.pointIndex === halfwayIndex) {
        this.pauseSamplesRemaining = pauseSamples;
      }
    }

    const position = mockRoute[this.pointIndex];

    return {
      ...position,
      accuracyMeters: 5,
      speedMetersPerSecond:
        calculateDistanceMeters(previousPosition, position) / secondsBetweenSamples,
    };
  }
}
