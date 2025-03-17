import React, { useState } from "react";
import { View, Button, Modal, StyleSheet } from "react-native";
import CalendarModal from "./CalendarModal";

export default function CalendarScreen() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Button title="캘린더 열기" onPress={() => setIsVisible(true)} />
      <CalendarModal visible={isVisible} onClose={() => setIsVisible(false)} />
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
