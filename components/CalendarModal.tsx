import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
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

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>날짜 선택</Text>

          {/* 타임픽커 버튼 */}
          <TouchableOpacity style={styles.timeButton} onPress={() => setTimePickerVisible(true)}>
            <Text style={styles.timeText}>
              {selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "시간 선택"}
            </Text>
          </TouchableOpacity>

          {/* 타임픽커 */}
          <TimePicker
            visible={isTimePickerVisible}
            onClose={() => setTimePickerVisible(false)}
            onConfirm={handleTimeConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // 약간 어두운 배경
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
