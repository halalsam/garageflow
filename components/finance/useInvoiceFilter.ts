import { useMemo, useState } from "react";
import type { Invoice, InvoiceStatus } from "@/types/api";

export const INVOICE_FILTERS = ["All", "Unpaid", "Partial", "Paid"] as const;
export type InvoiceFilter = (typeof INVOICE_FILTERS)[number];

const STATUS_FOR_FILTER: Record<Exclude<InvoiceFilter, "All">, InvoiceStatus> = {
  Unpaid: "UNPAID",
  Partial: "PARTIAL",
  Paid: "PAID",
};

// Holds the active invoice-list filter and returns the matching invoices from a
// fetched source list. Status comes from the API (`invoice.status`), already
// derived from payments server-side.
export function useInvoiceFilter(source: Invoice[] = []) {
  const [filter, setFilter] = useState<InvoiceFilter>("All");
  const invoices = useMemo<Invoice[]>(() => {
    if (filter === "All") return source;
    return source.filter((i) => i.status === STATUS_FOR_FILTER[filter]);
  }, [filter, source]);
  return { filter, setFilter, invoices };
}
