import { useState } from "react";
import { Alert, ScrollView } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { TopBar, HeaderIcon } from "@/components/ui/TopBar";
import { InvoiceReceipt } from "@/components/finance/InvoiceReceipt";
import { PaymentPanel } from "@/components/finance/PaymentPanel";
import { ShareInvoiceSheet } from "@/components/finance/ShareInvoiceSheet";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { useInvoice, useJob } from "@/lib/api/hooks/queries";
import { sharePdf } from "@/lib/finance/export";
import { invoiceHtml } from "@/lib/finance/invoiceHtml";

export function InvoiceScreen({ id }: { id?: string }) {
  const { data: invoice, isLoading, isError, refetch } = useInvoice(id ?? "");
  // The linked job carries the walk-around photos the share sheet can attach.
  const { data: job } = useJob(invoice?.jobId ?? "");
  const [sheet, setSheet] = useState(false);
  const [sharing, setSharing] = useState(false);

  const before = job?.completionPhotos ?? [];
  const after = job?.deliveryPhotos ?? [];

  const share = async (includePhotos: boolean) => {
    if (!invoice || sharing) return;
    setSharing(true);
    try {
      const photos = includePhotos ? { before, after } : undefined;
      await sharePdf(invoice.number, invoiceHtml(invoice, photos));
      setSheet(false);
    } catch {
      Alert.alert("Couldn't share", "Something went wrong preparing the PDF. Try again.");
    } finally {
      setSharing(false);
    }
  };

  // The sheet always opens so the photo toggle stays discoverable; it disables
  // the switch itself when the job has no photos yet.
  const onExport = invoice ? () => setSheet(true) : undefined;

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
      <ShareInvoiceSheet
        visible={sheet}
        before={before}
        after={after}
        sharing={sharing}
        onClose={() => setSheet(false)}
        onShare={share}
      />
    </Screen>
  );
}
