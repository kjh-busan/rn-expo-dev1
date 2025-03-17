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
  visible: boolean;
  mode: "yearMonth" | "hourMinute"; // ✅ mode 추가
  initialDate: dayjs.Dayjs; // ✅ 타입 변경 (Date → dayjs.Dayjs)
  onClose: () => void;
  onConfirm: (date: dayjs.Dayjs) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  mode,
  initialDate,
  onClose,
  onConfirm,
}) => {
  const [selectedTime, setSelectedTime] = useState(initialDate);
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
    onConfirm(selectedTime);
    onClose();
  };

  const renderPicker = (
    values: number[],
    selectedValue: number,
    setValue: (value: number) => void,
    type: "year" | "month" | "hour" | "minute"
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

        setSelectedTime((prevTime) =>
          type === "year"
            ? prevTime.year(newValue)
            : type === "month"
            ? prevTime.month(newValue - 1)
            : type === "hour"
            ? prevTime.hour(newValue)
            : prevTime.minute(newValue)
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
    <Modal transparent visible={visible} animationType="slide">
      <TouchableOpacity
        style={styles.backgroundOverlay}
        activeOpacity={1}
        onPress={handleOutsideTouch}
      >
        <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
          <View style={styles.pickerContainer}>
            {mode === "yearMonth" ? (
              <>
                {renderPicker(
                  Array.from(
                    { length: 100 },
                    (_, i) => dayjs().year() - 50 + i
                  ),
                  selectedTime.year(),
                  (year) => setSelectedTime(selectedTime.year(year)),
                  "year"
                )}
                {renderPicker(
                  Array.from({ length: 12 }, (_, i) => i + 1),
                  selectedTime.month() + 1,
                  (month) => setSelectedTime(selectedTime.month(month - 1)),
                  "month"
                )}
              </>
            ) : (
              <>
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
              </>
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
