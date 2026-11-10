import { mockRoute } from "./mockRoute";

export class MockGpsSource {
  private pointIndex = 0;

  getNextPosition() {
    const position = mockRoute[this.pointIndex];

    if (position === undefined) {
      throw new Error("Mock-ruten indeholder ingen gyldig position.");
    }

this.pointIndex = Math.min(this.pointIndex + 1, mockRoute.length - 1);
    return {
      ...position,
      accuracyMeters: 5,
    };
  }
}