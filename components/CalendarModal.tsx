import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import TimePicker from "./TimePicker";
import dayjs from "dayjs";
import MonthlyCalendar from "./MonthlyCalendar";

const CalendarModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"yearMonth" | "hourMinute">(
    "yearMonth"
  );

  const handleTimeConfirm = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setTimePickerVisible(false);
  };

  console.log("Entering");

  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <TouchableWithoutFeedback
        onPress={() => !isTimePickerVisible && onClose()}
      >
        <View
          style={[
            styles.modalContent,
            isTimePickerVisible && styles.disabledOverlay,
          ]}
        >
          {/* 2. 타임픽커 버튼 추가 및 클릭 시 열기 */}
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => {
              setPickerMode("yearMonth");
              setTimePickerVisible(true);
            }}
            disabled={isTimePickerVisible} // 12. 타임픽커 표시 중에는 클릭 방지
          >
            <Text style={styles.timeText}>
              {selectedDate.format("YYYY-MM")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => {
              setPickerMode("hourMinute");
              setTimePickerVisible(true);
            }}
            disabled={isTimePickerVisible} // 12. 타임픽커 표시 중에는 클릭 방지
          >
            <Text style={styles.timeText}>{selectedDate.format("HH:mm")}</Text>
          </TouchableOpacity>

          {/* 13. FlatList 스크롤 방지 + 터치 이벤트 차단 */}
          {/* <FlatList
            data={Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`)}
            renderItem={({ item }) => (
              <Text style={styles.listItem}>{item}</Text>
            )}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={!isTimePickerVisible} // 🔹 타임픽커가 열리면 스크롤 방지
          /> */}
        </View>
      </TouchableWithoutFeedback>

      {/* <MonthlyCalendar /> */}
      {/* 14. 타임픽커를 `absolute` 배치하여 조작 가능하도록 수정 */}
      {isTimePickerVisible && (
        <TimePicker
          mode={pickerMode}
          initialDate={selectedDate}
          onClose={() => setTimePickerVisible(false)}
          onConfirm={handleTimeConfirm}
          visible={false}
        />
      )}
    </View>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledOverlay: {
    pointerEvents: "none", // 12. 타임픽커가 열리면 달력 조작 불가능
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    pointerEvents: "auto", // 14. 모달 터치 이벤트 복구
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginVertical: 5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    fontSize: 14,
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});
