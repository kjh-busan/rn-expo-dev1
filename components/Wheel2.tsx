import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const ITEM_HEIGHT = 40; // 한 항목의 높이
const VISIBLE_ITEMS = 5; // 화면에 보이는 아이템 수
const SCREEN_WIDTH = Dimensions.get('window').width;

interface CustomTimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ visible, onClose, onConfirm }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(0);

  const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const selectedDate = new Date(selectedYear, selectedMonth - 1, 1, selectedHour, selectedMinute);
    onConfirm(selectedDate);
    onClose();
  };

  // 스크롤이 멈췄을 때 중앙 값 설정
  const handleScrollEnd = (setValue: (value: number) => void, values: number[]) => (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setValue(values[index]);
  };

  const renderPicker = (items: number[], selectedValue: number, setValue: (value: number) => void) => (
    <ScrollView
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT} // 한 번에 하나씩 이동
      decelerationRate="fast"
      onMomentumScrollEnd={handleScrollEnd(setValue, items)}
    >
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
      {items.map((item) => (
        <View key={item} style={styles.pickerItemContainer}>
          <Text style={[styles.pickerItem, selectedValue === item && styles.selectedItem]}>
            {item}
          </Text>
        </View>
      ))}
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
    </ScrollView>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelButton}>취소</Text>
            </TouchableOpacity>
            <Text style={styles.title}>시간 선택</Text>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmButton}>확인</Text>
            </TouchableOpacity>
          </View>

          {/* 현재 선택된 시간 표시 */}
          <Text style={styles.selectedTimeText}>
            {selectedYear}년 {selectedMonth}월 {selectedHour}시 {selectedMinute}분
          </Text>

          {/* 휠 피커 */}
          <View style={styles.pickerContainer}>
            {renderPicker(years, selectedYear, setSelectedYear)}
            {renderPicker(months, selectedMonth, setSelectedMonth)}
            {renderPicker(hours, selectedHour, setSelectedHour)}
            {renderPicker(minutes, selectedMinute, setSelectedMinute)}
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
