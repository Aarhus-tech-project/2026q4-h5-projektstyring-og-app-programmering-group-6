import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../features/auth/context/AuthProvider";

export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "LøbeApp" }} />
          <Stack.Screen name="register" options={{ title: "LøbeApp" }} />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
