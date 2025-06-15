// app/(auth)/_layout.tsx

// O AuthProvider foi REMOVIDO daqui.
import { Stack } from "expo-router";

export default function AuthLayout() { // Renomeado para mais clareza
  return (
    // Agora o Stack é o componente principal, como deve ser.
    // Todas as telas aqui dentro vão usar o AuthProvider do layout raiz.
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="ongs" options={{ headerShown: false }} />
      <Stack.Screen name="doacoes" options={{ headerShown: false }} />
      <Stack.Screen name="configuracoes" options={{ headerShown: false }} />
      <Stack.Screen name="conta" options={{ headerShown: false }} />
      <Stack.Screen name="ongDetalhes" options={{ headerShown: false }} />
      <Stack.Screen name="addLocalizacoes" options={{ headerShown: false }} />
    </Stack>
  );
}
