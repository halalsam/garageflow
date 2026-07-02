import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Button } from "@/components/ui/Button";
import { Composer } from "@/components/chat/Composer";
import { TimelineFeed } from "@/components/timeline/TimelineFeed";
import { AddPartSheet } from "@/components/screens/AddPartSheet";
import { VoiceOverlay } from "@/components/screens/VoiceOverlay";
import { AssignTechSheet } from "@/components/job/AssignTechSheet";
import { AssignedTechRow } from "@/components/job/AssignedTechRow";
import { CompletionPhotos } from "@/components/job/CompletionPhotos";
import { DeliverySheet } from "@/components/job/DeliverySheet";
import { Loading, ErrorState } from "@/components/ui/QueryState";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/lib/auth";
import { useJob } from "@/lib/api/hooks/queries";
import { useJobEvents } from "@/lib/api/hooks/useJobEvents";
import {
  useUpdateJob,
  useMarkJobRead,
  useUploadCompletionPhoto,
  useUploadDeliveryPhoto,
} from "@/lib/api/hooks/mutations";
import { photoForm, uploadJobFile } from "@/lib/api/upload";
import { pickPhotoSource } from "@/lib/media/pickPhoto";
import { shareCompletionReport } from "@/lib/job/completionReport";
import { callCustomer, whatsappCustomer, shareCustomerReport } from "@/lib/share/contact";
import { COMPLETION_SIDES, type CompletionSide, type Person } from "@/types/api";

