import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import CustomTimePicker from './CustomTimePicker';

const App = () => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="시간 선택" onPress={() => setPickerVisible(true)} />
      {selectedTime && <Text>선택된 시간: {selectedTime.toLocaleString()}</Text>}
      <CustomTimePicker
        visible={isPickerVisible}
        onClose={() => setPickerVisible(false)}
        onConfirm={(date) => setSelectedTime(date)}
      />
    </View>
  );
};

export default App;
