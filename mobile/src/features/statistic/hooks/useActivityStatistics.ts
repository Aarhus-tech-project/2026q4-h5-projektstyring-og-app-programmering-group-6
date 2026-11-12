import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getActivityStatistics } from "../api/statisticApi";
import type { ActivityStatisticsResponse } from "../dtos/statistic";

export function useActivityStatistics(accessToken: string | null) {
  const [statistics, setStatistics] =
    useState<ActivityStatisticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      setStatistics(null);
      setError(null);

      if (accessToken === null) {
        setError("Du skal være logget ind for at se din statistik.");
        return;
      }

      let isCurrent = true;

      async function loadStatistics(token: string) {
        try {
          const result = await getActivityStatistics(token);
          if (isCurrent) setStatistics(result);
        } catch (error) {
          if (isCurrent) {
            setError(
              error instanceof Error
                ? error.message
                : "Statistikken kunne ikke hentes.",
            );
          }
        }
      }

      void loadStatistics(accessToken);

      return () => {
        isCurrent = false;
      };
    }, [accessToken]),
  );

  return { statistics, error };
}
