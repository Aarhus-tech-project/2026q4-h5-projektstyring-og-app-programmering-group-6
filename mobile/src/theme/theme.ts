import { DarkTheme } from "expo-router/react-navigation";
import { MD3DarkTheme } from "react-native-paper";

export const appTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#FF9800",
    onPrimary: "#211A12",
    primaryContainer: "#633B00",
    onPrimaryContainer: "#FFDDB5",
    background: "#121212",
    surface: "#1E1E1E",
  },
};

export const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: appTheme.colors.primary,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    text: appTheme.colors.onSurface,
    border: appTheme.colors.outline,
    notification: appTheme.colors.error,
  },
};