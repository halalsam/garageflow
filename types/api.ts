// The API contract — the single source of truth for the shapes the GarageFlow
// backend serves and the app consumes. The NestJS serializers
// (../garageflow-backend/src/common/serializers.ts) mirror these exactly; if a
// field is wrong, the fix is in the serializer, not the screen.
//
// Money is whole rupees (numbers) — format with `inr()`. Dates are pre-rendered
// Indian display strings ("26 Jun 2026", "8:30 AM", "12m ago"); raw ISO is
// emitted alongside where a period/ordering needs it (`issuedAt`, `at`).

import type { Tone } from "@/lib/theme";
import type { IconName } from "@/components/Icon";

export type Role = "tech" | "manager" | "admin";

export type Person = { name: string; initials: string; color: string };

export type Job = {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: string; // HATCHBACK / SUV / SEDAN
  bay?: string;
  customer: Person;
  tech?: Person;
  status: string; // human label, e.g. "IN PROGRESS"
  tone: Tone;
  priority?: "HIGH" | "NORMAL";
  complaint?: string;
  progress?: number;
  amount?: number;
};

// Job detail adds the timeline inline (GET /jobs/:id).
export type JobDetail = Job & { timeline: TimelineItem[] };

export type TimelineItem =
  | { kind: "system"; text: string; tone: "purple" | "green"; icon?: "shield-check" | "check-circle" }
  | { kind: "text"; by: Person; text: string; time: string }
  | { kind: "photo"; by: Person; tag?: string; time: string; uri?: string }
  | { kind: "voice"; by: Person; dur: string; time: string; uri?: string }
  | { kind: "part"; by: Person; name: string; qty: number; price: number; time: string };

export type CatalogueItem = {
  id: string;
  name: string;
  sku: string;
  stock?: number;
  price: number;
  kind: "part" | "service";
};

// ── Vehicle / Customer (job creation, plate + customer search) ───────────────

export type VehicleType = "HATCHBACK" | "SEDAN" | "SUV" | "MUV" | "OTHER";

export type Vehicle = {
  id: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
};

// GET /vehicles?plate= returns each vehicle with its owner inlined.
export type VehicleHit = Vehicle & { customer: Person };

// GET /customers?query= returns Paginated<Customer>; each carries its vehicles.
export type Customer = Person & {
  id: string;
  phone?: string;
  vehicles: Vehicle[];
};

export type TeamMember = Person & {
  phone?: string;
  role: Role;
  roleLabel: string;
  roleIcon: IconName;
  active?: boolean;
  inactive?: boolean;
};

export type ApprovalLine = { label: string; note: string; amount: number };

export type Approval = {
  id: string; // job id
  plate: string;
  car: string; // "Tata Nexon"
  customer: string; // "Rakesh K."
  submittedBy: Person;
  ago: string; // "12m ago"
  lines: ApprovalLine[];
  subtotal: number;
  gst: number;
  total: number;
};

export type PayMethod = "Cash" | "UPI" | "Card";
export type InvoiceStatus = "PAID" | "PARTIAL" | "UNPAID";

export type Payment = {
  id: string;
  invoiceId: string;
  amount: number;
  method: PayMethod;
  at: string; // ISO timestamp
};

export type Invoice = {
  id: string; // UUID; also the /invoice/[id] route param
  number: string; // INV-2048
  date: string; // human label, e.g. "26 Jun 2026"
  issuedAt: string; // ISO date, used for period reports (revenue, GST)
  jobId?: string;
  customer: string;
  car: string;
  plate: string;
  lines: ApprovalLine[];
  subtotal: number;
  gst: number;
  total: number;
  // Derived by the API from payments (never stored). Present on list + detail.
  paid?: number;
  balance?: number;
  status?: InvoiceStatus;
};

export type ExpenseCategory = "Parts" | "Salaries" | "Rent" | "Utilities" | "Misc";

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  at: string; // ISO date
};

// ── Finance report responses (all derived server-side) ──────────────────────

export type MethodTotal = { method: PayMethod; amount: number; count: number };

export type FinanceSummary = {
  outstanding: number;
  collectedToday: number;
  revenueThisWeek: number;
};

export type Collections = { methods: MethodTotal[]; total: number; count: number };

export type GstReport = { taxable: number; gst: number; cgst: number; sgst: number; count: number };

export type ProfitReport = { revenue: number; expenses: number; profit: number };

// A party in the ledgers list. `id` (customer UUID) routes to the statement.
export type Party = { id: string; name: string; closing: number; invoices: number };

export type LedgerEntry = {
  at: string; // ISO, for ordering
  date: string; // display label
  particulars: string;
  ref: string; // invoice number
  debit: number; // invoice raised
  credit: number; // payment received
  balance: number; // running balance owed
};

export type LedgerStatement = {
  customer: string;
  billed: number;
  closing: number;
  entries: LedgerEntry[];
};

// ── Dashboard (role-aware) ──────────────────────────────────────────────────

// A recent-activity row (derived from job timeline entries).
export type ActivityItem = {
  id: string;
  text: string;
  plate?: string;
  by?: string;
  time?: string;
  tone?: "purple" | "green";
  icon?: "shield-check" | "check-circle";
};

// GET /dashboard. The finance fields (outstanding/revenueThisWeek/collectedToday)
// are present for manager+ and omitted for tech (RBAC), hence optional.
export type Dashboard = {
  jobsInProgress: number;
  awaitingApproval: number;
  dueForDelivery: number;
  activeJobs: Job[];
  activity: ActivityItem[];
  outstanding?: number;
  revenueThisWeek?: number;
  collectedToday?: number;
};

// ── Auth ────────────────────────────────────────────────────────────────────

export type AuthUser = Person & {
  id: string;
  email: string;
  phone?: string;
  active?: boolean;
  role: Role;
  roleLabel: string;
  roleIcon: IconName;
};

export type AuthTokens = { accessToken: string; refreshToken: string };

export type AuthResponse = { user: AuthUser; tokens: AuthTokens };

// ── Transport ───────────────────────────────────────────────────────────────

// The shape the backend's AllExceptionsFilter emits on error.
export type ApiError = {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
};

export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
