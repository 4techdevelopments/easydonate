// components/LegalModal.tsx

import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import Colors from './Colors';
import MarkdownText from './MarkdownText';

interface LegalModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
// Aumentamos um pouco a altura para dar mais espaço para a rolagem
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.80; 

const LegalModal: React.FC<LegalModalProps> = ({ isVisible, onClose, title, content }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    // Animação de subida quando o modal se torna visível
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    }
  }, [isVisible, translateY]);

  const handleClose = () => {
    'worklet';
    // Animação de descida para fechar o modal
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    // Chama a função onClose do React após a animação terminar
    runOnJS(setTimeout)(onClose, 300);
  };

  // Gesto de arrastar (pan) que será aplicado APENAS no cabeçalho
  const panGesture = Gesture.Pan()
    .onChange((event) => {
      // Permite arrastar o modal para baixo, mas não para cima
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd(() => {
      // Se arrastou mais de 1/4 da altura, fecha o modal
      if (translateY.value > MODAL_HEIGHT / 4) {
        handleClose();
      } else {
        // Senão, volta à posição inicial com efeito elástico
        translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
            {/* O Animated.View agora engloba toda a "gaveta" */}
            <Animated.View 
              style={[styles.modalContentWrapper, animatedStyle]}
              // Impede que o clique na "gaveta" feche o modal
              onStartShouldSetResponder={() => true} 
            >
              {/* 1. O GestureDetector agora envolve APENAS o cabeçalho */}
              <GestureDetector gesture={panGesture}>
                <View>
                  <View style={styles.handleContainer}>
                    <View style={styles.handle} />
                  </View>
                  <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                      <Feather name="x" size={24} color={Colors.GRAY} />
                    </TouchableOpacity>
                  </View>
                </View>
              </GestureDetector>

              {/* 2. O ScrollView fica FORA do GestureDetector */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                bounces={false}
              >
                <Image source={require("../assets/images/logo-easy-donate-black.webp")} style={styles.logoImage} />
                <MarkdownText content={content} />
              </ScrollView>
            </Animated.View>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
};


const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContentWrapper: {
        height: MODAL_HEIGHT,
        width: '100%',
        backgroundColor: Colors.WHITE,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        overflow: 'hidden', // Garante que o conteúdo não vaze das bordas arredondadas
    },
    handleContainer: {
        paddingTop: 15,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#CCC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 15,
        paddingTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        color: Colors.ORANGE,
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 15,
        padding: 5,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
    },
    logoImage: {
        width: 150,
        height: 43,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 25,
    },
});


export default LegalModal;