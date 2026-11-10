import { Stack, useLocalSearchParams } from "expo-router";
import { Text } from "react-native-paper";
import ActivityDetailsScreen from "../features/activity/screens/ActivityDetailsScreen";

export default function ActivityDetailsRoute() {
  const { activityId } = useLocalSearchParams<{ activityId?: string }>();

  return (
    <>
      <Stack.Screen options={{ title: "Aktivitetsdetaljer" }} />
      {typeof activityId === "string" && activityId.length > 0 ? (
        <ActivityDetailsScreen activityId={activityId} />
      ) : (
        <Text>Aktivitetens id mangler.</Text>
      )}
    </>
  );
}
