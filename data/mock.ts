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
  status: string; // human label
  tone: Tone;
  priority?: "HIGH" | "NORMAL";
  complaint?: string;
  progress?: number;
  amount?: number;
};

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

export type TeamMember = Person & {
  phone?: string;
  role: Role;
  roleLabel: string;
  roleIcon: IconName;
  active?: boolean;
  inactive?: boolean;
};

export const PEOPLE = {
  arjun: { name: "Arjun Patel", initials: "AP", color: "a" },
  suresh: { name: "Suresh Verma", initials: "SV", color: "d" },
  ramesh: { name: "Ramesh Nair", initials: "Rn", color: "e" },
  rakesh: { name: "Rakesh Kumar", initials: "RK", color: "c" },
  sneha: { name: "Sneha Desai", initials: "SD", color: "b" },
  rashid: { name: "Rashid Pathan", initials: "RP", color: "b" },
  kamal: { name: "kamal khushwaha", initials: "VK", color: "f" },
} satisfies Record<string, Person>;

export const WORKSHOP = "Main Street Motors";

export const JOBS: Job[] = [
  {
    id: "j1",
    plate: "MH 02 AB 1234",
    make: "Maruti",
    model: "Swift",
    year: 2021,
    type: "HATCHBACK",
    bay: "BAY 2",
    customer: PEOPLE.rakesh,
    tech: PEOPLE.arjun,
    status: "IN PROGRESS",
    tone: "blue",
    priority: "HIGH",
    complaint: "AC not cooling, strange noise from blower",
    progress: 65,
  },
  {
    id: "j2",
    plate: "GJ 01 KK 0921",
    make: "Hyundai",
    model: "Creta",
    year: 2022,
    type: "SUV",
    bay: "BAY 4",
    customer: PEOPLE.sneha,
    tech: PEOPLE.suresh,
    status: "AWAITING PART",
    tone: "amber",
    priority: "NORMAL",
    complaint: "Periodic service + AC gas top-up",
    progress: 40,
  },
  {
    id: "j3",
    plate: "DL 3C AT 7788",
    make: "Tata",
    model: "Nexon",
    year: 2020,
    type: "SUV",
    customer: PEOPLE.rakesh,
    status: "REVIEW",
    tone: "purple",
    complaint: "Brakes squealing, soft pedal",
    amount: 14200,
  },
  {
    id: "j4",
    plate: "KA 05 MN 4521",
    make: "Honda",
    model: "City",
    year: 2019,
    type: "SEDAN",
    customer: PEOPLE.rakesh,
    tech: PEOPLE.arjun,
    status: "COMPLETED",
    tone: "green",
    progress: 100,
    amount: 14200,
  },
];

export const getJob = (id: string) => JOBS.find((j) => j.id === id);

// Technician core timeline (job j1)
export const TIMELINE: TimelineItem[] = [
  { kind: "system", text: "Approved by Priya · 8:30 AM", tone: "purple", icon: "shield-check" },
  { kind: "text", by: PEOPLE.rakesh, text: "Customer says noise starts after 10 min of driving. Please check blower motor first.", time: "8:34 AM" },
  { kind: "photo", by: PEOPLE.arjun, tag: "BEFORE · BLOWER", time: "8:52 AM" },
  { kind: "voice", by: PEOPLE.arjun, dur: "0:24", time: "9:05 AM" },
  { kind: "part", by: PEOPLE.arjun, name: "Blower Motor Assembly", qty: 1, price: 2400, time: "9:12 AM" },
];

// Manager view timeline (job j4, completed)
export const TIMELINE_DONE: TimelineItem[] = [
  { kind: "system", text: "Approved · released to Arjun", tone: "purple", icon: "shield-check" },
  { kind: "text", by: PEOPLE.arjun, text: "Brake pads replaced, fluid flushed. Test drive done — pedal firm now.", time: "11:20 AM" },
  { kind: "photo", by: PEOPLE.arjun, tag: "AFTER · BRAKES", time: "11:22 AM" },
  { kind: "system", text: "Marked complete · 11:25 AM", tone: "green", icon: "check-circle" },
];

