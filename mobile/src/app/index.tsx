import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../features/auth/context/useAuth";
import LoginScreen from "../features/auth/screens/LoginScreen";
import HomeScreen from "../features/home/screens/HomeScreen";

export default function Index() {
  const { session, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  if (session !== null) {
    return <HomeScreen />;
  }

  return <LoginScreen />;
}
