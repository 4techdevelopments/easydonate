// components/LegalModal.tsx

import { Feather } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Colors from './Colors';
import MarkdownText from './MarkdownText';

interface LegalModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.60;

const LegalModal: React.FC<LegalModalProps> = ({ isVisible, onClose, title, content }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
    }
  }, [isVisible]);

  const handleClose = () => {
    'worklet';
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
    runOnJS(setTimeout)(onClose, 250);
  };

  // Pan gesture para arrastar o modal para baixo
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      // Só permite arrastar para baixo
      if (event.translationY >= 0) {
        translateY.value = context.value.y + event.translationY;
      }
    })
    .onEnd((event) => {
      const shouldClose = translateY.value > MODAL_HEIGHT / 4 || event.velocityY > 800;
      
      if (shouldClose) {
        handleClose();
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalOverlay}>
          <Pressable 
            style={styles.overlayPressable} 
            onPress={handleClose}
          />
          
          <Animated.View style={[styles.modalContentWrapper, animatedStyle]}>
            {/* Header arrastável com GestureDetector */}
            <GestureDetector gesture={panGesture}>
              <View style={styles.draggableHeader}>
                <View style={styles.handleContainer}>
                  <View style={styles.handle} />
                </View>
                <View style={styles.header}>
                  <Text style={styles.title}>{title}</Text>
                  <TouchableOpacity 
                    onPress={handleClose} 
                    style={styles.closeButton}
                    activeOpacity={0.7}
                  >
                    <Feather name="x" size={24} color={Colors.GRAY} />
                  </TouchableOpacity>
                </View>
              </View>
            </GestureDetector>

            {/* ScrollView livre de conflitos */}
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={true}
              scrollEventThrottle={16}
              bounces={true}
              alwaysBounceVertical={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
            >
              <Image
                source={require('../assets/images/logo-easy-donate-black.webp')}
                style={styles.logoImage}
              />
              <MarkdownText content={content} />
            </ScrollView>
          </Animated.View>
        </View>
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
  overlayPressable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: MODAL_HEIGHT,
  },
  modalContentWrapper: {
    height: MODAL_HEIGHT,
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
  },
  draggableHeader: {
    // Container que engloba handle + header para o gesture
  },
  handleContainer: {
    paddingTop: 15,
    paddingBottom: 5,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCC',
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  title: {
    color: Colors.ORANGE,
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    minHeight: MODAL_HEIGHT * 0.8,
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