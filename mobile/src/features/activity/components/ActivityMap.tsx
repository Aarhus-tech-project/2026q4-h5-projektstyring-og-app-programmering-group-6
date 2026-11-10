import MapView, { Polyline } from "react-native-maps";
import type { LatLng } from "react-native-maps";
import type { NewGpsPoint } from "../models/gpsPoint";
import { calculateDirectionDegrees } from "../calculations/direction";
import ActivityPositionMarker from "./ActivityPositionMarker";

type ActivityMapProps = {
  initialPosition: LatLng;
  points: readonly NewGpsPoint[];
};

export default function ActivityMap({
  initialPosition,
  points,
}: ActivityMapProps) {
  const currentPosition = points[points.length - 1] ?? initialPosition;
  let directionDegrees = 0;

  for (let index = points.length - 2; index >= 0; index--) {
    const point = points[index];

    if (
      point.latitude !== currentPosition.latitude ||
      point.longitude !== currentPosition.longitude
    ) {
      directionDegrees = calculateDirectionDegrees(point, currentPosition);
      break;
    }
  }
  return (
    <MapView
      style={{ flex: 1 }}
      userInterfaceStyle="dark"
      camera={{
        center: currentPosition,
        heading: directionDegrees,
        pitch: 0,
        zoom: 18,
      }}
    >
      {points.length >= 2 && (
        <Polyline
          coordinates={[...points]}
          strokeColor="#2196F3"
          strokeWidth={4}
        />
      )}
      <ActivityPositionMarker coordinate={currentPosition} />
    </MapView>
  );
}