export const PARTS: CatalogueItem[] = [
  { id: "p1", name: "Blower Motor Assembly", sku: "BLM-204", stock: 6, price: 2400, kind: "part" },
  { id: "p2", name: "Front Brake Pads", sku: "BRP-091", stock: 14, price: 2400, kind: "part" },
  { id: "p3", name: "Cabin Air Filter", sku: "CAF-110", stock: 22, price: 650, kind: "part" },
  { id: "p4", name: "Engine Oil 5W-30 (1L)", sku: "EO-530", stock: 30, price: 520, kind: "part" },
  { id: "p5", name: "AC Compressor Belt", sku: "ACB-077", stock: 9, price: 420, kind: "part" },
];

export const SERVICES: CatalogueItem[] = [
  { id: "s1", name: "Brake pad replacement", sku: "Labour", price: 1800, kind: "service" },
  { id: "s2", name: "AC service & gas top-up", sku: "Labour", price: 1500, kind: "service" },
  { id: "s3", name: "Periodic service (full)", sku: "Labour", price: 3200, kind: "service" },
  { id: "s4", name: "Brake fluid flush", sku: "Labour", price: 900, kind: "service" },
];

export const TEAM: TeamMember[] = [
  { ...PEOPLE.kamal, phone: "+91 98200 11223", role: "admin", roleLabel: "Admin", roleIcon: "crown-simple" },
  { ...PEOPLE.rashid, phone: "+91 98201 44556", role: "manager", roleLabel: "Manager", roleIcon: "shield-check" },
  { ...PEOPLE.arjun, role: "tech", roleLabel: "Technician", roleIcon: "wrench", active: true },
  { ...PEOPLE.suresh, role: "tech", roleLabel: "Technician", roleIcon: "wrench", active: true },
  { ...PEOPLE.ramesh, role: "tech", roleLabel: "Technician", roleIcon: "wrench", inactive: true },
];

// Approvals awaiting a manager's review. Keyed by job id; the detail screen
// (`/approval/[id]`) and the Approvals tab both read from this list.
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

export const APPROVALS: Approval[] = [
  {
    id: "j3",
    plate: "DL 3C AT 7788",
    car: "Tata Nexon",
    customer: "Rakesh K.",
    submittedBy: PEOPLE.arjun,
    ago: "12m ago",
    lines: [
      { label: "Brake pad replacement", note: "Labour", amount: 1800 },
      { label: "Front brake pads", note: "2 × ₹2,400", amount: 4800 },
      { label: "Brake fluid flush", note: "Labour", amount: 900 },
    ],
    subtotal: 12034,
    gst: 2166,
    total: 14200,
  },
  {
    id: "a1",
    plate: "GJ 01 KK 0921",
    car: "Hyundai Creta",
    customer: "Sneha D.",
    submittedBy: PEOPLE.suresh,
    ago: "44m ago",
    lines: [
      { label: "AC service & gas top-up", note: "Labour", amount: 1500 },
      { label: "Cabin air filter", note: "1 × ₹650", amount: 650 },
      { label: "AC compressor belt", note: "1 × ₹420", amount: 420 },
    ],
    subtotal: 2570,
    gst: 463,
    total: 3033,
  },
  {
    id: "a2",
    plate: "MH 02 AB 1234",
    car: "Maruti Swift",
    customer: "Rakesh K.",
    submittedBy: PEOPLE.arjun,
    ago: "1h ago",
    lines: [
      { label: "Blower motor assembly", note: "1 × ₹2,400", amount: 2400 },
      { label: "AC service & gas top-up", note: "Labour", amount: 1500 },
    ],
    subtotal: 3900,
    gst: 702,
    total: 4602,
  },
];

export const getApproval = (id?: string) => APPROVALS.find((a) => a.id === id) ?? APPROVALS[0];

// ── Finances ──────────────────────────────────────────────────────────────
// Invoices and payments are kept as separate lists (like a real backend would):
// an invoice's "paid", "balance" and status are always DERIVED from its
// payments, never stored. When the API lands, only the two arrays below get
// swapped for fetched data — every helper and screen keeps working unchanged.

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
  id: string; // also the /invoice/[id] route param; mirrors the job id where one exists
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
};

// "Today" for the day-book. Swap for the server clock once the backend lands.
export const TODAY = "2026-06-27";

