// components/DisplayAvatar.tsx

import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/routes/AuthContext';
import Colors from './Colors';

export function DisplayAvatar() {
    // 1. O componente busca o usuário do mesmo jeito que as telas faziam
    const { usuario } = useAuth();

    // 2. A lógica de navegação também pode viver aqui
    const navigateToAccount = () => {
        router.push("/(auth)/conta");
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={navigateToAccount}>
                {usuario?.avatar ? (
                    // Se o usuário tem um avatar, mostra a imagem
                    <Image
                        source={{ uri: usuario.avatar }}
                        style={styles.profileImage}
                        resizeMode="cover"
                    />
                ) : (
                    // Senão, mostra o ícone padrão
                    <FontAwesome6 name="user-large" size={15} color={Colors.WHITE} />
                )}
            </TouchableOpacity>
        </View>
    );
}

// 3. Os estilos necessários para o avatar vêm junto com o componente
const styles = StyleSheet.create({
    container: {
        // Estilo do container principal, se necessário
    },
    touchable: {
        backgroundColor: Colors.ORANGE,
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Garante que a imagem não saia da borda arredondada
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
});