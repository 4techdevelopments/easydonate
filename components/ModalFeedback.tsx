// components/ModalFeedback.tsx

import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

import Colors from './Colors';

// --- INTERFACE ATUALIZADA ---
interface ModalFeedbackProps {
    isVisible: boolean;
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
    title?: string; // 1. Adicionada a nova propriedade opcional 'title'
}

const successImage = require('@/assets/images/mao-black.webp');
const errorImage = require('@/assets/images/mao-black-only.webp');
const successAnimation = { uri: "https://lottie.host/280b81e2-abb1-4e4d-ac5a-3067e6af2b09/DMsBmUq7EY.lottie" };
const errorAnimation = { uri: "https://lottie.host/aae5ce59-c8ee-4ca1-9dd7-6101965c9e71/LFGW2D0vie.lottie" };

// 2. O componente agora recebe a nova prop 'title'
export function ModalFeedback({ isVisible, type, message, onClose, title }: ModalFeedbackProps) {
    const isSuccess = type === 'success';

    // 3. Lógica do título atualizada: usa o título customizado se ele existir, senão usa o padrão.
    const finalTitle = title || (isSuccess ? 'Sucesso!' : 'Ops... Algo deu errado!');
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
                <View style={styles.animationWrapper}>
                    <LottieView
                        source={animationSource}
                        autoPlay
                        loop={isSuccess}
                        style={isSuccess ? styles.lottieSuccess : styles.lottieError}
                    />
                    <Image
                        source={imageSource}
                        style={styles.handImage}
                        resizeMode="contain"
                    />
                </View>

                {/* 4. Usando o título final (customizado ou padrão) */}
                <Text style={[styles.title, { color: Colors.ORANGE }]}>
                    {finalTitle}
                </Text>

                <Text style={styles.message}>
                    {message}
                </Text>

                {!isSuccess && (
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Entendi</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
}

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 22,
        paddingVertical: 25,
        borderRadius: 15,
        alignItems: 'center',
    },
    animationWrapper: {
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
        marginBottom: 8,
    },
    message: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        textAlign: 'center',
        marginBottom: 20,
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
