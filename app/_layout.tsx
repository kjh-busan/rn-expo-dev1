import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "홈 화면" }} />
      <Stack.Screen name="calendar" options={{ title: "캘린더" }} />
    </Stack>
  );
}
