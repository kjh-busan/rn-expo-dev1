import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const TIME_VALUES = Array.from({ length: 24 }, (_, i) => `${i}:00`); // 0:00 ~ 23:00

const TimePicker = () => {
  const [selectedTime, setSelectedTime] = useState(TIME_VALUES[0]);
  const translateY = useSharedValue(0);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    translateY.value = withSpring(-50, { damping: 10, stiffness: 100 });
    setTimeout(() => {
      translateY.value = withSpring(0, { damping: 10, stiffness: 100 });
    }, 300);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>선택한 시간: {selectedTime}</Text>
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <FlatList
          data={TIME_VALUES}
          keyExtractor={(item) => item}
          horizontal
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.timeButton,
                selectedTime === item && styles.selectedButton,
              ]}
              onPress={() => handleTimeSelect(item)}
            >
              <Text
                style={[
                  styles.timeText,
                  selectedTime === item && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingVertical: 10,
    width: width * 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContent: {
    alignItems: "center",
  },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#1976D2",
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedText: {
    color: "#FFFFFF",
  },
});

export default TimePicker;
