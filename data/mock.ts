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
  | { kind: "photo"; by: Person; tag: string; time: string }
  | { kind: "voice"; by: Person; dur: string; time: string }
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

// Approval estimate (job j3)
export const ESTIMATE = {
  lines: [
    { label: "Brake pad replacement", note: "Labour", amount: 1800 },
    { label: "Front brake pads", note: "2 × ₹2,400", amount: 4800 },
    { label: "Brake fluid flush", note: "Labour", amount: 900 },
  ],
  subtotal: 12034,
  gst: 2166,
  total: 14200,
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
