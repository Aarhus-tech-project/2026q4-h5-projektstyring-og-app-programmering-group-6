import { API_BASE_URL } from "../config/api";

export async function getAuthenticatedData<T>(
  path: string,
  accessToken: string,
  errorMessage: string
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    }).catch(() => {
      throw new Error("Der opstod en fejl i forbindelsen til serveren.");
    });

    if (response.status === 401) {
      throw new Error("Din session er udløbet. Log ind igen.");
    }

    if (response.status !== 200) {
      const problem = await response.json().catch(() => null);
      throw new Error(problem?.detail || `${errorMessage} (${response.status}).`);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Serveren svarede ikke inden for 10 sekunder.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}