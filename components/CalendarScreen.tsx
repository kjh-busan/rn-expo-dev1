import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import CalendarModal from "./CalendarModal";
import dayjs from "dayjs";

export default function CalendarScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs()); // ✅ 날짜 상태 추가

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>📅 캘린더 화면</Text>
      <Text>선택된 날짜: {selectedDate.format("YYYY-MM-DD HH:mm")}</Text>
      <Button title="캘린더 모달 열기" onPress={() => setIsVisible(true)} />
      <CalendarModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        initialDate={selectedDate} // ✅ 누락된 프롭스 추가
        onConfirm={(date) => setSelectedDate(date)} // ✅ 선택한 날짜 반영
        mode={"yearMonth"}
      />
    </View>
  );
}
