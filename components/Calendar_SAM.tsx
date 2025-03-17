// import React, { useState, useRef, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
// import dayjs from 'dayjs';

// const { height } = Dimensions.get('window');

// const generateMonthData = (date) => {
//   const startOfMonth = date.startOf('month');
//   const endOfMonth = date.endOf('month');
//   const startDay = startOfMonth.day();
//   const daysInMonth = endOfMonth.date();

//   let days = [];

//   // 이전 달 날짜 채우기
//   for (let i = startDay - 1; i >= 0; i--) {
//     days.push({
//       date: startOfMonth.subtract(i + 1, 'day'),
//       isCurrentMonth: false,
//     });
//   }

//   // 이번 달 날짜 채우기
//   for (let i = 1; i <= daysInMonth; i++) {
//     days.push({
//       date: startOfMonth.date(i),
//       isCurrentMonth: true,
//     });
//   }

//   // 다음 달 날짜 채우기
//   while (days.length % 7 !== 0) {
//     days.push({
//       date: endOfMonth.add(days.length % 7, 'day'),
//       isCurrentMonth: false,
//     });
//   }

//   // 주(week) 단위로 나누기
//   const weeks = [];
//   for (let i = 0; i < days.length; i += 7) {
//     weeks.push(days.slice(i, i + 7));
//   }

//   return weeks;
// };

// const Month = React.memo(({ month, selectedDate, onSelectDate }) => {
//   const weeks = generateMonthData(month);
//   return (
//     <View style={styles.monthContainer}>
//       <Text style={styles.monthTitle}>{month.format('YYYY년 MM월')}</Text>
//       <View style={styles.weekRow}>
//         {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
//           <Text key={day} style={styles.weekDay}>
//             {day}
//           </Text>
//         ))}
//       </View>
//       {weeks.map((week, weekIndex) => (
//         <View key={weekIndex} style={styles.weekRow}>
//           {week.map((day, dayIndex) => {
//             const isToday = day.date.isSame(dayjs(), 'day');
//             const isSelected = selectedDate && day.date.isSame(selectedDate, 'day');
//             return (
//               <TouchableOpacity
//                 key={dayIndex}
//                 style={[
//                   styles.dayCell,
//                   !day.isCurrentMonth && styles.dimmedDate,
//                   isToday && styles.today,
//                   isSelected && styles.selectedDate,
//                 ]}
//                 onPress={() => onSelectDate(day.date)}
//               >
//                 <Text style={styles.dayText}>{day.date.date()}</Text>
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       ))}
//     </View>
//   );
// });

// const InfiniteCalendar = () => {
//   const [currentMonth, setCurrentMonth] = useState(dayjs());
//   const [selectedDate, setSelectedDate] = useState(dayjs());
//   const listRef = useRef(null);

//   const months = [
//     currentMonth.subtract(1, 'month'),
//     currentMonth,
//     currentMonth.add(1, 'month'),
//   ];

//   const handleMomentumScrollEnd = useCallback(
//     (event) => {
//       const offsetY = event.nativeEvent.contentOffset.y;
//       const index = Math.round(offsetY / height);

//       if (index === 0) {
//         setCurrentMonth((prev) => prev.subtract(1, 'month'));
//         listRef.current.scrollToOffset({ offset: height, animated: false });
//       } else if (index === 2) {
//         setCurrentMonth((prev) => prev.add(1, 'month'));
//         listRef.current.scrollToOffset({ offset: height, animated: false });
//       }
//     },
//     []
//   );

//   const handleSelectDate = useCallback((date) => {
//     setSelectedDate(date);
//   }, []);

//   useEffect(() => {
//     listRef.current.scrollToOffset({ offset: height, animated: false });
//   }, []);

//   return (
//     <FlatList
//       ref={listRef}
//       data={months}
//       renderItem={({ item }) => (
//         <Month month={item} selectedDate={selectedDate} onSelectDate={handleSelectDate} />
//       )}
//       keyExtractor={(item) => item.format('YYYY-MM')}
//       pagingEnabled
//       showsVerticalScrollIndicator={false}
//       onMomentumScrollEnd={handleMomentumScrollEnd}
//       getItemLayout={(data, index) => ({
//         length: height,
//         offset: height * index,
//         index,
//       })}
//     />
//   );
// };

// const styles = StyleSheet.create({
//   monthContainer: {
//     height,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   monthTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   weekRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     width: '100%',
//   },
//   weekDay: {
//     flex: 1,
//     textAlign: 'center',
//     paddingVertical: 5,
//     fontWeight: 'bold',
//   },
//   dayCell: {
//     flex: 1,
//     height: 40,
