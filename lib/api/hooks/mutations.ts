// Mutation hooks — the write actions. Each invalidates the caches its change
// touches so the UI reflects server-derived state (balances, statuses, profit)
// without manual refetch wiring in the screens.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as e from "@/lib/api/endpoints";
import { qk } from "@/lib/api/queryClient";
import type { ExpenseCategory, PayMethod } from "@/types/api";

// Record a payment against an invoice. Re-derives the invoice + every finance
// figure that depends on payments.
export function useRecordPayment(invoiceId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, method }: { amount: number; method: PayMethod }) =>
      e.recordPayment(invoiceId, amount, method),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.invoice(invoiceId) });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: ["finance"] });
      qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

// Mark the whole notifications inbox read (fired when the inbox opens).
export function useMarkNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => e.markNotificationsRead(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.notifications });
    },
  });
}

// Add a business expense.
export function useAddExpense() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { title: string; category: ExpenseCategory; amount: number; spentAt?: string }) =>
      e.addExpense(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

// Approve/decline an estimate. On approve the backend creates an invoice and
// advances the job, so invalidate approvals + jobs + invoices.
export function useDecideApproval(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (decision: "approve" | "decline") => e.decideApproval(id, decision),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.approvals });
      qc.invalidateQueries({ queryKey: qk.approval(id) });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: ["invoices"] });
      qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

// Mark a job's chat as read by the current user. Refreshes the job detail so
// the per-user read receipts update for everyone on next fetch.
export function useMarkJobRead(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => e.markJobRead(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.job(jobId) }),
  });
}

// Upload a mandatory completion photo for a side. The endpoint returns the
// updated job detail, so we seed the cache with it immediately.
export function useUploadCompletionPhoto(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => e.uploadCompletionPhoto(jobId, form),
    onSuccess: (job) => {
      qc.setQueryData(qk.job(jobId), job);
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
    },
  });
}

// Upload a mandatory delivery photo for a side. Returns the updated job detail.
export function useUploadDeliveryPhoto(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => e.uploadDeliveryPhoto(jobId, form),
    onSuccess: (job) => {
      qc.setQueryData(qk.job(jobId), job);
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
    },
  });
}

// Add catalogue parts to a job (decrements stock, appends PART timeline entries).
export function useAddParts(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: { catalogueItemId: string; qty: number }[]) => e.addParts(jobId, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
      qc.invalidateQueries({ queryKey: ["catalogue"] });
    },
  });
}

// Patch a job (status/progress/tech/bay/priority).
export function useUpdateJob(jobId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => e.updateJob(jobId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.job(jobId) });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}

// Create a job card.
export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: Record<string, unknown>) => e.createJob(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
      qc.invalidateQueries({ queryKey: qk.dashboard });
    },
  });
}
