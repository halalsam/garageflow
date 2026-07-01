// Read hooks — one per resource the screens consume. Each returns the same
// shape the old `data/mock.ts` helpers did, so the screens that pass the data
// down to presentational components don't change.
import { useQuery } from "@tanstack/react-query";
import * as e from "@/lib/api/endpoints";
import { qk } from "@/lib/api/queryClient";
import type { InvoiceStatus } from "@/types/api";

export function useJobs(params?: e.JobsQuery) {
  return useQuery({
    queryKey: qk.jobs(params),
    queryFn: ({ signal }) => e.fetchJobs(params, signal),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: qk.job(id),
    queryFn: ({ signal }) => e.fetchJob(id, signal),
    enabled: !!id,
  });
}

export function useApprovals() {
  return useQuery({ queryKey: qk.approvals, queryFn: ({ signal }) => e.fetchApprovals(signal) });
}

export function useApproval(id: string) {
  return useQuery({
    queryKey: qk.approval(id),
    queryFn: ({ signal }) => e.fetchApproval(id, signal),
    enabled: !!id,
  });
}

export function useInvoices(status?: InvoiceStatus | "all") {
  return useQuery({
    queryKey: qk.invoices(status),
    queryFn: ({ signal }) => e.fetchInvoices(status, signal),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: qk.invoice(id),
    queryFn: ({ signal }) => e.fetchInvoice(id, signal),
    enabled: !!id,
  });
}

export function useExpenses(month?: string) {
  return useQuery({
    queryKey: qk.expenses(month),
    queryFn: ({ signal }) => e.fetchExpenses(month, signal),
  });
}

export function useCatalogue(kind?: "part" | "service") {
  return useQuery({
    queryKey: qk.catalogue(kind),
    queryFn: ({ signal }) => e.fetchCatalogue(kind, signal),
  });
}

// Plate search for the New Job card. Only fires once the user has typed enough
// to be a meaningful search; results carry the vehicle's owner inline.
export function useVehicleSearch(plate: string) {
  const term = plate.trim();
  return useQuery({
    queryKey: qk.vehicles(term),
    queryFn: ({ signal }) => e.fetchVehicles(term, signal),
    enabled: term.length >= 2,
  });
}

// Customer search (name/phone) for the New Job card. Returns Paginated<Customer>.
export function useCustomerSearch(query: string) {
  const term = query.trim();
  return useQuery({
    queryKey: qk.customers(term),
    queryFn: ({ signal }) => e.fetchCustomers(term, signal),
    enabled: term.length >= 2,
  });
}

export function useTeam() {
  return useQuery({ queryKey: qk.team, queryFn: ({ signal }) => e.fetchTeam(signal) });
}

export function useDashboard() {
  return useQuery({ queryKey: qk.dashboard, queryFn: ({ signal }) => e.fetchDashboard(signal) });
}

// ── Finance reports ──
export function useFinanceSummary() {
  return useQuery({ queryKey: qk.finance.summary, queryFn: ({ signal }) => e.fetchFinanceSummary(signal) });
}

export function useCollections(day?: string) {
  return useQuery({
    queryKey: qk.finance.collections(day),
    queryFn: ({ signal }) => e.fetchCollections(day, signal),
  });
}

export function useReceivables() {
  return useQuery({ queryKey: qk.finance.receivables, queryFn: ({ signal }) => e.fetchReceivables(signal) });
}

export function useGstReport(month?: string) {
  return useQuery({
    queryKey: qk.finance.gst(month),
    queryFn: ({ signal }) => e.fetchGst(month, signal),
  });
}

