import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "@/components/ui/Txt";
import { Badge } from "@/components/ui/Badge";
import { Plate } from "@/components/ui/Plate";
import { CarThumb } from "@/components/ui/CarThumb";
import { Button } from "@/components/ui/Button";
import { Composer } from "@/components/chat/Composer";
import { ChatFeed } from "@/components/chat/ChatFeed";
import { useChat } from "@/components/chat/useChat";
import { AddPartSheet } from "@/components/screens/AddPartSheet";
import { VoiceOverlay } from "@/components/screens/VoiceOverlay";
import { Icon } from "@/components/Icon";
import { useRole } from "@/lib/role";
import { getJob, JOBS, PEOPLE, TIMELINE, TIMELINE_DONE } from "@/data/mock";

export default function JobTimeline() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { role } = useRole();
  const job = getJob(id) ?? JOBS[0];
  const done = job.status === "COMPLETED";
  const isManager = role !== "tech";

  // Who the current user is on this screen, used to right-align their messages.
  const me = isManager ? PEOPLE.rashid : PEOPLE.arjun;
  const { messages, sendText, sendVoice } = useChat(done ? TIMELINE_DONE : TIMELINE, me);

  const [sheet, setSheet] = useState(false);
  const [voice, setVoice] = useState(false);

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
            <CarThumb width={42} height={42} radius={11} iconSize={20} />
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
                <Button label="Reassign" variant="ghost" icon="arrows-clockwise" iconWeight="bold" small className="flex-1" />
                <Button label="Customer" variant="ghost" icon="phone" iconWeight="bold" small className="flex-1" />
                <Button label="Invoice" variant="pur" icon="receipt" small className="flex-1" onPress={() => router.push(`/invoice/${job.id}`)} />
              </>
            ) : (
              <>
                <Button label="Pause" icon="pause" small className="flex-1 bg-[#FEF6E7]" textClassName="text-[#D97706]" />
                <Button label="Complete" variant="green" icon="check" small className="flex-1" />
              </>
            )}
          </View>
        </View>

        <ChatFeed messages={messages} me={me} />

        <Composer
          placeholder={isManager ? "Message the team…" : "Add a note…"}
          smiley={!isManager}
          onSend={sendText}
          onAttach={() => setSheet(true)}
          onMic={() => setVoice(true)}
        />
      </KeyboardAvoidingView>

      <AddPartSheet visible={sheet} onClose={() => setSheet(false)} />
      <VoiceOverlay
        visible={voice}
        onCancel={() => setVoice(false)}
        onSend={(seconds) => {
          setVoice(false);
          sendVoice(seconds);
        }}
      />
    </SafeAreaView>
  );
}