export const INVOICES: Invoice[] = [
  {
    id: "j4",
    number: "INV-2048",
    date: "26 Jun 2026",
    issuedAt: "2026-06-26",
    jobId: "j4",
    customer: "Rakesh K.",
    car: "Honda City",
    plate: "KA 05 MN 4521",
    lines: [
      { label: "Brake pad replacement", note: "Labour", amount: 1800 },
      { label: "Front brake pads", note: "2 × ₹2,400", amount: 4800 },
      { label: "Brake fluid flush", note: "Labour", amount: 900 },
      { label: "Wheel alignment", note: "Labour", amount: 4534 },
    ],
    subtotal: 12034,
    gst: 2166,
    total: 14200,
  },
  {
    id: "inv-2049",
    number: "INV-2049",
    date: "27 Jun 2026",
    issuedAt: "2026-06-27",
    customer: "Sneha D.",
    car: "Hyundai Creta",
    plate: "GJ 01 KK 0921",
    lines: [
      { label: "AC service & gas top-up", note: "Labour", amount: 1500 },
      { label: "Cabin air filter", note: "1 × ₹650", amount: 650 },
      { label: "AC compressor belt", note: "1 × ₹420", amount: 420 },
    ],
    subtotal: 2570,
    gst: 463,
    total: 3033,
  },
  {
    id: "inv-2050",
    number: "INV-2050",
    date: "23 Jun 2026",
    issuedAt: "2026-06-23",
    customer: "Imran S.",
    car: "Maruti Swift",
    plate: "MH 12 DE 8890",
    lines: [
      { label: "Periodic service (full)", note: "Labour", amount: 3200 },
      { label: "Engine oil 5W-30", note: "4 × ₹520", amount: 2080 },
      { label: "Cabin air filter", note: "1 × ₹650", amount: 650 },
      { label: "Oil filter", note: "1 × ₹380", amount: 380 },
    ],
    subtotal: 6310,
    gst: 1136,
    total: 7446,
  },
  {
    id: "inv-2051",
    number: "INV-2051",
    date: "27 Jun 2026",
    issuedAt: "2026-06-27",
    customer: "Rakesh K.",
    car: "Tata Nexon",
    plate: "DL 3C AT 7788",
    lines: [
      { label: "Brake pad replacement", note: "Labour", amount: 1800 },
      { label: "Front brake pads", note: "2 × ₹2,400", amount: 4800 },
      { label: "Brake fluid flush", note: "Labour", amount: 900 },
      { label: "Suspension inspection", note: "Labour", amount: 4534 },
    ],
    subtotal: 12034,
    gst: 2166,
    total: 14200,
  },
];

export const PAYMENTS: Payment[] = [
  { id: "pay-1", invoiceId: "j4", amount: 8000, method: "UPI", at: `${TODAY}T11:40:00` },
  { id: "pay-2", invoiceId: "inv-2049", amount: 3033, method: "Cash", at: `${TODAY}T10:05:00` },
  { id: "pay-3", invoiceId: "inv-2051", amount: 5000, method: "Card", at: `${TODAY}T09:20:00` },
];

export const getInvoice = (id?: string) => INVOICES.find((i) => i.id === id) ?? INVOICES[0];

export const paymentsFor = (invoiceId: string) => PAYMENTS.filter((p) => p.invoiceId === invoiceId);
export const paidFor = (invoiceId: string) => paymentsFor(invoiceId).reduce((s, p) => s + p.amount, 0);
export const balanceFor = (inv: Invoice) => inv.total - paidFor(inv.id);

export const statusFor = (inv: Invoice): InvoiceStatus => {
  const paid = paidFor(inv.id);
  if (paid <= 0) return "UNPAID";
  if (paid >= inv.total) return "PAID";
  return "PARTIAL";
};

// Money owed to the shop — unpaid + partially paid, biggest balance first.
export const receivables = () =>
  INVOICES.filter((i) => balanceFor(i) > 0).sort((a, b) => balanceFor(b) - balanceFor(a));

export const outstandingTotal = () => receivables().reduce((s, i) => s + balanceFor(i), 0);

export type MethodTotal = { method: PayMethod; amount: number; count: number };

// Day book — payments taken on `day`, grouped by method, plus the grand total.
export const collectionsOn = (day = TODAY) => {
  const todays = PAYMENTS.filter((p) => p.at.startsWith(day));
  const methods: MethodTotal[] = (["Cash", "UPI", "Card"] as PayMethod[]).map((method) => {
    const ps = todays.filter((p) => p.method === method);
    return { method, amount: ps.reduce((s, p) => s + p.amount, 0), count: ps.length };
  });
  return { methods, total: todays.reduce((s, p) => s + p.amount, 0), count: todays.length };
};

