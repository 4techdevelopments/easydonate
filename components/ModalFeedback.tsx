// components/ModalFeedback.tsx

import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import Colors from './Colors';

interface ModalFeedbackProps {
    isVisible: boolean;
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

const successImage = require('@/assets/images/mao-black.webp');
const errorImage = require('@/assets/images/mao-black-only.webp');
const successAnimation = { uri: "https://lottie.host/280b81e2-abb1-4e4d-ac5a-3067e6af2b09/DMsBmUq7EY.lottie" };
const errorAnimation = { uri: "https://lottie.host/aae5ce59-c8ee-4ca1-9dd7-6101965c9e71/LFGW2D0vie.lottie" };

export function ModalFeedback({ isVisible, type, message, onClose }: ModalFeedbackProps) {
    const isSuccess = type === 'success';

    const title = isSuccess ? 'Sucesso!' : 'Erro!';
    const imageSource = isSuccess ? successImage : errorImage;
    const animationSource = isSuccess ? successAnimation : errorAnimation;

    return (
        <Modal
            isVisible={isVisible}
            animationIn="fadeInUp"
            animationOut="slideOutDown"
            onBackdropPress={onClose}
            onBackButtonPress={onClose}
        >
            <View style={styles.modalContainer}>

                {/* --- ESTRUTURA VISUAL CORRIGIDA --- */}
                {/* Este container agora empilha os itens verticalmente */}
                <View style={styles.animationWrapper}>
                    {/* 1. A Animação Lottie vem primeiro */}
                    <LottieView
                        source={animationSource}
                        autoPlay
                        // O loop só acontece no sucesso, para o coração quebrado não ficar se repetindo
                        loop={isSuccess}
                        style={isSuccess ? styles.lottieSuccess : styles.lottieError}
                    />
                    {/* 2. A imagem da mão vem depois, ficando embaixo da animação */}
                    <Image
                        source={imageSource}
                        style={styles.handImage}
                        resizeMode="contain"
                    />
                </View>

                <Text style={[styles.title, { color: Colors.ORANGE }]}>
                    {title}
                </Text>

                <Text style={styles.message}>
                    {message}
                </Text>

                {/* O botão fica no final, apenas no caso de erro */}
                {!isSuccess && (
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Entendi</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
}

// --- ESTILOS CORRIGIDOS E OTIMIZADOS ---
const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 22,
        paddingVertical: 25,
        borderRadius: 15,
        alignItems: 'center',
    },
    animationWrapper: {
        // Este container não precisa de altura fixa, ele se ajusta ao conteúdo
        alignItems: 'center',
        justifyContent: 'center',
    },
    lottieSuccess: {
        width: 150,
        height: 150,
        position: 'absolute',
        bottom: 40,
        right: -10 ,
    },
    lottieError: {
        width: 100,
        height: 80,
        position: 'absolute',
        bottom: 8,
        right: 0 ,
    },
    handImage: {
        width: 100,
        height: 70,
    },
    title: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 8, // Espaçamento reduzido
    },
    message: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        textAlign: 'center',
        marginBottom: 20, // Espaçamento reduzido
        color: Colors.BLACK,
        paddingHorizontal: 10,
    },
    closeButton: {
        backgroundColor: Colors.ORANGE,
        paddingVertical: 12,
        paddingHorizontal: 45,
        borderRadius: 30,
    },
    closeButtonText: {
        color: Colors.WHITE,
        fontFamily: 'Montserrat',
        fontSize: 14,
    },
});