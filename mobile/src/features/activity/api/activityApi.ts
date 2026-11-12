import { getAuthenticatedData } from "../../../api/getAuthenticatedData";
import { API_BASE_URL } from "../../../config/api";
import type { CreateActivityRequest, ActivitySummaryResponse, ActivityDetailsResponse } from "../dtos/activity";

export async function uploadActivity(
  request: CreateActivityRequest,
  accessToken: string
): Promise<void> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10_000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/activities`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    }).catch(() => {
      throw new Error("Der opstod en fejl i forbindelsen til serveren.");
    });

    if (response.status === 401) {
      throw new Error("Din session er udløbet. Log ind igen.");
    }

    if (response.status !== 201) {
      const problem = await response.json().catch(() => null);

      const validationMessage = Object.values(problem?.errors ?? {})
        .flat()
        .join("\n");

      throw new Error(
        problem?.detail ||
          validationMessage ||
          `Aktiviteten kunne ikke gemmes (${response.status}).`
      );
    }
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Serveren svarede ikke inden for 10 sekunder.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  
}

export function getActivities(
  accessToken: string
): Promise<ActivitySummaryResponse[]> {
  return getAuthenticatedData<ActivitySummaryResponse[]>(
    "/api/activities",
    accessToken,
    "Aktiviteterne kunne ikke hentes"
  );
}

export function getActivityDetails(
  activityId: string,
  accessToken: string
): Promise<ActivityDetailsResponse> {
  return getAuthenticatedData<ActivityDetailsResponse>(
    `/api/activities/${encodeURIComponent(activityId)}`,
    accessToken,
    "Aktiviteten kunne ikke hentes"
  );
}
