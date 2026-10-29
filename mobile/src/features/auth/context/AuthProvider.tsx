import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LoginRequest, LoginResponse } from "../dtos/auth";
import { login } from "../api/authApi";
import {
  clearSession,
  saveSession,
  getSession,
} from "../storage/sessionStorage";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginResponse | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedSession = await getSession();

        setSession(storedSession);
      } catch {
        console.warn("Den gemte session kunne ikke indlæses.");
        setSession(null);
      } finally {
        setIsInitializing(false);
      }
    }

    restoreSession();
  }, []);

  async function signIn(request: LoginRequest): Promise<void> {
    const response = await login(request);

    await saveSession(response);

    setSession(response);
  }

  async function signOut(): Promise<void> {
    await clearSession();

    setSession(null);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isInitializing,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
