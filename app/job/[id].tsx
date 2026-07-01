import { useEffect, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
import { uploadJobFile } from "@/lib/api/upload";
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

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera access needed", "Enable camera permission to take photos.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (!res.canceled && res.assets?.[0]) sendPhoto(res.assets[0].uri);
  };

  const chooseFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (!res.canceled && res.assets?.[0]) sendPhoto(res.assets[0].uri);
  };

  // Let the user pick a source before attaching a photo.
  const pickPhoto = () => {
    Alert.alert("Add photo", undefined, [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Choose from Library", onPress: chooseFromLibrary },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // Snap one walk-around side (camera only) and return a ready-to-post FormData.
  const captureFormForSide = async (side: CompletionSide): Promise<FormData | null> => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera access needed", "Enable camera permission to take photos.");
      return null;
    }
    const res = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.7 });
    if (res.canceled || !res.assets?.[0]) return null;
    const uri = res.assets[0].uri;
    const ext = uri.split(".").pop()?.toLowerCase() ?? "jpg";
    const form = new FormData();
    form.append("side", side);
    form.append("image", { uri, name: `${side}.${ext}`, type: `image/${ext === "jpg" ? "jpeg" : ext}` } as any);
    return form;
  };

  // Capture one mandatory completion photo for a side.
  const captureSide = async (side: CompletionSide) => {
    const form = await captureFormForSide(side);
    if (!form) return;
    setBusySide(side);
    uploadPhoto.mutate(form, { onSettled: () => setBusySide(null) });
  };

  // Capture one mandatory delivery photo for a side.
  const captureDeliverySide = async (side: CompletionSide) => {
    const form = await captureFormForSide(side);
    if (!form) return;
    setBusyDeliverySide(side);
    uploadDelivery.mutate(form, { onSettled: () => setBusyDeliverySide(null) });
  };

  const photos = job.completionPhotos ?? [];
  const deliveryPhotos = job.deliveryPhotos ?? [];
  const photosComplete = COMPLETION_SIDES.every((s) => photos.some((p) => p.side === s));
  const isCompleted = job.status === "COMPLETED";
  const isDelivered = job.status === "DELIVERED";

  const completeJob = () => {
    if (!photosComplete) {
      Alert.alert("Photos required", "Capture all four completion photos before marking the job complete.");
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

  const sendReport = () => shareCompletionReport(job, photos);
  const shareToCustomer = () =>
    shareCustomerReport(job, [...photos, ...deliveryPhotos], "Vehicle report");

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-[#F0EEF6]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* header */}
        <View className="bg-white px-[14px] pb-[12px] pt-[8px]" style={{ shadowColor: "#281E14", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
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
                <Button label="Invoice" variant="pur" icon="receipt" small className="flex-1" onPress={() => router.push(`/invoice/${job.id}`)} />
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

          {!isManager || photos.length ? (
            <CompletionPhotos
              photos={photos}
              canCapture={!isManager && !isCompleted && !isDelivered}
              busySide={busySide}
              onCapture={captureSide}
              onSend={sendReport}
            />
          ) : null}
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
