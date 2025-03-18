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

  // 📌 연도 범위 (메모이제이션)
  const [yearRange, setYearRange] = useState(() => ({
    start: initialYear - 100,
    end: initialYear + 100,
  }));

  // 📌 초기 스크롤 위치를 맞추기 위한 ref
  const scrollRefs = {
    year: useRef<ScrollView>(null),
    month: useRef<ScrollView>(null),
    day: useRef<ScrollView>(null),
    hour: useRef<ScrollView>(null),
  };

  // 📌 연도 리스트 생성
  const years = useMemo(() => {
    return Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, i) => yearRange.start + i
    );
  }, [yearRange]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  // 📌 연도 갱신 (50년 초과되면 100년 추가)
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

  // 📌 날짜 변경
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

  // 📌 외부 터치 시 현재 설정된 날짜 반환
  const handleOutsideTouch = () => {
    onConfirm(selectedDate);
    onClose();
  };

  // 📌 초기 스크롤 위치 설정
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        scrollRefs.year.current?.scrollTo({
          y: (selectedDate.year() - yearRange.start) * ITEM_HEIGHT,
          x: 0,
          animated: false,
        });
        scrollRefs.month.current?.scrollTo({
          y: selectedDate.month() * ITEM_HEIGHT,
          x: 0,
          animated: false,
        });
        scrollRefs.day.current?.scrollTo({
          y: (selectedDate.date() - 1) * ITEM_HEIGHT,
          x: 0,
          animated: false,
        });
        scrollRefs.hour.current?.scrollTo({
          y: selectedDate.hour() * ITEM_HEIGHT,
          x: 0,
          animated: false,
        });
      }, 50);
    }
  }, [visible, selectedDate, yearRange]);

  // 📌 루프 가능한 ScrollView 생성
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
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleOutsideTouch}
      >
        <View style={styles.modalContent}>
          <Text style={styles.selectedTimeText}>
            {selectedDate.format("YYYY년 M월 D일 HH시")}
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
      </TouchableOpacity>
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
