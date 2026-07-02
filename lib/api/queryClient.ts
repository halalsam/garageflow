import { QueryClient } from "@tanstack/react-query";
import { AuthExpiredError } from "./client";

// A single QueryClient for the app. Defaults tuned for a mobile workshop app:
// data stays fresh for a minute, one retry on transient failures, but never
// retry an expired-session error (the auth context handles that by logging out).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        if (error instanceof AuthExpiredError) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Central query-key factory — every hook reads/invalidates through these so a
// mutation can target exactly the right caches.
export const qk = {
  me: ["me"] as const,
  jobs: (params?: Record<string, unknown>) => ["jobs", params ?? {}] as const,
  job: (id: string) => ["job", id] as const,
  jobEvents: (id: string) => ["jobEvents", id] as const,
  approvals: ["approvals"] as const,
  approval: (id: string) => ["approval", id] as const,
  invoices: (status?: string) => ["invoices", status ?? "all"] as const,
  invoice: (id: string) => ["invoice", id] as const,
  expenses: (month?: string) => ["expenses", month ?? "current"] as const,
  catalogue: (kind?: string) => ["catalogue", kind ?? "all"] as const,
  vehicles: (plate?: string) => ["vehicles", plate ?? ""] as const,
  customers: (query?: string) => ["customers", query ?? ""] as const,
  team: ["team"] as const,
  notifications: ["notifications"] as const,
  dashboard: ["dashboard"] as const,
  finance: {
    summary: ["finance", "summary"] as const,
    collections: (day?: string) => ["finance", "collections", day ?? "today"] as const,
    receivables: ["finance", "receivables"] as const,
    gst: (month?: string) => ["finance", "gst", month ?? "current"] as const,
  },
};
