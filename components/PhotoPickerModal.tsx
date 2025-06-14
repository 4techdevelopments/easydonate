// components/PhotoPickerModal.tsx

import Colors from "@/components/Colors";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';

// --- INTERFACE ATUALIZADA ---
// Adicionamos a nova propriedade opcional 'showDeleteOption'.
interface PhotoPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onPhotoSelected: (uri: string) => void;
    onDelete: () => void;
    showDeleteOption?: boolean; // Nova propriedade
}

// --- COMPONENTE ATUALIZADO ---
// Desestruturamos a nova propriedade 'showDeleteOption' e definimos seu valor padrão como 'false'.
const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({ 
    isVisible, 
    onClose, 
    onPhotoSelected, 
    onDelete, 
    showDeleteOption = false 
}) => {

    // --- LÓGICA DA CÂMERA (sem alterações) ---
    const takePhotoWithCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Desculpe, precisamos da permissão da câmera para isso funcionar!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            onPhotoSelected(result.assets[0].uri);
            onClose(); 
        }
    };

    // --- LÓGICA DA GALERIA (sem alterações) ---
    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Desculpe, precisamos da permissão da galeria para isso funcionar!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Usando a enumeração correta
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            onPhotoSelected(result.assets[0].uri);
            onClose();
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.bottomModal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropTransitionOutTiming={0}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>

                <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
                    <Feather name="camera" size={20} color={Colors.ORANGE} />
                    <Text style={styles.modalButtonText}>Câmera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
                    <Feather name="image" size={20} color={Colors.ORANGE} />
                    <Text style={styles.modalButtonText}>Galeria</Text>
                </TouchableOpacity>

                {/* --- RENDERIZAÇÃO CONDICIONAL --- */}
                {/* O botão de exclusão agora só aparece se 'showDeleteOption' for 'true'. */}
                {showDeleteOption && (
                    <TouchableOpacity style={{ width: '100%' }} onPress={onDelete}>
                        <LinearGradient
                            {...Colors.SUNSET_GRADIENT}
                            style={styles.baseButton}
                        >
                            <Feather name="trash-2" size={20} color={Colors.WHITE} />
                            <Text style={[styles.modalButtonText, { color: Colors.WHITE }]}>Excluir</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={[styles.modalButtonText, { color: Colors.BLACK, marginLeft: 0 }]}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

// --- ESTILOS (com uma pequena adição para o botão de cancelar) ---
const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        paddingHorizontal: 22,
        paddingTop: 22,
        paddingBottom: 10,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: "Montserrat-Bold",
        marginBottom: 20,
        color: Colors.BLACK,
    },
    baseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'center',
        borderRadius: 30,
        marginBottom: 15,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'center',
        borderRadius: 30,
        marginBottom: 15,
        backgroundColor: Colors.INPUT_GRAY,
    },
    modalButtonText: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: "Montserrat",
        color: Colors.BLACK, // Cor padrão para os botões
    },
    // Adicionado um estilo específico para o botão de cancelar para remover a margem e o fundo
    cancelButton: {
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default PhotoPickerModal;
