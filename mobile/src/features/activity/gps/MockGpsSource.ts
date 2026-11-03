import { mockRoute } from "./mockRoute";

export class MockGpsSource {
  private pointIndex = 0;

  getNextPosition() {
    const position = mockRoute[this.pointIndex];

    if (position === undefined) {
      throw new Error("Mock-ruten indeholder ingen gyldig position.");
    }

    this.pointIndex = (this.pointIndex + 1) % mockRoute.length;

    return {
      ...position,
      accuracyMeters: 5,
    };
  }
}