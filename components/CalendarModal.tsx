import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TimePicker from './TimePicker';
import dayjs from 'dayjs';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ visible, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<'yearMonth' | 'hourMinute'>('yearMonth');

  const handleTimeConfirm = (date: dayjs.Dayjs) => {
    setSelectedDate(date);
    setTimePickerVisible(false);
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>날짜 선택</Text>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => {
            setPickerMode('yearMonth');
            setTimePickerVisible(true);
          }}
        >
          <Text style={styles.timeText}>
            {selectedDate.format('YYYY-MM')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => {
            setPickerMode('hourMinute');
            setTimePickerVisible(true);
          }}
        >
          <Text style={styles.timeText}>
            {selectedDate.format('HH:mm')}
          </Text>
        </TouchableOpacity>

        {isTimePickerVisible && (
          <TimePicker
            mode={pickerMode}
            initialDate={selectedDate}
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
    marginVertical: 5,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