// Period anchors derived from TODAY. Swap for real date math on the backend.
export const MONTH = TODAY.slice(0, 7); // "2026-06"
export const MONTH_LABEL = "June 2026";
export const WEEK_START = "2026-06-21"; // Monday of the current demo week

// Revenue = taxable sales value (ex-GST). GST is a pass-through liability, so it
// is excluded here and reported separately in the GST output-tax report.
const invoicesSince = (from: string) => INVOICES.filter((i) => i.issuedAt >= from);
export const invoicesInMonth = (month = MONTH) => INVOICES.filter((i) => i.issuedAt.startsWith(month));

export const revenueThisWeek = () => invoicesSince(WEEK_START).reduce((s, i) => s + i.subtotal, 0);
export const revenueInMonth = (month = MONTH) => invoicesInMonth(month).reduce((s, i) => s + i.subtotal, 0);

// GST output-tax (what the shop collected on sales and must remit). Indian
// intra-state supply splits the 18% evenly into CGST 9% + SGST 9%.
export const gstSummary = (month = MONTH) => {
  const invs = invoicesInMonth(month);
  const taxable = invs.reduce((s, i) => s + i.subtotal, 0);
  const gst = invs.reduce((s, i) => s + i.gst, 0);
  const cgst = Math.round(gst / 2);
  return { taxable, gst, cgst, sgst: gst - cgst, count: invs.length };
};

// ── Expenses ────────────────────────────────────────────────────────────────
export type ExpenseCategory = "Parts" | "Salaries" | "Rent" | "Utilities" | "Misc";

export type Expense = {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  at: string; // ISO date
};

export const EXPENSES: Expense[] = [
  { id: "exp-1", title: "Parts restock — brake pads, filters", category: "Parts", amount: 12500, at: "2026-06-20" },
  { id: "exp-2", title: "Staff advance — Suresh", category: "Salaries", amount: 6000, at: "2026-06-18" },
  { id: "exp-3", title: "Electricity bill", category: "Utilities", amount: 4200, at: "2026-06-15" },
  { id: "exp-4", title: "Shop supplies & consumables", category: "Misc", amount: 2400, at: "2026-06-22" },
];

export const expensesInMonth = (month = MONTH) =>
  EXPENSES.filter((e) => e.at.startsWith(month)).sort((a, b) => (a.at < b.at ? 1 : -1));
export const expensesTotal = (month = MONTH) => expensesInMonth(month).reduce((s, e) => s + e.amount, 0);

// True profit for the period: ex-GST revenue minus expenses.
export const profitInMonth = (month = MONTH) => revenueInMonth(month) - expensesTotal(month);

// ── Party ledger ─────────────────────────────────────────────────────────────
// A customer statement: every invoice is a debit (what they owe), every payment
// a credit, with a running balance — the "ledger" an accountant/customer reads.
// Derived from the same invoices + payments, so it always ties out.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split("-");
  return `${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
};

export type LedgerEntry = {
  at: string; // ISO, for ordering
  date: string; // display label
  particulars: string;
  ref: string; // invoice number
  debit: number; // invoice raised
  credit: number; // payment received
  balance: number; // running balance owed
};

export const partyLedger = (customer: string) => {
  const invs = INVOICES.filter((i) => i.customer === customer);
  const rows: Omit<LedgerEntry, "balance">[] = [];
  invs.forEach((i) => {
    rows.push({ at: `${i.issuedAt}T00:00:00`, date: i.date, particulars: `Invoice · ${i.car}`, ref: i.number, debit: i.total, credit: 0 });
    paymentsFor(i.id).forEach((p) => {
      rows.push({ at: p.at, date: fmtDate(p.at), particulars: `Payment · ${p.method}`, ref: i.number, debit: 0, credit: p.amount });
    });
  });
  rows.sort((a, b) => (a.at < b.at ? -1 : 1));
  let balance = 0;
  const entries: LedgerEntry[] = rows.map((r) => {
    balance += r.debit - r.credit;
    return { ...r, balance };
  });
  return { customer, entries, closing: balance, billed: invs.reduce((s, i) => s + i.total, 0) };
};

export type Party = { name: string; closing: number; invoices: number };

export const parties = (): Party[] => {
  const names = Array.from(new Set(INVOICES.map((i) => i.customer)));
  return names
    .map((name) => ({ name, closing: partyLedger(name).closing, invoices: INVOICES.filter((i) => i.customer === name).length }))
    .sort((a, b) => b.closing - a.closing);
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
