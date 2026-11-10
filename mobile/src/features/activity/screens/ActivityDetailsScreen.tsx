import { useEffect, useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useAuth } from "../../auth/context/useAuth";
import { getActivityDetails } from "../api/activityApi";
import ActivityRouteMap from "../components/ActivityRouteMap";
import { ActivitySummaryContent } from "../components/ActivitySummaryCard";
import type { ActivityDetailsResponse } from "../dtos/activity";

type Props = {
  activityId: string;
};

export default function ActivityDetailsScreen({ activityId }: Props) {
  const { session } = useAuth();
  const accessToken = session?.accessToken;

  const [activityDetails, setActivityDetails] =
    useState<ActivityDetailsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    setActivityDetails(null);
    setError(null);

    if (!accessToken) {
      setError("Log ind for at se aktiviteten.");
      return;
    }

    getActivityDetails(activityId, accessToken)
      .then((details) => {
        if (isCurrent) setActivityDetails(details);
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setError(
            error instanceof Error
              ? error.message
              : "Aktiviteten kunne ikke hentes.",
          );
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [activityId, accessToken]);

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      {error !== null ? (
        <Text>{error}</Text>
      ) : activityDetails === null ? (
        <ActivityIndicator />
      ) : (
        <>
          <ActivitySummaryContent activity={activityDetails} />
          <ActivityRouteMap
            coordinates={activityDetails.gpsPoints.map((point) => ({
              latitude: Number(point.latitude),
              longitude: Number(point.longitude),
            }))}
          />
        </>
      )}
    </View>
  );
}
