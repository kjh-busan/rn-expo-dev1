import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

interface TimePickerProps {
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ onClose, onConfirm }) => {
  const [selectedHour, setSelectedHour] = useState(new Date().getHours());
  const [selectedMinute, setSelectedMinute] = useState(new Date().getMinutes());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleOutsideTouch = () => {
    const selectedTime = new Date();
    selectedTime.setHours(selectedHour);
    selectedTime.setMinutes(selectedMinute);
    onConfirm(selectedTime);
    onClose();
  };

  const renderPicker = (values: number[], selectedValue: number, setValue: (value: number) => void) => (
    <ScrollView
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
        setValue(values[index % values.length]);
      }}
    >
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
      {values.map((item) => (
        <View key={item} style={styles.pickerItemContainer}>
          <Text style={[styles.pickerItem, selectedValue === item && styles.selectedItem]}>
            {item < 10 ? `0${item}` : item}
          </Text>
        </View>
      ))}
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
    </ScrollView>
  );

  return (
    <TouchableWithoutFeedback onPress={handleOutsideTouch}>
      <Animated.View style={[styles.backgroundOverlay, { opacity: fadeAnim }]}>
        <View style={styles.modalContent}>
          <View style={styles.pickerContainer}>
            {renderPicker(Array.from({ length: 24 }, (_, i) => i), selectedHour, setSelectedHour)}
            {renderPicker(Array.from({ length: 60 }, (_, i) => i), selectedMinute, setSelectedMinute)}
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  picker: {
    width: 60,
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
