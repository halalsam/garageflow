import { useMemo, useState } from "react";
import { INVOICES, statusFor, type Invoice, type InvoiceStatus } from "@/data/mock";

export const INVOICE_FILTERS = ["All", "Unpaid", "Partial", "Paid"] as const;
export type InvoiceFilter = (typeof INVOICE_FILTERS)[number];

const STATUS_FOR_FILTER: Record<Exclude<InvoiceFilter, "All">, InvoiceStatus> = {
  Unpaid: "UNPAID",
  Partial: "PARTIAL",
  Paid: "PAID",
};

// Holds the active invoice-list filter and returns the matching invoices.
export function useInvoiceFilter() {
  const [filter, setFilter] = useState<InvoiceFilter>("All");
  const invoices = useMemo<Invoice[]>(() => {
    if (filter === "All") return INVOICES;
    return INVOICES.filter((i) => statusFor(i) === STATUS_FOR_FILTER[filter]);
  }, [filter]);
  return { filter, setFilter, invoices };
}
