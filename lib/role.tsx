import { createContext, useContext, useState } from "react";
import type { Role } from "@/data/mock";

type RoleState = {
  role: Role;
  setRole: (r: Role) => void;
};

const RoleContext = createContext<RoleState | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("tech");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}

// Where each role lands after login.
export const ROLE_HOME: Record<Role, string> = {
  tech: "/(tech)/jobs",
  manager: "/(manager)/dashboard",
  admin: "/(admin)/dashboard",
};
