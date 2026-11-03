import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAuth } from "../../auth/context/useAuth";
import { router } from "expo-router";

export default function HomeScreen() {
  const { signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
    } catch {
      alert("Det lykkedes ikke at logge ud. Prøv igen.");
    }
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text>Du er logget ind.</Text>

      <Button mode="outlined" onPress={handleLogout}>
        Log ud
      </Button>
      <Button mode="contained" onPress={() => router.push("/activity")}>
        Start aktivitet
      </Button>
    </View>
  );
}
