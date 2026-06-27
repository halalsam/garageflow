import { useState } from "react";
import { Alert, Pressable, TextInput, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Txt } from "@/components/ui/Txt";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Icon } from "@/components/Icon";
import { useAddExpense } from "@/lib/api/hooks/mutations";
import type { ExpenseCategory } from "@/types/api";

const CATEGORIES: ExpenseCategory[] = ["Parts", "Salaries", "Rent", "Utilities", "Misc"];

// Capture a business expense: title, category, amount (₹). Posts to the API and
// closes on success.
export function AddExpenseSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Parts");
  const [amount, setAmount] = useState("");
  const add = useAddExpense();

  const reset = () => {
    setTitle("");
    setCategory("Parts");
    setAmount("");
  };

  const submit = () => {
    const rupees = Math.round(Number(amount));
    if (!title.trim() || !rupees || rupees <= 0) {
      Alert.alert("Add a title and amount", "Enter what the expense was for and a ₹ amount.");
      return;
    }
    add.mutate(
      { title: title.trim(), category, amount: rupees },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
        onError: () => Alert.alert("Couldn't add expense", "Please try again."),
      },
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={420}>
      <View className="px-[18px] pt-[8px]">
        <View className="flex-row items-center justify-between">
          <Txt className="font-bold text-[18px]" style={{ letterSpacing: -0.3 }}>
            Add expense
          </Txt>
          <Pressable onPress={onClose} hitSlop={10}>
            <Icon name="x" size={20} weight="bold" color="#6B7280" />
          </Pressable>
        </View>

        <View className="mt-[14px]">
          <SectionLabel>WHAT FOR</SectionLabel>
          <TextInput
            className="mt-[8px] rounded-[14px] bg-[#F4F4F6] px-[14px] py-[13px] font-medium text-[14px] text-ink"
            placeholder="e.g. Parts restock — brake pads"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View className="mt-[14px]">
          <SectionLabel>CATEGORY</SectionLabel>
          <View className="mt-[8px] flex-row flex-wrap" style={{ gap: 8 }}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
        </View>

        <View className="mt-[14px]">
          <SectionLabel>AMOUNT (₹)</SectionLabel>
          <TextInput
            className="mt-[8px] rounded-[14px] bg-[#F4F4F6] px-[14px] py-[13px] font-black text-[18px] text-ink"
            placeholder="0"
            placeholderTextColor="#C3C3CC"
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <Button
          label={add.isPending ? "Saving…" : "Add expense"}
          icon="plus"
          className="mt-[16px]"
          disabled={add.isPending}
          onPress={submit}
        />
      </View>
    </BottomSheet>
  );
}
