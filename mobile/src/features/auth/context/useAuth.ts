import { useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth skal bruges inden i AuthProvider.");
  }

  let userId: number | null = null;

  if (context.session !== null) {
    try {
      const token = jwtDecode(context.session.accessToken);
      const id = Number(token.sub);

      if (Number.isSafeInteger(id) && id > 0) {
        userId = id;
      }
    } catch {
      userId = null;
    }
  }

  return {
    ...context,
    userId,
  };
}