import { AuthProvider } from "@/routes/AuthContext";
import { Stack } from "expo-router";

export default function StackLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="home"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ongs"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="doacoes"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="configuracoes"
          options={{ headerShown: false }}
        />
      </Stack>
    </AuthProvider>
  )
}