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
const VISIBLE_ITEMS = 5;
const SCREEN_WIDTH = Dimensions.get("window").width;

type CustomTimePickerProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedDate: Dayjs) => void;
};

const CustomTimePicker = ({
  visible,
  onClose,
  onConfirm,
}: CustomTimePickerProps) => {
  const now = dayjs();
  const initialYear = now.year();

  const [selectedDate, setSelectedDate] = useState(now);

  // 📌 年範囲（最適化されたメモ化）
  const [yearRange, setYearRange] = useState(() => ({
    start: initialYear - 100,
    end: initialYear + 100,
  }));

  // 📌 現在の日付基準の初期データ
  const years = useMemo(() => {
    return Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, i) => yearRange.start + i
    );
  }, [yearRange]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const scrollRefs = {
    year: useRef<ScrollView>(null),
    month: useRef<ScrollView>(null),
    day: useRef<ScrollView>(null),
    hour: useRef<ScrollView>(null),
  };

  // 📌 年の範囲を更新（50年以上超えた場合100年追加）
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

  // 📌 選択された日付を更新
  const handleDateChange = (
    type: "year" | "month" | "day" | "hour",
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
      case "day":
        newDate = newDate.date(value);
        break;
      case "hour":
        newDate = newDate.hour(value);
        break;
    }
    setSelectedDate(newDate);
  };

  // 📌 確定ボタンをクリック
  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  // 📌 無限スクロール可能な ScrollView を作成
  const renderLoopedPicker = (
    items: number[],
    selectedValue: number,
    type: "year" | "month" | "day" | "hour",
    ref: React.RefObject<ScrollView>
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
        contentOffset={{ x: 0, y: items.length * ITEM_HEIGHT }}
      >
        <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
        {items.concat(items, items).map((item, index) => (
          <View key={index} style={styles.pickerItemContainer}>
            <Text
              style={[
                styles.pickerItem,
                selectedValue === item && styles.selectedItem,
              ]}
            >
              {item}
            </Text>
          </View>
        ))}
        <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
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
            {selectedDate.format("YYYY年 M月 D日 HH時")}
          </Text>

          <View style={styles.pickerContainer}>
            {renderLoopedPicker(
              years,
              selectedDate.year(),
              "year",
              scrollRefs.year
            )}
            {renderLoopedPicker(
              months,
              selectedDate.month() + 1,
              "month",
              scrollRefs.month
            )}
            {renderLoopedPicker(
              days,
              selectedDate.date(),
              "day",
              scrollRefs.day
            )}
            {renderLoopedPicker(
              hours,
              selectedDate.hour(),
              "hour",
              scrollRefs.hour
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
  cancelButton: {
    fontSize: 16,
    color: "#FF4444",
  },
  confirmButton: {
    fontSize: 16,
    color: "#007BFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedTimeText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: 60,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItem: {
    fontSize: 18,
    color: "#666",
  },
  selectedItem: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
});
