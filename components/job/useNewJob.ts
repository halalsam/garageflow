import { useMemo, useState } from "react";
import type { Customer, VehicleHit, VehicleType } from "@/types/api";

// GST rate the backend applies to a job estimate (see jobs.service.ts).
const GST_RATE = 18;

export type JobLine = { id: string; label: string; note: string; amount: number };

export type VehicleDraft = {
  plate: string;
  make: string;
  model: string;
  year: string; // kept as text while editing; coerced on submit
  type: VehicleType;
};

const emptyVehicleDraft = (plate = ""): VehicleDraft => ({
  plate,
  make: "",
  model: "",
  year: "",
  type: "HATCHBACK",
});

let lineSeq = 0;
const nextLineId = () => `l${++lineSeq}`;

// All state + derived values for the New Job card. Screens stay declarative:
// they render fields/components and call these setters; `payload` is the exact
// body POST /jobs expects (vehicleId | plate+…, customerId | customerName,
// complaint?, odometer?, lines?).
export function useNewJob() {
  // Vehicle: a picked existing one, or a manual draft (mutually exclusive).
  const [vehicle, setVehicle] = useState<VehicleHit | null>(null);
  const [vehicleDraft, setVehicleDraft] = useState<VehicleDraft>(emptyVehicleDraft());

  // Customer: a picked existing one, or a typed name.
  const [customer, setCustomer] = useState<Customer | VehicleHit["customer"] | null>(null);
  const [customerId, setCustomerId] = useState<string | undefined>(undefined);
  const [customerName, setCustomerName] = useState("");

  const [complaint, setComplaint] = useState("");
  const [odometer, setOdometer] = useState("");
  const [lines, setLines] = useState<JobLine[]>([]);

  // ── Vehicle actions ──
  const selectVehicle = (hit: VehicleHit) => {
    setVehicle(hit);
    setVehicleDraft(emptyVehicleDraft());
    // Existing vehicle implies its owner — adopt it as the customer.
    setCustomerId(undefined);
    setCustomerName("");
    setCustomer(hit.customer);
  };

  const clearVehicle = () => {
    setVehicle(null);
    setVehicleDraft(emptyVehicleDraft());
  };

  const editVehicleDraft = (patch: Partial<VehicleDraft>) => {
    setVehicle(null); // typing manual details clears any picked vehicle
    setVehicleDraft((d) => ({ ...d, ...patch }));
  };

  // ── Customer actions ──
  const selectCustomer = (c: Customer) => {
    setCustomerId(c.id);
    setCustomerName("");
    setCustomer(c);
  };

  const typeCustomerName = (name: string) => {
    setCustomerId(undefined);
    setCustomerName(name);
    setCustomer(name.trim() ? { name: name.trim(), initials: "", color: "a" } : null);
  };

  const clearCustomer = () => {
    setCustomerId(undefined);
    setCustomerName("");
    setCustomer(null);
  };

  // ── Line item actions ──
  const addLine = (line: Omit<JobLine, "id">) => setLines((ls) => [...ls, { ...line, id: nextLineId() }]);
  const updateLine = (id: string, patch: Partial<Omit<JobLine, "id">>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  const removeLine = (id: string) => setLines((ls) => ls.filter((l) => l.id !== id));

  // ── Derived ──
  const subtotal = useMemo(() => lines.reduce((s, l) => s + (l.amount || 0), 0), [lines]);
  const gst = Math.round((subtotal * GST_RATE) / 100);
  const total = subtotal + gst;

  const hasVehicle =
    !!vehicle ||
    (!!vehicleDraft.plate.trim() &&
      !!vehicleDraft.make.trim() &&
      !!vehicleDraft.model.trim() &&
      !!vehicleDraft.year.trim());

  const hasCustomer = !!customerId || !!customerName.trim();

  const canSubmit = hasVehicle && hasCustomer;

  const buildPayload = (): Record<string, unknown> => {
    const body: Record<string, unknown> = {};

    if (vehicle) {
      body.vehicleId = vehicle.id;
    } else {
      body.plate = vehicleDraft.plate.trim();
      body.make = vehicleDraft.make.trim();
      body.model = vehicleDraft.model.trim();
      body.year = Number(vehicleDraft.year);
      body.type = vehicleDraft.type;
    }

    // A picked existing vehicle already implies its owner; only send customer
    // info when the user explicitly chose/typed one.
    if (customerId) body.customerId = customerId;
    else if (customerName.trim()) body.customerName = customerName.trim();

    if (complaint.trim()) body.complaint = complaint.trim();
    const odo = Number(odometer);
    if (odometer.trim() && Number.isFinite(odo) && odo >= 0) body.odometer = Math.round(odo);

    if (lines.length) {
      body.lines = lines.map((l) => ({ label: l.label, note: l.note, amount: l.amount }));
    }

    return body;
  };

  return {
    // vehicle
    vehicle,
    vehicleDraft,
    selectVehicle,
    clearVehicle,
    editVehicleDraft,
    // customer
    customer,
    customerId,
    customerName,
    selectCustomer,
    typeCustomerName,
    clearCustomer,
    // fields
    complaint,
    setComplaint,
    odometer,
    setOdometer,
    // lines
    lines,
    addLine,
    updateLine,
    removeLine,
    // derived
    subtotal,
    gst,
    gstRate: GST_RATE,
    total,
    canSubmit,
    buildPayload,
  };
}

export type NewJob = ReturnType<typeof useNewJob>;
