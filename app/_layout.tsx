// app/_layout.tsx

import { ModalFeedbackProvider } from '@/contexts/ModalFeedbackContext'; // 2. E o nosso novo provider de modal
import { AuthProvider } from '@/routes/AuthContext'; // 1. Importe seu AuthProvider
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // 3. O AuthProvider DEVE abraçar tudo. Ele é a fonte de dados do usuário.
    <AuthProvider>
      {/* 4. O ModalFeedbackProvider vem em seguida. A ordem entre eles não importa muito nesse caso, mas ambos precisam estar aqui. */}
      <ModalFeedbackProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Todas as suas telas aqui dentro agora podem usar tanto o useAuth() quanto o useModalFeedback() */}
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* etc... */}
        </Stack>
      </ModalFeedbackProvider>
    </AuthProvider>
  )
}