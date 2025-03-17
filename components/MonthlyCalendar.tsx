import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import dayjs, { Dayjs } from "dayjs";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MONTH_VIEW_HEIGHT = SCREEN_HEIGHT * 0.4; // 한 달 달력 높이를 화면의 40%로 설정
const INITIAL_MONTHS = 12; // 처음 렌더링할 개월 수 (6개월 이전 + 현재 + 6개월 이후)
const CENTER_INDEX = INITIAL_MONTHS / 2; // FlatList 초기 위치 (현재 달 기준)

type CalendarMonth = {
  date: Dayjs;
  days: (Dayjs | null)[];
};

// 📌 한 달 단위 달력 데이터 생성 함수
const generateCalendarData = (date: Dayjs): (Dayjs | null)[] => {
  const startOfMonth = date.startOf("month");
  const daysInMonth = startOfMonth.daysInMonth();
  const firstDayIndex = startOfMonth.day();

  const days: Dayjs[] = Array.from({ length: daysInMonth }, (_, i) =>
    startOfMonth.add(i, "day")
  );

  const leadingBlanks = Array(firstDayIndex).fill(null);
  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
  const trailingBlanksCount = totalCells - (firstDayIndex + daysInMonth);
  const trailingBlanks = Array(trailingBlanksCount).fill(null);

  return [...leadingBlanks, ...days, ...trailingBlanks];
};

const MonthlyCalendar = () => {
  const today = dayjs();
  const listRef = useRef<FlatList>(null);
  const [calendarData, setCalendarData] = useState<CalendarMonth[]>(() =>
    Array.from({ length: INITIAL_MONTHS }, (_, i) => {
      const month = today.subtract(CENTER_INDEX - i, "month");
      return { date: month, days: generateCalendarData(month) };
    })
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 📌 이전 달 추가 (최상단으로 스크롤 시)
  const addPreviousMonths = useCallback(() => {
    const firstMonth = calendarData[0].date.subtract(3, "month"); // 3개월 추가
    const newMonths = Array.from({ length: 3 }, (_, i) => {
      const month = firstMonth.add(i, "month");
      return { date: month, days: generateCalendarData(month) };
    });

    setCalendarData((prev) => [...newMonths, ...prev]);

    setTimeout(() => {
      if (listRef.current) {
        listRef.current.scrollToIndex({ index: 3, animated: false });
      }
    }, 50);
  }, [calendarData]);

  // 📌 다음 달 추가 (최하단으로 스크롤 시)
  const addNextMonths = useCallback(() => {
    const lastMonth = calendarData[calendarData.length - 1].date.add(
      1,
      "month"
    );
    const newMonths = Array.from({ length: 3 }, (_, i) => {
      const month = lastMonth.add(i, "month");
      return { date: month, days: generateCalendarData(month) };
    });

    setCalendarData((prev) => [...prev, ...newMonths]);
  }, [calendarData]);

  // 📌 한 달 단위로 렌더링
  const renderMonth = ({ item }: { item: CalendarMonth }) => (
    <View style={[styles.monthContainer, { height: MONTH_VIEW_HEIGHT }]}>
      <Text style={styles.headerTitle}>{item.date.format("YYYY년 M월")}</Text>
      <View style={styles.weekDays}>
        {["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => (
          <Text
            key={idx}
            style={[
              styles.weekDayText,
              idx === 0 ? styles.sunday : idx === 6 ? styles.saturday : null,
            ]}
          >
            {day}
          </Text>
        ))}
      </View>
      <FlatList
        data={item.days}
        numColumns={7}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderDayCell}
        scrollEnabled={false}
      />
    </View>
  );

  // 📌 날짜 셀 렌더링
  const renderDayCell = ({ item }: { item: Dayjs | null }) => {
    if (item === null) return <View style={styles.dayCell} />;

    const dayNumber = item.date();
    const isToday = item.isSame(today, "day");
    const isSelected = selectedDate && item.isSame(selectedDate, "day");

    return (
      <TouchableOpacity
        style={[
          styles.dayCell,
          isToday && styles.todayCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={() => setSelectedDate(item)}
      >
        <Text
          style={[
            styles.dayText,
            isToday && styles.todayText,
            isSelected && styles.selectedText,
          ]}
        >
          {dayNumber}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={calendarData}
        keyExtractor={(item) => item.date.format("YYYY-MM")}
        renderItem={renderMonth}
        onEndReached={addNextMonths} // 🔹 아래로 스크롤하면 다음 달 추가
        onEndReachedThreshold={0.5}
        onScroll={({ nativeEvent }) => {
          if (nativeEvent.contentOffset.y <= 10) {
            addPreviousMonths(); // 🔹 위로 스크롤하면 이전 달 추가
          }
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        initialScrollIndex={CENTER_INDEX}
        getItemLayout={(_, index) => ({
          length: MONTH_VIEW_HEIGHT,
          offset: MONTH_VIEW_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

export default MonthlyCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  monthContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
    paddingHorizontal: 2,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
  },
  sunday: { color: "#e55" },
  saturday: { color: "#367" },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 2,
  },
  dayText: {
    fontSize: 14,
  },
  todayCell: {
    backgroundColor: "#4e73df20",
    borderRadius: 20,
  },
  todayText: {
    color: "#4e73df",
    fontWeight: "bold",
  },
  selectedCell: {
    backgroundColor: "#33c9aa20",
    borderRadius: 20,
  },
  selectedText: {
    color: "#33c9aa",
    fontWeight: "bold",
  },
});
