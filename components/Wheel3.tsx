import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ visible, onClose, onConfirm }) => {
  const currentDate = new Date();
  const initialYear = currentDate.getFullYear();
  
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [selectedHour, setSelectedHour] = useState(currentDate.getHours());

  const [yearRange, setYearRange] = useState({
    start: initialYear - 100,
    end: initialYear + 100,
  });

  const years = useMemo(() => {
    const arr = [];
    for (let i = yearRange.start; i <= yearRange.end; i++) {
      arr.push(i);
    }
    return arr;
  }, [yearRange]);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const scrollRefs = {
    year: useRef<ScrollView>(null),
    month: useRef<ScrollView>(null),
    day: useRef<ScrollView>(null),
    hour: useRef<ScrollView>(null),
  };

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth - 1, selectedDay, selectedHour);
    onConfirm(selectedDate);
    onClose();
  };

  const handleYearScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const newYear = years[index];

    if (newYear <= yearRange.start + 10) {
      setYearRange({ start: Math.max(1, yearRange.start - 100), end: yearRange.end });
    } else if (newYear >= yearRange.end - 10) {
      setYearRange({ start: yearRange.start, end: Math.min(9999, yearRange.end + 100) });
    }
    
    setSelectedYear(newYear);
  };

  const handleScrollEnd = (setValue: (value: number) => void, values: number[]) => (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT) % values.length;
    setValue(values[index]);
  };

  const renderLoopedPicker = (
    items: number[],
    selectedValue: number,
    setValue: (value: number) => void,
    ref: React.RefObject<ScrollView>,
    handleScrollEndCallback?: (event: any) => void
  ) => {
    const loopedItems = [...items, ...items, ...items];
    return (
      <ScrollView
        ref={ref}
        style={styles.picker}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEndCallback ?? handleScrollEnd(setValue, items)}
        contentOffset={{ y: items.length * ITEM_HEIGHT }}
      >
        <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
        {loopedItems.map((item, index) => (
          <View key={index} style={styles.pickerItemContainer}>
            <Text style={[styles.pickerItem, selectedValue === item && styles.selectedItem]}>{item}</Text>
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
              <Text style={styles.cancelButton}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.title}>시간 선택</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>확인</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectedTimeText}>
            {selectedYear}년 {selectedMonth}월 {selectedDay}일 {selectedHour}시
          </Text>

          <View style={styles.pickerContainer}>
            {renderLoopedPicker(years, selectedYear, setSelectedYear, scrollRefs.year, handleYearScrollEnd)}
            {renderLoopedPicker(months, selectedMonth, setSelectedMonth, scrollRefs.month)}
            {renderLoopedPicker(days, selectedDay, setSelectedDay, scrollRefs.day)}
            {renderLoopedPicker(hours, selectedHour, setSelectedHour, scrollRefs.hour)}
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cancelButton: {
    color: '#FF3B30',
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  selectedTimeText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  picker: {
    width: SCREEN_WIDTH * 0.2,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItem: {
    fontSize: 18,
    color: '#888',
  },
  selectedItem: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
});
