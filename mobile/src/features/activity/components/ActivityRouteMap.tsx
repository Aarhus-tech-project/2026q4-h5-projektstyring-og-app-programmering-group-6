import MapView, { Marker, Polyline } from "react-native-maps";
import type { LatLng } from "react-native-maps";
import { Text } from "react-native-paper";

type ActivityRouteMapProps = {
  coordinates: LatLng[];
};

export default function ActivityRouteMap({ coordinates }: ActivityRouteMapProps) {
  const firstPoint = coordinates[0];

  if (!firstPoint) {
    return <Text>Der er ingen GPS-punkter for denne aktivitet.</Text>;
  }

  let minLatitude = firstPoint.latitude;
  let maxLatitude = firstPoint.latitude;
  let minLongitude = firstPoint.longitude;
  let maxLongitude = firstPoint.longitude;

  for (const point of coordinates) {
    minLatitude = Math.min(minLatitude, point.latitude);
    maxLatitude = Math.max(maxLatitude, point.latitude);
    minLongitude = Math.min(minLongitude, point.longitude);
    maxLongitude = Math.max(maxLongitude, point.longitude);
  }

  return (
    <MapView
      style={{ flex: 1 }}
      userInterfaceStyle="dark"
      initialRegion={{
        latitude: (minLatitude + maxLatitude) / 2,
        longitude: (minLongitude + maxLongitude) / 2,
        latitudeDelta: Math.max((maxLatitude - minLatitude) * 1.25, 0.0005),
        longitudeDelta: Math.max((maxLongitude - minLongitude) * 1.25, 0.0005),
      }}
    >
      {coordinates.length === 1 ? (
        <Marker coordinate={firstPoint} />
      ) : (
        <Polyline coordinates={coordinates} strokeColor="#2196F3" strokeWidth={4} />
      )}
    </MapView>
  );
}
