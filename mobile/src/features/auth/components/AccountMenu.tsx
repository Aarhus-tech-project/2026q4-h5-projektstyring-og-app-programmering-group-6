import { useState } from "react";
import { IconButton, Menu } from "react-native-paper";
import { useAuth } from "../context/useAuth";

export default function AccountMenu() {
  const [visible, setVisible] = useState(false);
  const { session, signOut } = useAuth();

  async function handleLogout() {
    setVisible(false);

    try {
      await signOut();
    } catch {
      alert("Det lykkedes ikke at logge ud. Prøv igen.");
    }
  }

  if (session === null) {
    return null;
  }

  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={
        <IconButton
          icon="dots-vertical"
          accessibilityLabel="Åbn kontomenu"
          onPress={() => setVisible(true)}
        />
      }
    >
      <Menu.Item leadingIcon="logout" title="Log ud" onPress={handleLogout} />
    </Menu>
  );
}
