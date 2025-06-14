// app/index.tsx

import EasyDonateSvg from '@/components/easyDonateSvg';
import { useAuth } from '@/routes/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Colors from '../components/Colors';

export default function Index() {
  // 1. Pegamos o estado de autenticação e o estado de carregamento do nosso "gerente"
  const { isAuthenticated, loading } = useAuth();

  // 2. Enquanto o AuthContext está verificando o token no SecureStore,
  //    mostramos uma tela de carregamento. Isso evita o "flicker" (piscada) na tela.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.BG }}>
        <EasyDonateSvg />
      </View>
    );
  }

  // 3. Quando o carregamento termina, verificamos o resultado.
  //    Se o usuário está autenticado, o componente Redirect do Expo Router
  //    cuida do redirecionamento para a home.
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  // 4. Se não estiver autenticado, redireciona para a tela de início pública.
  return <Redirect href="/inicio" />;
}

// Não precisamos de nenhum estilo complexo aqui, pois a tela só mostra
// o loading ou redireciona.

