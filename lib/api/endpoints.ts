// Thin typed wrappers over each backend route. Hooks call these; mutations and
// imperative flows (login) can too. Keeping the URLs + response types in one
// place makes the contract easy to audit against the backend.
import type {
  Approval,
  AuthResponse,
  AuthUser,
  CatalogueItem,
  Collections,
  Customer,
  Dashboard,
  Expense,
  ExpenseCategory,
  FinanceSummary,
  GstReport,
  Invoice,
  InvoiceStatus,
  Job,
  JobDetail,
  LedgerStatement,
  Paginated,
  Party,
  PayMethod,
  Payment,
  ProfitReport,
  TeamMember,
  TimelineItem,
  VehicleHit,
} from "@/types/api";
import { api, request } from "./client";

// ── Auth ──
export const login = (email: string, password: string) =>
  request<AuthResponse>("/auth/login", { method: "POST", body: { email, password }, auth: false });
export const fetchMe = () => api.get<AuthUser>("/auth/me");
export const logout = () => api.post<void>("/auth/logout");

// ── Jobs ──
export type JobsQuery = { status?: string; mine?: boolean };
export const fetchJobs = (q?: JobsQuery, signal?: AbortSignal) =>
  api.get<Job[]>("/jobs", q as Record<string, string | boolean | undefined>, signal);
export const fetchJob = (id: string, signal?: AbortSignal) => api.get<JobDetail>(`/jobs/${id}`, undefined, signal);
export const createJob = (body: Record<string, unknown>) => api.post<Job>("/jobs", body);
export const updateJob = (id: string, body: Record<string, unknown>) =>
  api.patch<{ message: string }>(`/jobs/${id}`, body);
export const addParts = (id: string, items: { catalogueItemId: string; qty: number }[]) =>
  api.post<TimelineItem[]>(`/jobs/${id}/parts`, { items });
export const submitEstimate = (id: string, lines: { label: string; note: string; amount: number }[], gstRate?: number) =>
  api.post<Approval>(`/jobs/${id}/estimate`, { lines, gstRate });
export const postTimeline = (id: string, form: FormData) => api.postForm<TimelineItem>(`/jobs/${id}/timeline`, form);
export const markJobRead = (id: string) => api.post<{ message: string }>(`/jobs/${id}/read`, {});
export const uploadCompletionPhoto = (id: string, form: FormData) =>
  api.postForm<JobDetail>(`/jobs/${id}/completion-photos`, form);

// ── Catalogue ──
export const fetchCatalogue = (kind?: "part" | "service", signal?: AbortSignal) =>
  api.get<CatalogueItem[]>("/catalogue", { kind }, signal);

// ── Vehicles & customers (job creation: plate search + customer picker) ──
export const fetchVehicles = (plate?: string, signal?: AbortSignal) =>
  api.get<VehicleHit[]>("/vehicles", { plate }, signal);
export const fetchCustomers = (query?: string, signal?: AbortSignal) =>
  api.get<Paginated<Customer>>("/customers", { query }, signal);

// ── Approvals ──
export const fetchApprovals = (signal?: AbortSignal) => api.get<Approval[]>("/approvals", undefined, signal);
export const fetchApproval = (id: string, signal?: AbortSignal) => api.get<Approval>(`/approvals/${id}`, undefined, signal);
export const decideApproval = (id: string, decision: "approve" | "decline") =>
  api.post<{ message: string }>(`/approvals/${id}/decision`, { decision });

// ── Invoices & payments ──
export const fetchInvoices = (status?: InvoiceStatus | "all", signal?: AbortSignal) =>
  api.get<Invoice[]>("/invoices", status && status !== "all" ? { status: status.toLowerCase() } : undefined, signal);
export const fetchInvoice = (id: string, signal?: AbortSignal) => api.get<Invoice>(`/invoices/${id}`, undefined, signal);
export const recordPayment = (id: string, amount: number, method: PayMethod) =>
  api.post<Payment>(`/invoices/${id}/payments`, { amount, method });

// ── Expenses ──
export const fetchExpenses = (month?: string, signal?: AbortSignal) =>
  api.get<Expense[]>("/expenses", { month }, signal);
export const addExpense = (body: { title: string; category: ExpenseCategory; amount: number; spentAt?: string }) =>
  api.post<Expense>("/expenses", body);

// ── Team ──
export const fetchTeam = (signal?: AbortSignal) => api.get<TeamMember[]>("/team", undefined, signal);

// ── Dashboard ──
export const fetchDashboard = (signal?: AbortSignal) => api.get<Dashboard>("/dashboard", undefined, signal);

// ── Finance reports ──
export const fetchFinanceSummary = (signal?: AbortSignal) => api.get<FinanceSummary>("/finance/summary", undefined, signal);
export const fetchCollections = (day?: string, signal?: AbortSignal) =>
  api.get<Collections>("/finance/collections", { day }, signal);
export const fetchReceivables = (signal?: AbortSignal) => api.get<Invoice[]>("/finance/receivables", undefined, signal);
export const fetchGst = (month?: string, signal?: AbortSignal) => api.get<GstReport>("/finance/gst", { month }, signal);
export const fetchProfit = (month?: string, signal?: AbortSignal) => api.get<ProfitReport>("/finance/profit", { month }, signal);
export const fetchLedgers = (signal?: AbortSignal) => api.get<Party[]>("/finance/ledgers", undefined, signal);
export const fetchLedger = (customerId: string, signal?: AbortSignal) =>
  api.get<LedgerStatement>(`/finance/ledgers/${customerId}`, undefined, signal);
