import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import dayjs, { Dayjs } from "dayjs";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 3; // 🔹 휠 표시 개수 3개
const SCREEN_WIDTH = Dimensions.get("window").width;

type CustomTimePickerProps = {
  visible: boolean;
  mode: "yearMonth" | "hourMinute";
  onClose: () => void;
  onConfirm: (selectedDate: Dayjs) => void;
};

const CustomTimePicker = ({
  visible,
  mode,
  onClose,
  onConfirm,
}: CustomTimePickerProps) => {
  const now = dayjs();
  const initialYear = now.year();

  const [selectedDate, setSelectedDate] = useState(now);

  const [yearRange, setYearRange] = useState(() => ({
    start: initialYear - 100,
    end: initialYear + 100,
  }));

  const years = useMemo(() => {
    return Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, i) => yearRange.start + i
    );
  }, [yearRange]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const minutes = useMemo(
    () => Array.from({ length: 6 }, (_, i) => i * 10),
    []
  ); // 🔹 10분 단위

  const scrollRefs = {
    year: useRef<ScrollView>(null),
    month: useRef<ScrollView>(null),
    hour: useRef<ScrollView>(null),
    minute: useRef<ScrollView>(null),
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (mode === "yearMonth") {
          scrollRefs.year.current?.scrollTo({
            y: (selectedDate.year() - yearRange.start) * ITEM_HEIGHT,
            animated: false,
          });
          scrollRefs.month.current?.scrollTo({
            y: selectedDate.month() * ITEM_HEIGHT,
            animated: false,
          });
        } else if (mode === "hourMinute") {
          scrollRefs.hour.current?.scrollTo({
            y: selectedDate.hour() * ITEM_HEIGHT,
            animated: false,
          });
          scrollRefs.minute.current?.scrollTo({
            y: (selectedDate.minute() / 10) * ITEM_HEIGHT, // 🔹 10분 단위 스크롤
            animated: false,
          });
        }
      }, 100);
    }
  }, [visible, selectedDate, yearRange, mode]);

  const updateYearRange = useCallback(
    (newYear: number) => {
      if (newYear <= yearRange.start + 50) {
        setYearRange((prev) => ({ start: prev.start - 100, end: prev.end }));
      } else if (newYear >= yearRange.end - 50) {
        setYearRange((prev) => ({ start: prev.start, end: prev.end + 100 }));
      }
    },
    [yearRange]
  );

  const handleDateChange = (
    type: "year" | "month" | "hour" | "minute",
    value: number
  ) => {
    let newDate = selectedDate;
    switch (type) {
      case "year":
        newDate = newDate.year(value);
        updateYearRange(value);
        break;
      case "month":
        newDate = newDate.month(value - 1);
        break;
      case "hour":
        newDate = newDate.hour(value);
        break;
      case "minute":
        newDate = newDate.minute(value);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  const renderLoopedPicker = (
    items: number[],
    selectedValue: number,
    type: "year" | "month" | "hour" | "minute",
    ref: React.RefObject<ScrollView>,
    unit?: string
  ) => {
    return (
      <ScrollView
        ref={ref}
        style={styles.picker}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index =
            Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT) %
            items.length;
          handleDateChange(type, items[index]);
        }}
        contentOffset={{ x: 0, y: selectedValue * ITEM_HEIGHT }}
      >
        <View style={{ height: ITEM_HEIGHT }} />
        {items.map((item, index) => (
          <View
            key={`${type}-${item}-${index}`}
            style={styles.pickerItemContainer}
          >
            <Text
              style={[
                styles.pickerItem,
                selectedValue === item && styles.selectedItem,
              ]}
            >
              {item < 10 ? `0${item}` : item}
              {unit}
            </Text>
          </View>
        ))}
        <View style={{ height: ITEM_HEIGHT }} />
      </ScrollView>
    );
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>キャンセル</Text>
            </TouchableOpacity>
            <Text style={styles.title}>時間選択</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>確認</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedTimeText}>
            {mode === "yearMonth"
              ? selectedDate.format("YYYY年 MM月")
              : selectedDate.format("HH:mm")}
          </Text>

          <View style={styles.pickerContainer}>
            {mode === "yearMonth" && (
              <>
                {renderLoopedPicker(
                  years,
                  selectedDate.year(),
                  "year",
                  scrollRefs.year
                )}
                <Text style={styles.selectedTimeText}>年</Text>

                {renderLoopedPicker(
                  months,
                  selectedDate.month() + 1,
                  "month",
                  scrollRefs.month
                )}
                <Text style={styles.selectedTimeText}>月</Text>
              </>
            )}
            {mode === "hourMinute" && (
              <>
                {renderLoopedPicker(
                  hours,
                  selectedDate.hour(),
                  "hour",
                  scrollRefs.hour
                )}
                <Text style={styles.selectedTimeText}>:</Text>

                {renderLoopedPicker(
                  minutes,
                  selectedDate.minute(),
                  "minute",
                  scrollRefs.minute
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomTimePicker;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: SCREEN_WIDTH * 0.9,
    alignItems: "center",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cancelButton: { fontSize: 16, color: "#FF4444" },
  confirmButton: { fontSize: 16, color: "#007BFF" },
  title: { fontSize: 18, fontWeight: "bold" },
  selectedTimeText: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
  },
  picker: { width: 80, height: ITEM_HEIGHT * VISIBLE_ITEMS },
  pickerItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItem: { fontSize: 18, color: "#666" },
  selectedItem: { fontSize: 20, fontWeight: "bold", color: "#000" },
});
