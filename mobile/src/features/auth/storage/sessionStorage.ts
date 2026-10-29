import * as SecureStore from "expo-secure-store";
import type { LoginResponse } from "../dtos/auth";

const SESSION_KEY = "auth.session";

export async function saveSession(session: LoginResponse): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<LoginResponse | null> {
  const storedSession = await SecureStore.getItemAsync(SESSION_KEY);

  if (storedSession === null) {
    return null;
  }

  const session = JSON.parse(storedSession) as LoginResponse;
  const expiresAt = Date.parse(session.expiresAtUtc);

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    await clearSession();

    return null;
  }

  return session;
}
export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}