import { API_BASE_URL } from "../../../config/api";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../dtos/auth";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const controller = new AbortController();
  

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10_000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      const problem = await response.json().catch(() => null);

      throw new Error(
        problem?.detail ?? `Login mislykkedes (${response.status}).`
      );
    }

    const result: LoginResponse = await response.json();

    return result;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Serveren svarede ikke.");
    }

    if (error instanceof TypeError) {
      throw new Error("Der kunne ikke oprettes forbindelse til serveren.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function register(
  request: RegisterRequest
): Promise<void> {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10_000);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

if (!response.ok) {
  const problem = await response.json().catch(() => null);

  const validationMessage = Object.values(problem?.errors ?? {})
    .flat()
    .join("\n");

  throw new Error(
    problem?.detail ||
      validationMessage ||
      `Oprettelse mislykkedes (${response.status}).`
  );
}
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error("Serveren svarede ikke inden for 10 sekunder.");
    }

    if (error instanceof TypeError) {
      throw new Error("Der kunne ikke oprettes forbindelse til serveren.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}