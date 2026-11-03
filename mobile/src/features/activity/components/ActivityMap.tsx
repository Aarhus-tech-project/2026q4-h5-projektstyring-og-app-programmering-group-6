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
  const previousPosition = points[points.length - 2];

  const directionDegrees = previousPosition
    ? calculateDirectionDegrees(previousPosition, currentPosition)
    : 0;

  return (
    <MapView
      style={{ flex: 1 }}
      userInterfaceStyle="dark"
      region={{
        latitude: currentPosition.latitude,
        longitude: currentPosition.longitude,
        latitudeDelta: 0.0005,
        longitudeDelta: 0.0005,
      }}
    >
      {points.length >= 2 && (
        <Polyline
          coordinates={[...points]}
          strokeColor="#2196F3"
          strokeWidth={4}
        />
      )}
      <ActivityPositionMarker
        coordinate={currentPosition}
        directionDegrees={directionDegrees}
      />
    </MapView>
  );
}
