import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, Role } from "@/types/api";
import * as endpoints from "@/lib/api/endpoints";
import { queryClient } from "@/lib/api/queryClient";
import { clearTokens, loadTokens, setTokens } from "@/lib/api/tokens";

type AuthState = {
  user: AuthUser | null;
  role: Role; // convenience; defaults to "tech" before login
  // `true` while restoring a persisted session on cold start.
  restoring: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [restoring, setRestoring] = useState(true);

  // On cold start, if a refresh token is on disk, restore the session via /me.
  useEffect(() => {
    let active = true;
    (async () => {
      const tokens = await loadTokens();
      if (tokens) {
        try {
          const me = await endpoints.fetchMe();
          if (active) setUser(me);
        } catch {
          await clearTokens(); // refresh failed / revoked — start clean
        }
      }
      if (active) setRestoring(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: u, tokens } = await endpoints.login(email, password);
    await setTokens(tokens);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    try {
      await endpoints.logout();
    } catch {
      // best-effort server-side revoke; clear locally regardless
    }
    await clearTokens();
    queryClient.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, role: user?.role ?? "tech", restoring, login, logout }),
    [user, restoring, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Back-compat shim: screens that only need the current role keep importing
// `useRole`. Role now comes from the authenticated user.
export function useRole() {
  const { role } = useAuth();
  return { role };
}

// Where each role lands after login.
export const ROLE_HOME: Record<Role, string> = {
  tech: "/(tech)/jobs",
  manager: "/(manager)/dashboard",
  admin: "/(admin)/dashboard",
};
