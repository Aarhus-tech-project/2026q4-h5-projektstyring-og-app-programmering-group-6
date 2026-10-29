import { createContext } from "react";
import type { LoginRequest, LoginResponse } from "../dtos/auth";

export type AuthContextValue = {
  session: LoginResponse | null;
  isInitializing: boolean;
  signIn: (request: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);