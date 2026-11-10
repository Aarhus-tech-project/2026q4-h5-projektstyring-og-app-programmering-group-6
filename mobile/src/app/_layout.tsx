import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../features/auth/context/AuthProvider";
import { SQLiteProvider } from "expo-sqlite";
import { initializeDatabase } from "../data/initializeDatabase";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { appTheme, navigationTheme } from "../theme/theme";
import AccountMenu from "../features/auth/components/AccountMenu";

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  return (
    <ThemeProvider value={navigationTheme}>
      <PaperProvider theme={appTheme}>
        <StatusBar style="light" />

        <SQLiteProvider databaseName="loebeapp.db" onInit={initializeDatabase}>
          <AuthProvider>
            <Stack>
              <Stack.Screen
                name="index"
                options={{
                  title: "LøbeApp",
                  headerRight: () => <AccountMenu />,
                }}
              />
              <Stack.Screen name="register" options={{ title: "LøbeApp" }} />
              <Stack.Screen name="activity" options={{ headerShown: false }} />
            </Stack>
          </AuthProvider>
        </SQLiteProvider>
      </PaperProvider>
    </ThemeProvider>
  );
}
