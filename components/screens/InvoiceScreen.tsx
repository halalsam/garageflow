import { ScrollView } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { InvoiceReceipt } from "@/components/finance/InvoiceReceipt";
import { PaymentPanel } from "@/components/finance/PaymentPanel";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useInvoice } from "@/lib/api/hooks/queries";
import { sharePdf } from "@/lib/finance/export";
import { invoiceHtml } from "@/lib/finance/invoiceHtml";

export function InvoiceScreen({ id }: { id?: string }) {
  const { data: invoice, isLoading, isError, refetch } = useInvoice(id ?? "");

  const onExport = invoice
    ? () => sharePdf(invoice.number, invoiceHtml(invoice))
    : undefined;

  return (
    <Screen>
      <TopBar title="Invoice" back right={<HeaderIcon name="export" onPress={onExport} />} />
      {isLoading ? (
        <Loading label="Loading invoice…" />
      ) : isError || !invoice ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 28 }}>
          <InvoiceReceipt invoice={invoice} />
          <PaymentPanel invoice={invoice} />
        </ScrollView>
      )}
    </Screen>
  );
}
