// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
// import DateTimePicker from 'react-native-modal-datetime-picker';
// import WheelPickerExpo from 'react-native-wheel-picker-expo';

// interface TimePickerModalProps {
//   visible: boolean;
//   onClose: () => void;
//   onConfirm: (date: Date) => void;
// }

// const TimePickerModal: React.FC<TimePickerModalProps> = ({ visible, onClose, onConfirm }) => {
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedHour, setSelectedHour] = useState(new Date().getHours());
//   const [selectedMinute, setSelectedMinute] = useState(0);

//   const years = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i); // 현재 연도 ±10년
//   const months = Array.from({ length: 12 }, (_, i) => i + 1);
//   const hours = Array.from({ length: 24 }, (_, i) => i);
//   const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 5분 단위

//   const handleConfirm = () => {
//     const selectedDate = new Date(selectedYear, selectedMonth - 1, 1, selectedHour, selectedMinute);
//     onConfirm(selectedDate);
//     onClose();
//   };

//   return (
//     <Modal transparent visible={visible} animationType="fade">
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           {/* 헤더 */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={onClose}>
//               <Text style={styles.cancelButton}>취소</Text>
//             </TouchableOpacity>
//             <Text style={styles.title}>시간 선택</Text>
//             <TouchableOpacity onPress={handleConfirm}>
//               <Text style={styles.confirmButton}>확인</Text>
//             </TouchableOpacity>
//           </View>

//           {/* 휠 피커 */}
//           <View style={styles.pickerContainer}>
//             <WheelPickerExpo
//               items={years.map((y) => ({ label: `${y}년`, value: y }))}
//               selectedValue={selectedYear}
//               onChange={setSelectedYear}
//             />
//             <WheelPickerExpo
//               items={months.map((m) => ({ label: `${m}월`, value: m }))}
//               selectedValue={selectedMonth}
//               onChange={setSelectedMonth}
//             />
//             <WheelPickerExpo
//               items={hours.map((h) => ({ label: `${h}시`, value: h }))}
//               selectedValue={selectedHour}
//               onChange={setSelectedHour}
//             />
//             <WheelPickerExpo
//               items={minutes.map((m) => ({ label: `${m}분`, value: m }))}
//               selectedValue={selectedMinute}
//               onChange={setSelectedMinute}
//             />
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// export default TimePickerModal;

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.4)', // 반투명 배경
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     paddingBottom: 20,
//     overflow: 'hidden',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   cancelButton: {
//     color: '#FF3B30',
//     fontSize: 16,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   confirmButton: {
//     color: '#007AFF',
//     fontSize: 16,
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//   },
// });
