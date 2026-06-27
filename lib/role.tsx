// Auth moved to `@/lib/auth` (real JWT-backed session). This file re-exports the
// role-facing pieces so existing `@/lib/role` imports keep working.
export { useRole, ROLE_HOME, AuthProvider, useAuth } from "@/lib/auth";
