import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import dayjs from "dayjs";

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

interface TimePickerProps {
  mode: "yearMonth" | "hourMinute";
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: dayjs.Dayjs) => void;
  initialDate: dayjs.Dayjs;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedTime, setSelectedTime] = useState(dayjs()); // ✅ dayjs로 시간 관리
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleOutsideTouch = () => {
    onConfirm(selectedTime); // ✅ dayjs 객체 반환
    onClose();
  };

  const renderPicker = (
    values: number[],
    selectedValue: number,
    setValue: (value: number) => void,
    type: "hour" | "minute"
  ) => (
    <ScrollView
      style={styles.picker}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => {
        const index = Math.round(
          event.nativeEvent.contentOffset.y / ITEM_HEIGHT
        );
        const newValue = values[index % values.length];

        // ✅ dayjs 업데이트 방식 변경
        setSelectedTime((prevTime) =>
          type === "hour" ? prevTime.hour(newValue) : prevTime.minute(newValue)
        );
      }}
    >
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
      {values.map((item) => (
        <View key={item} style={styles.pickerItemContainer}>
          <Text
            style={[
              styles.pickerItem,
              selectedValue === item && styles.selectedItem,
            ]}
          >
            {item < 10 ? `0${item}` : item}
          </Text>
        </View>
      ))}
      <View style={{ height: ITEM_HEIGHT * ((VISIBLE_ITEMS - 1) / 2) }} />
    </ScrollView>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.backgroundOverlay}
        activeOpacity={1}
        onPress={handleOutsideTouch}
      >
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <View style={styles.pickerContainer}>
            {renderPicker(
              Array.from({ length: 24 }, (_, i) => i),
              selectedTime.hour(),
              (hour) => setSelectedTime(selectedTime.hour(hour)),
              "hour"
            )}
            {renderPicker(
              Array.from({ length: 60 }, (_, i) => i),
              selectedTime.minute(),
              (minute) => setSelectedTime(selectedTime.minute(minute)),
              "minute"
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default TimePicker;

const styles = StyleSheet.create({
  backgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // 배경을 어둡게 처리
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    width: "80%",
    alignItems: "center",
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  picker: {
    width: 60,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  pickerItemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItem: {
    fontSize: 18,
    color: "#888",
  },
  selectedItem: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
});
