import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from './TimePicker';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onClose }) => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  const handleTimeConfirm = (date: Date) => {
    setSelectedTime(date);
    setTimePickerVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>날짜 선택</Text>

        {/* 타임픽커 버튼 */}
        <TouchableOpacity style={styles.timeButton} onPress={() => setTimePickerVisible(true)}>
          <Text style={styles.timeText}>
            {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "시간 선택"}
          </Text>
        </TouchableOpacity>

        {/* 타임픽커 - absolute 배치 */}
        {isTimePickerVisible && (
          <TimePicker
            onClose={() => setTimePickerVisible(false)}
            onConfirm={handleTimeConfirm}
          />
        )}
      </View>
    </View>
  );
};

export default CalendarModal;

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
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
