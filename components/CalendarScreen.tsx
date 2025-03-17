import React, { useState } from "react";
import { View, Button, Modal, StyleSheet } from "react-native";
import CalendarModal from "./CalendarModal";
// import TimePicker from "./Wheel2";
import dayjs, { Dayjs } from "dayjs";
import CustomTimePicker from "./Wheel3";
import TimePicker from "./Wheel4";
// import CustomTimePicker from "./Wheel2";
// import TimePicker from "./Wheel-up";
// import TimePicker from "./Wheel";
// import TimePicker from "./Wheel4";

export default function CalendarScreen() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="캘린더 열기" onPress={() => setIsVisible(true)} />
      {/* <CalendarModal visible={isVisible} onClose={() => setIsVisible(false)} /> */}
      {/* <CustomTimePicker
        visible={isVisible}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onConfirm={function (date: Date): void {
          throw new Error("Function not implemented.");
        }}
      /> */}
      <TimePicker
        visible={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onConfirm={function (date: Date): void {
          throw new Error("Function not implemented.");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