export default function JobTimeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, role } = useAuth();
  const { data: job, isLoading, isError, refetch } = useJob(id);
  const isManager = role !== "tech";

  // Who the current user is on this screen, used to right-align their messages.
  const me: Person = user
    ? { id: user.id, name: user.name, initials: user.initials, color: user.color }
    : { name: "Me", initials: "?", color: "a" };
  const { events, sendText, sendVoice, sendPhoto, loadOlder, hasMore } = useJobEvents(id, me);
  const updateJob = useUpdateJob(id);

  // Mark the chat read once the newest event changes (covers open + new incoming
  // events while viewing). `events` is newest-first, so the tail is events[0].
  // The ref guards against re-posting for the same event on every render.
  const markRead = useMarkJobRead(id);
  const lastSeenRef = useRef<string | null>(null);
  const tail = events.length ? events[0].id : null;
  useEffect(() => {
    if (!user || !tail || lastSeenRef.current === tail) return;
    lastSeenRef.current = tail;
    markRead.mutate();
  }, [tail, user]);

  const uploadPhoto = useUploadCompletionPhoto(id);
  const uploadDelivery = useUploadDeliveryPhoto(id);
  const [busySide, setBusySide] = useState<CompletionSide | null>(null);
  const [busyDeliverySide, setBusyDeliverySide] = useState<CompletionSide | null>(null);

  const [sheet, setSheet] = useState(false);
  const [voice, setVoice] = useState(false);
  const [deliverySheet, setDeliverySheet] = useState(false);
  const [delivering, setDelivering] = useState(false);
  const [assignSheet, setAssignSheet] = useState(false);

  if (isLoading) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#F0EEF6]">
        <Loading label="Loading job…" />
      </SafeAreaView>
    );
  }
  if (isError || !job) {
    return (
      <SafeAreaView edges={["top"]} className="flex-1 bg-[#F0EEF6]">
        <ErrorState onRetry={() => refetch()} />
      </SafeAreaView>
    );
  }

  // Attach a photo to the chat (camera or library).
  const pickPhoto = () => pickPhotoSource(sendPhoto);

  // Capture one mandatory arrival photo for a side (camera or library).
  const captureSide = (side: CompletionSide) =>
    pickPhotoSource((uri) => {
      setBusySide(side);
      uploadPhoto.mutate(photoForm(uri, { side }), {
        onSettled: () => setBusySide(null),
        onError: (err: any) =>
          Alert.alert("Photo not uploaded", err?.message ?? "Check your connection and try again."),
      });
    }, `${side[0].toUpperCase()}${side.slice(1)} photo`);

  // Capture one mandatory delivery photo for a side (camera or library).
  const captureDeliverySide = (side: CompletionSide) =>
    pickPhotoSource((uri) => {
      setBusyDeliverySide(side);
      uploadDelivery.mutate(photoForm(uri, { side }), {
        onSettled: () => setBusyDeliverySide(null),
        onError: (err: any) =>
          Alert.alert("Photo not uploaded", err?.message ?? "Check your connection and try again."),
      });
    }, `${side[0].toUpperCase()}${side.slice(1)} photo`);

  const photos = job.completionPhotos ?? [];
  const deliveryPhotos = job.deliveryPhotos ?? [];
  const photosComplete = COMPLETION_SIDES.every((s) => photos.some((p) => p.side === s));
  const isCompleted = job.status === "COMPLETED";
  const isDelivered = job.status === "DELIVERED";

  const completeJob = () => {
    if (!photosComplete) {
      Alert.alert("Photos required", "Capture all four arrival photos before marking the job complete.");
      return;
    }
    updateJob.mutate({ status: "COMPLETED", progress: 100 });
  };

  // Finalise the guided delivery: upload the voice note (if any), then PATCH the
  // job to DELIVERED with the note. The sheet gates photos + note before calling.
  const confirmDelivery = async (note: { text?: string; audioUri?: string; seconds?: number }) => {
    setDelivering(true);
    try {
      const body: Record<string, unknown> = { status: "DELIVERED" };
      if (note.audioUri) {
        body.deliveryNoteAudioUrl = await uploadJobFile(id, note.audioUri, "audio");
      } else if (note.text) {
        body.deliveryNote = note.text;
      }
      await updateJob.mutateAsync(body);
      setDeliverySheet(false);
    } catch (err: any) {
      Alert.alert("Couldn't deliver", err?.message ?? "Please try again.");
    } finally {
      setDelivering(false);
    }
  };

  const openDelivery = () => {
    if (!isCompleted) {
      Alert.alert("Complete first", "Mark the job complete before delivering the vehicle.");
      return;
    }
    setDeliverySheet(true);
  };

  // An invoice exists only after the estimate is approved. `invoiceId` routes
  // directly; the backend also resolves the job code as a fallback.
  const openInvoice = () => {
    if (!job.invoiceId) {
      Alert.alert("No invoice yet", "An invoice is created when the estimate is approved.");
      return;
    }
    router.push(`/invoice/${job.invoiceId}`);
  };

  const sendReport = () => shareCompletionReport(job, photos);
  const shareToCustomer = () =>
    shareCustomerReport(job, [...photos, ...deliveryPhotos], "Vehicle report");

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F0EEF6]">
      {/* padding works on Android too now that edge-to-edge disables adjustResize */}
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        {/* header */}
        <View className="bg-white px-[14px] pb-[12px] pt-[8px]" style={{ shadowColor: "#281E14", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3, zIndex: 1 }}>
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Icon name="caret-left" size={21} weight="bold" />
            </Pressable>
            <CarThumb width={42} height={42} radius={11} iconSize={20} uri={job.photoUrl} />
            <View className="flex-1">
              <Plate number={job.plate} scale={0.82} />
              <Txt className="mt-[3px] font-bold text-[13px]">
                {job.make} {job.model} · {job.year}
              </Txt>
            </View>
            <Badge label={job.status} tone={job.tone} />
          </View>

          {/* role-aware actions */}
          <View className="mt-[11px] flex-row" style={{ gap: 8 }}>
            {isManager ? (
              <>
                <Button
                  label="Call"
                  variant="ghost"
                  icon="phone"
                  iconWeight="bold"
                  small
                  className="flex-1"
                  onPress={() => callCustomer(job.customerPhone)}
                />
                <Button
                  label="WhatsApp"
                  variant="wa"
                  icon="whatsapp"
                  small
                  className="flex-1"
                  onPress={shareToCustomer}
                />
                <Button
                  label="Invoice"
                  variant="pur"
                  icon="receipt"
                  small
                  className="flex-1"
                  onPress={openInvoice}
                />
              </>
            ) : !isCompleted && !isDelivered ? (
              <Button
                label={updateJob.isPending ? "Saving…" : "Mark complete"}
                variant="green"
                icon="check"
                small
                className="flex-1"
                style={!photosComplete ? { opacity: 0.5 } : undefined}
                disabled={updateJob.isPending}
                onPress={completeJob}
              />
            ) : null}
          </View>

          {/* Who's wrenching on this job — managers can reassign. */}
          {isManager ? (
            <AssignedTechRow tech={job.tech} onPress={() => setAssignSheet(true)} />
          ) : null}

          {/* Deliver: available to everyone once the job is complete. */}
          {isCompleted || isDelivered ? (
            <Button
              label={isDelivered ? "Delivered" : "Deliver vehicle"}
              variant={isDelivered ? "ghost" : "green"}
              icon="seal-check"
              small
              className="mt-[8px]"
              style={isDelivered ? { opacity: 0.6 } : undefined}
              disabled={isDelivered}
              onPress={openDelivery}
            />
          ) : null}

          {/* Managers can act as technicians, so anyone on the job captures. */}
          <CompletionPhotos
            photos={photos}
            canCapture={!isCompleted && !isDelivered}
            busySide={busySide}
            onCapture={captureSide}
            onSend={sendReport}
          />
        </View>

        <TimelineFeed
          events={events}
          me={me}
          reads={job.reads}
          onLoadOlder={loadOlder}
          hasMore={hasMore}
        />

        <Composer
          placeholder={isManager ? "Message the team…" : "Add a note…"}
          smiley={!isManager}
          onSend={sendText}
          onAttach={() => setSheet(true)}
          onPickPhoto={pickPhoto}
          onTapMic={() => setVoice(true)}
          onSendVoice={sendVoice}
        />
      </KeyboardAvoidingView>

      <AddPartSheet jobId={job.id} visible={sheet} onClose={() => setSheet(false)} />
      <AssignTechSheet
        jobId={job.id}
        current={job.tech}
        visible={assignSheet}
        onClose={() => setAssignSheet(false)}
      />
      <VoiceOverlay
        visible={voice}
        onCancel={() => setVoice(false)}
        onSendVoice={(uri, seconds) => {
          setVoice(false);
          sendVoice(uri, seconds);
        }}
      />
      <DeliverySheet
        visible={deliverySheet}
        photos={deliveryPhotos}
        busySide={busyDeliverySide}
        submitting={delivering}
        onClose={() => setDeliverySheet(false)}
        onCapture={captureDeliverySide}
        onConfirm={confirmDelivery}
      />
    </SafeAreaView>
  );
}
