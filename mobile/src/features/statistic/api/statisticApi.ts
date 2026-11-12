import { getAuthenticatedData } from "../../../api/getAuthenticatedData";
import type { ActivityStatisticsResponse } from "../dtos/statistic";

export function getActivityStatistics(
  accessToken: string,
): Promise<ActivityStatisticsResponse> {
  return getAuthenticatedData<ActivityStatisticsResponse>(
    "/api/activities/statistics",
    accessToken,
    "Statistikken kunne ikke hentes",
  );
}
