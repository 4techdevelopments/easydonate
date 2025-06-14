// app/_layout.tsx

import { ModalFeedbackProvider } from '@/contexts/ModalFeedbackContext';
import { AuthProvider } from '@/routes/AuthContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // 1. Providers globais no topo, uma única vez.
    <AuthProvider>
      <ModalFeedbackProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* 2. Declaramos os grupos de rotas aqui. */}
          <Stack.Screen name="(public)" />
          <Stack.Screen name="(auth)" />
          
          {/* O 'index' geralmente é a tela que decide para onde redirecionar 
            (ex: se o usuário está logado, vai para '(auth)/home', senão para '(public)/inicio'). 
            Deixá-lo aqui também está correto.
          */}
          <Stack.Screen name="index" />

        </Stack>
      </ModalFeedbackProvider>
    </AuthProvider>
  );
}
