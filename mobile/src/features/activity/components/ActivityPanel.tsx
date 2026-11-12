import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import type { Activity } from "../models/activity";
import { formatPace } from "../formatting/formatPace";

type ActivityPanelProps = {
  activity: Activity | null;
  elapsedSeconds: number;
  distanceMeters: number;
  currentPace: number | null;
  loading: boolean;
  onStart: () => Promise<void>;
  onStartMock: () => Promise<void>;
  onStop: () => Promise<void>;
};

export default function ActivityPanel({
  activity,
  elapsedSeconds,
  distanceMeters,
  currentPace,
  loading,
  onStart,
  onStartMock,
  onStop,
}: ActivityPanelProps) {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      {activity !== null && (
        <>
          <Text>
            Varighed:{" "}
            {elapsedSeconds < 60
              ? `${elapsedSeconds} sek`
              : `${Math.floor(elapsedSeconds / 60)} min ${elapsedSeconds % 60} sek`}
          </Text>
          <Text>Distance: {(distanceMeters / 1000).toFixed(2)} km</Text>

          {activity.status === "active" && (
            <Text>Aktuel pace: {formatPace(currentPace)} min/km</Text>
          )}

          {activity.status === "completed" && (
            <Text>Aktiviteten er afsluttet.</Text>
          )}
        </>
      )}

      {activity === null && (
        <>
          <Button
            mode="contained"
            onPress={onStart}
            loading={loading}
            disabled={loading}
          >
            Start aktivitet
          </Button>
          <Button mode="outlined" onPress={onStartMock} disabled={loading}>
            Start mock aktivitet
          </Button>
        </>
      )}

      {activity?.status === "active" && (
        <Button
          mode="contained"
          onPress={onStop}
          loading={loading}
          disabled={loading}
        >
          Afslut aktivitet
        </Button>
      )}
    </View>
  );
}
