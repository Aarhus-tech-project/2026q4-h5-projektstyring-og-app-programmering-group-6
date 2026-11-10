import { View } from "react-native";
import { Card, Text } from "react-native-paper";
import type { ActivitySummaryResponse } from "../dtos/activity";
import { formatPace } from "../formatting/formatPace";

type ActivitySummaryContentProps = {
  activity: ActivitySummaryResponse;
};

type ActivitySummaryCardProps = ActivitySummaryContentProps & {
  onPress?: () => void;
};

export function ActivitySummaryContent({
  activity,
}: ActivitySummaryContentProps) {
  const startedAt = new Date(activity.startedAt).toLocaleString("da-DK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const distanceKilometers = Number(activity.distanceMeters) / 1000;

  const durationSeconds = Number(activity.durationSeconds);
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  const averagePace =
    activity.averagePaceSeconds === null
      ? null
      : Number(activity.averagePaceSeconds);

  return (
    <View style={{ gap: 8 }}>
      <Text variant="titleMedium">{startedAt}</Text>

      <Text>Distance: {distanceKilometers.toFixed(2)} km</Text>

      <Text>
        Varighed: {minutes} min {seconds} sek
      </Text>

      <Text>Gennemsnitlig pace: {formatPace(averagePace)} min/km</Text>
    </View>
  );
}

export default function ActivitySummaryCard({
  activity,
  onPress,
}: ActivitySummaryCardProps) {
  return (
    <Card mode="contained" style={{ borderRadius: 16 }} onPress={onPress}>
      <Card.Content>
        <ActivitySummaryContent activity={activity} />
      </Card.Content>
    </Card>
  );
}
