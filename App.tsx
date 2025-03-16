import React from "react";
import { View, StyleSheet } from "react-native";
import MonthlyCalendar from "./components/MonthlyCalendar";

export default function App() {
  return (
    <View style={styles.container}>
      <MonthlyCalendar
        onDateSelect={(date) => console.log("선택한 날짜:", date)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
  },
});
