import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import dayjs, { Dayjs } from "dayjs";

// ✅ Props 타입 정의
interface InfiniteCalendarProps {
  selectedDate: Dayjs;
  onSelectDate: (date: Dayjs) => void;
}

const InfiniteCalendar: React.FC<InfiniteCalendarProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const today = dayjs();
  const startDate = today.subtract(2, "year"); // 과거 2년
  const endDate = today.add(2, "year"); // 미래 2년

  // 날짜 리스트 생성
  const dateList: Dayjs[] = Array.from(
    { length: endDate.diff(startDate, "day") + 1 },
    (_, index) => startDate.add(index, "day")
  );

  // FlatList에서 기본적으로 오늘 날짜가 중앙에 오도록 설정
  const listRef = useRef<FlatList<any>>(null);
  const initialIndex = dateList.findIndex((date) => date.isSame(today, "day"));

  const scrollToToday = useCallback(() => {
    if (listRef.current && initialIndex !== -1) {
      listRef.current.scrollToIndex({ index: initialIndex, animated: true });
    }
  }, [initialIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={dateList}
        keyExtractor={(item) => item.format("YYYY-MM-DD")}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dateItem,
              item.isSame(selectedDate, "day") && styles.selectedDate,
            ]}
            onPress={() => onSelectDate(item)}
          >
            <Text style={styles.dateText}>{item.format("YYYY-MM-DD")}</Text>
          </TouchableOpacity>
        )}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: 50, // 각 아이템 높이 (최적화)
          offset: 50 * index,
          index,
        })}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.todayButton} onPress={scrollToToday}>
        <Text style={styles.todayText}>오늘</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InfiniteCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  dateItem: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  selectedDate: {
    backgroundColor: "#007bff",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  todayButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  todayText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
