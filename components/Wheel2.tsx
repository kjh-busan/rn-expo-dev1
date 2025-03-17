import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import dayjs from 'dayjs';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

interface TimePickerProps {
  mode: 'yearMonth' | 'hourMinute';
  initialDate: dayjs.Dayjs;
  onClose: () => void;
  onConfirm: (date: dayjs.Dayjs) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ mode, initialDate, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleOutsideTouch = () => {
    onConfirm(selectedDate);
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTouch}>
      <Animated.View style={[styles.backgroundOverlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContent} pointerEvents="auto"> {/* 14. 타임픽커 조작 가능 */}
          <Text style={styles.selectedTimeText}>
            {mode === 'yearMonth' ? selectedDate.format('YYYY-MM') : selectedDate.format('HH:mm')}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  backgroundOverlay: {
    position: 'absolute', // 🔹 absolute 배치로 모달에 영향을 받지 않음
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }], // 중앙 정렬
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  selectedTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
