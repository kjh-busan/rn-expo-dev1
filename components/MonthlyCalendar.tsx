import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import dayjs from "dayjs";

const { width, height } = Dimensions.get("window");

interface CalendarProps {
  calendarHeight?: number;
  onDateSelect?: (date: string) => void;
  styles?: {
    calendarContainer?: ViewStyle;
    monthTitle?: TextStyle;
    weekDay?: TextStyle;
    dateCell?: ViewStyle;
    today?: ViewStyle;
    selectedDate?: ViewStyle;
    dot?: TextStyle;
  };
}

const generateMonthData = (date: dayjs.Dayjs) => {
  const startOfMonth = date.startOf("month");
  const endOfMonth = date.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  let days: { date: dayjs.Dayjs; isCurrentMonth: boolean }[] = [];

  // 이전 달 날짜 채우기
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: startOfMonth.subtract(i + 1, "day"),
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: startOfMonth.date(i),
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜 채우기
  while (days.length % 7 !== 0) {
    days.push({
      date: endOfMonth.add(days.length % 7, "day"),
      isCurrentMonth: false,
    });
  }

  // 주(week) 단위로 나누기
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

const MonthlyCalendar: React.FC<CalendarProps> = ({
  calendarHeight,
  onDateSelect,
  styles: customStyles = {},
}) => {
  const effectiveCalendarHeight = calendarHeight ?? height * 0.6; // 기본값 설정
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const listRef = useRef<FlatList>(null);

  // 무한 스크롤을 위한 월 데이터 생성
  const months = [
    currentMonth.subtract(1, "month"),
    currentMonth,
    currentMonth.add(1, "month"),
  ];

  // 스크롤 시 현재 월 업데이트
  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / effectiveCalendarHeight);

      setCurrentMonth((current) => current.add(index - 1, "month"));

      listRef.current?.scrollToOffset({
        offset: effectiveCalendarHeight,
        animated: false,
      });
    },
    [effectiveCalendarHeight]
  );

  const handleDateSelect = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date.format("YYYY-MM-DD"));
    }
  };

  // 컴포넌트가 마운트될 때 초기 스크롤 위치 설정
  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: effectiveCalendarHeight,
      animated: false,
    });
  }, [effectiveCalendarHeight]);

  return (
    <View
      style={StyleSheet.flatten([
        defaultStyles.container,
        customStyles.calendarContainer,
        { height: effectiveCalendarHeight },
      ])}
    >
      <Animated.FlatList
        ref={listRef}
        data={months}
        keyExtractor={(item) => item.format("YYYY-MM")}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: effectiveCalendarHeight,
          offset: effectiveCalendarHeight * index,
          index,
        })}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        renderItem={({ item }) => {
          const weeks = generateMonthData(item);
          return (
            <View>
              <Text
                style={StyleSheet.flatten([
                  defaultStyles.monthTitle,
                  customStyles.monthTitle,
                ])}
              >
                {item.format("YYYY년 MM월")}
              </Text>
              <View style={defaultStyles.weekRow}>
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                  <Text
                    key={day}
                    style={StyleSheet.flatten([
                      defaultStyles.weekDay,
                      customStyles.weekDay,
                    ])}
                  >
                    {day}
                  </Text>
                ))}
              </View>
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} style={defaultStyles.gridRow}>
                  {week.map((day) => {
                    const isToday = day.date.isSame(dayjs(), "day");
                    const isSelected =
                      selectedDate && day.date.isSame(selectedDate, "day");
                    const hasSchedule = Math.random() < 0.2;

                    return (
                      <TouchableOpacity
                        key={day.date.format("YYYY-MM-DD")}
                        onPress={() => handleDateSelect(day.date)}
                        style={StyleSheet.flatten([
                          defaultStyles.dateCell,
                          customStyles.dateCell,
                          !day.isCurrentMonth && defaultStyles.dimmedDate,
                          isToday && defaultStyles.today,
                          isSelected && defaultStyles.selectedDate,
                        ])}
                      >
                        <Text style={defaultStyles.dateText}>
                          {day.date.date()}
                        </Text>
                        {hasSchedule && (
                          <Text
                            style={StyleSheet.flatten([
                              defaultStyles.dot,
                              customStyles.dot,
                            ])}
                          >
                            •
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          );
        }}
      />
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    width: width * 0.9,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  monthTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    marginBottom: 5,
  },
  weekDay: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.85,
    marginBottom: 5,
  },
  dateCell: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  dateText: {
    fontSize: 16,
  },
  today: {
    backgroundColor: "#ffeb3b",
  },
  selectedDate: {
    backgroundColor: "#1976d2",
  },
  dimmedDate: {
    opacity: 0.3,
  },
  dot: {
    fontSize: 14,
    color: "red",
  },
});

export default MonthlyCalendar;
