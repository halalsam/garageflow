import { ScrollView, View } from "react-native";
import { router } from "expo-router";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { Txt } from "@/components/ui/Txt";
import { Metric } from "@/components/ui/Metric";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ChipRow } from "@/components/ui/Chip";
import { CollectionSummary } from "@/components/finance/CollectionSummary";
import { ReceivableRow } from "@/components/finance/ReceivableRow";
import { InvoiceRow } from "@/components/finance/InvoiceRow";
import { ReportLink } from "@/components/finance/ReportLink";
import { useInvoiceFilter, INVOICE_FILTERS, type InvoiceFilter } from "@/components/finance/useInvoiceFilter";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import {
  useCollections,
  useFinanceSummary,
  useGstReport,
  useInvoices,
  useLedgers,
  useProfit,
  useReceivables,
} from "@/lib/api/hooks/queries";
import { inr } from "@/lib/format";
// Finances hub — shared by the manager and owner tabs. Money is read from the
// invoice/payment data layer; visibility per role is enforced upstream (RBAC).
export function FinanceScreen() {
  const summary = useFinanceSummary();
  const collectionsQ = useCollections();
  const receivablesQ = useReceivables();
  const ledgersQ = useLedgers();
  const gstQ = useGstReport();
  const profitQ = useProfit();
  const invoicesQ = useInvoices();
  const { filter, setFilter, invoices } = useInvoiceFilter(invoicesQ.data ?? []);
  const openInvoice = (id: string) => router.push(`/invoice/${id}`);

  // Gate the whole screen on the two headline queries; the rest fill in as they
  // resolve (cards show "—" until their query lands).
  if (summary.isLoading || collectionsQ.isLoading) {
    return (
      <Screen>
        <TopBar title="Finances" right={<HeaderIcon name="export" />} />
        <Loading label="Loading finances…" />
      </Screen>
    );
  }
  if (summary.isError) {
    return (
      <Screen>
        <TopBar title="Finances" right={<HeaderIcon name="export" />} />
        <ErrorState onRetry={() => summary.refetch()} />
      </Screen>
    );
  }

  const collections = collectionsQ.data ?? { methods: [], total: 0, count: 0 };
  const owed = receivablesQ.data ?? [];
  const dash = (n?: number) => (n === undefined ? "—" : inr(n));

  return (
    <Screen>
      <TopBar title="Finances" right={<HeaderIcon name="export" />} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
        {/* headline numbers */}
        <View className="flex-row px-[18px]" style={{ gap: 10 }}>
          <Metric num={dash(summary.data?.outstanding)} label="Outstanding" bg="#FDECEC" numColor="#DC2626" labelColor="#DC2626" />
          <Metric num={dash(summary.data?.collectedToday)} label="Collected today" bg="#FFF6F2" numColor="#FF5A1F" />
        </View>

        {/* day book */}
        <View className="mt-[20px] px-[18px]">
          <SectionLabel>TODAY&apos;S COLLECTIONS</SectionLabel>
          <View className="mt-[10px]">
            <CollectionSummary methods={collections.methods} total={collections.total} />
          </View>
        </View>

        {/* reports */}
        <View className="mt-[20px] px-[18px]">
          <SectionLabel>REPORTS</SectionLabel>
          <View className="mt-[10px]" style={{ gap: 10 }}>
            <ReportLink
              icon="users-three"
              tint={{ bg: "#EAF2FF", fg: "#2563EB" }}
              title="Customer ledgers"
              subtitle={`${ledgersQ.data?.length ?? "…"} parties · statements & exports`}
              onPress={() => router.push("/finance/ledgers")}
            />
            <ReportLink
              icon="percent"
              tint={{ bg: "#F2ECFE", fg: "#6C2BD9" }}
              title="GST report"
              subtitle={`${dash(gstQ.data?.gst)} output tax this month`}
              onPress={() => router.push("/finance/gst")}
            />
            <ReportLink
              icon="cart"
              tint={{ bg: "#FFF1EC", fg: "#FF5A1F" }}
              title="Expenses & profit"
              subtitle={`${dash(profitQ.data?.profit)} net profit this month`}
              onPress={() => router.push("/finance/expenses")}
            />
          </View>
        </View>

        {/* receivables */}
        <View className="mt-[20px] px-[18px]">
          <View className="flex-row items-center justify-between">
            <SectionLabel>OUTSTANDING</SectionLabel>
            <Txt className="font-bold text-[11px] text-muted">{owed.length} unpaid</Txt>
          </View>
          <View className="mt-[10px]" style={{ gap: 10 }}>
            {owed.map((inv) => (
              <ReceivableRow key={inv.id} invoice={inv} onPress={() => openInvoice(inv.id)} />
            ))}
          </View>
        </View>

        {/* invoices */}
        <View className="mt-[20px]">
          <View className="px-[18px]">
            <SectionLabel>INVOICES</SectionLabel>
          </View>
          <ChipRow
            className="mt-[10px] pl-[18px]"
            items={[...INVOICE_FILTERS]}
            value={filter}
            onChange={(v) => setFilter(v as InvoiceFilter)}
          />
          <View className="mt-[12px] px-[18px]" style={{ gap: 10 }}>
            {invoices.length === 0 ? (
              <Txt className="py-[16px] text-center font-medium text-[13px] text-muted">No {filter.toLowerCase()} invoices</Txt>
            ) : (
              invoices.map((inv) => <InvoiceRow key={inv.id} invoice={inv} onPress={() => openInvoice(inv.id)} />)
            )}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
