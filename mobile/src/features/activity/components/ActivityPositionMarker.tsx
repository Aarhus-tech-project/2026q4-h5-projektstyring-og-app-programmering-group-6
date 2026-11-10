import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Marker } from "react-native-maps";
import type { LatLng } from "react-native-maps";

type ActivityPositionMarkerProps = {
  coordinate: LatLng;
};

export default function ActivityPositionMarker({
  coordinate,
}: ActivityPositionMarkerProps) {
  return (
    <Marker
      coordinate={coordinate}
      title="Din position"
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={{ width: 40, height: 40 }}>
        <MaterialCommunityIcons
          name="navigation"
          size={40}
          color="#2196F3"
          style={{ position: "absolute" }}
        />
        <MaterialCommunityIcons
          name="navigation-outline"
          size={40}
          color="#FFFFFF"
          style={{ position: "absolute" }}
        />
      </View>
    </Marker>
  );
}
