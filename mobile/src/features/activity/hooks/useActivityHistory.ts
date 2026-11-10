import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getActivities } from "../api/activityApi";
import type { ActivitySummaryResponse } from "../dtos/activity";

export function useActivityHistory(accessToken: string | null) {
  const [activities, setActivities] = useState<ActivitySummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isCurrent = true;
      const token = accessToken;

      setLoading(true);
      setError(null);

      if (token === null) {
        setActivities([]);
        setError("Du skal være logget ind for at se dine aktiviteter.");
        setLoading(false);
        return;
      }

      async function loadActivities(token: string) {
        try {
          const result = await getActivities(token);

          if (isCurrent) {
            setActivities(result);
          }
        } catch (error) {
          if (isCurrent) {
            setError(
              error instanceof Error
                ? error.message
                : "Aktiviteterne kunne ikke hentes."
            );
          }
        } finally {
          if (isCurrent) {
            setLoading(false);
          }
        }
      }

      void loadActivities(token);

      return () => {
        isCurrent = false;
      };
    }, [accessToken])
  );

  return { activities, loading, error };
}