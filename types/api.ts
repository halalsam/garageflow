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

// `id` is the user's stable id; present on entries authored by a real user
// (e.g. timeline messages) so clients can reliably detect "own" items.
export type Person = { id?: string; name: string; initials: string; color: string };

export type Job = {
  id: string;
  vehicleId: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  type: string; // HATCHBACK / SUV / SEDAN
  photoUrl?: string; // the vehicle's photo, when one was captured
  bay?: string;
  customer: Person;
  tech?: Person;
  status: string; // human label, e.g. "IN PROGRESS"
  tone: Tone;
  priority?: "HIGH" | "NORMAL";
  complaint?: string;
  progress?: number;
  amount?: number;
  // Present once an estimate is approved; routes to /invoice/[id].
  invoiceId?: string;
};

// Job detail adds the timeline inline (GET /jobs/:id).
// A per-user read marker: who has read the chat and up to when (ISO).
export type JobRead = { by: Person; atISO: string };

// One of the four mandatory walk-around photos captured at completion / delivery.
export type CompletionSide = "front" | "back" | "left" | "right";
export type CompletionPhoto = { side: CompletionSide; uri: string };
export const COMPLETION_SIDES: CompletionSide[] = ["front", "back", "left", "right"];

// The timeline is no longer inlined on the job — it's the paginated JobEvent
// feed (GET /jobs/:id/events). See `JobEvent` below.
export type JobDetail = Job & {
  reads?: JobRead[];
  completionPhotos?: CompletionPhoto[];
  // Hand-off (delivery) walk-around photos + the note captured at delivery.
  deliveryPhotos?: CompletionPhoto[];
  deliveryNote?: string;
  deliveryNoteAudioUrl?: string;
  // Customer phone (detail-only) powers the call / WhatsApp actions.
  customerPhone?: string;
};

// ── Job-card events (the realtime timeline) ─────────────────────────────────
// The polymorphic event feed served by GET /jobs/:id/events and broadcast over
// the socket gateway. Discriminated on `type`; the backend serializer
// (serializeEvent) mirrors these exactly. `clientId` is the sender's optimistic
// id, echoed back so the client can reconcile its pending bubble. `status` is
// client-only: it tracks an optimistic send before the server confirms it.
export type JobEventStatus = "sending" | "sent" | "failed";

type EventBase = {
  id: string;
  createdAt: string; // ISO
  time: string; // pre-rendered "9:05 AM"
  clientId?: string;
  status?: JobEventStatus;
};

export type JobEvent =
  | (EventBase & { type: "COMMENT"; by: Person; body: string })
  | (EventBase & { type: "PHOTO"; by: Person; payload: { url: string; tag?: string } })
  | (EventBase & { type: "VOICE"; by: Person; payload: { url: string; durationMs: number } })
  | (EventBase & {
      type: "PART_ADDED";
      by: Person;
      payload: { partName: string; qty: number; price: number };
    })
  | (EventBase & { type: "STATUS_CHANGE"; by?: Person; payload: { from: string; to: string } })
  | (EventBase & {
      type: "APPROVAL";
      by?: Person;
      body?: string;
      payload?: { decision?: "approve" | "decline" };
    })
  | (EventBase & { type: "SYSTEM"; body: string; payload?: Record<string, unknown> });

export type JobEventsPage = { items: JobEvent[]; nextCursor: string | null };

// Returned by POST /jobs/:id/uploads/presign — the client PUTs the file to
// `uploadUrl`, then posts an event whose payload.url is `fileUrl`.
export type PresignedUpload = {
  uploadUrl: string;
  fileUrl: string;
  method: "PUT";
  headers: Record<string, string>;
};

// ── Notifications inbox ──────────────────────────────────────────────────────
// A persisted copy of one push sent to the current user (GET /notifications).
// `data` mirrors the push's deep-link payload; `jobCode` routes to /job/[id].
export type AppNotification = {
  id: string;
  title: string;
  body: string;
  data?: { type: string; jobCode?: string };
  atISO: string;
  read: boolean;
};

export type NotificationsInbox = { items: AppNotification[]; unread: number };

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
  photoUrl?: string;
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
  customerPhone?: string;
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
