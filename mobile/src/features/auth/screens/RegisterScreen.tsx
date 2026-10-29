import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { register } from "../api/authApi";
import { router } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setLoading(true);

    try {
      await register({ email, password });

      alert("Kontoen er oprettet. Du kan nu logge ind.");

      router.replace("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Oprettelse mislykkedes.";

      alert(message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text variant="headlineMedium">Opret konto</Text>
      <TextInput
        label="E-mail"
        mode="outlined"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        label="Password"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Text>
        Mindst 10 tegn med stort og lille bogstav, tal og specialtegn.
      </Text>
      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
      >
        {loading ? "Opretter konto…" : "Opret konto"}
      </Button>
    </View>
  );
}
