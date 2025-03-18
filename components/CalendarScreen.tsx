import React, { useState } from "react";
import { View, Button, Modal, StyleSheet } from "react-native";
import CalendarModal from "./CalendarModal";
// import TimePicker from "./Wheel2";
import dayjs, { Dayjs } from "dayjs";
import CustomTimePicker from "./Wheel3";
// import CustomTimePicker from "./Wheel2";
// import TimePicker from "./Wheel-up";
// import TimePicker from "./Wheel";
// import TimePicker from "./Wheel4";

export default function CalendarScreen() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="OPEN Calendar" onPress={() => setIsVisible(true)} />
      {/* <CalendarModal visible={isVisible} onClose={() => setIsVisible(false)} /> */}
      <CustomTimePicker
        visible={isVisible}
        onClose={function (): void {
          console.log("########### close");
          setIsVisible(false);
        }}
        onConfirm={function (selectedDate: Dayjs): void {
          console.log(selectedDate.format("YYYY-MM-DD HH:mm:ss"));
          setIsVisible(false);
          // throw new Error("Function not implemented.");
        }}
        mode={"yearMonth"}
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
