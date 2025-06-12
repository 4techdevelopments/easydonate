// src/components/PhotoPickerModal.tsx (CORRIGIDO)

import Colors from "@/components/Colors";
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';


interface PhotoPickerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onPhotoSelected: (uri: string) => void;
}

const PhotoPickerModal: React.FC<PhotoPickerModalProps> = ({ isVisible, onClose, onPhotoSelected }) => {

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
            onClose(); // Fecha o modal
        }
    };

    const pickImageFromGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Desculpe, precisamos da permissão da galeria para isso funcionar!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            onPhotoSelected(result.assets[0].uri);
            onClose(); // Fecha o modal
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            style={styles.bottomModal}
        >
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>

                <TouchableOpacity style={[styles.modalButton]} onPress={takePhotoWithCamera}>
                    <Feather name="camera" size={20} color={Colors.ORANGE} />
                    <Text style={[styles.modalButtonText, {color: Colors.BLACK}]}>Câmera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButton]} onPress={pickImageFromGallery}>
                    <Feather name="image" size={20} color={Colors.ORANGE} />
                    <Text style={styles.modalButtonText}>Galeria</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButton]} onPress={onClose}>
                    <Feather name="trash-2" size={20} color={Colors.ORANGE} />
                    <Text style={styles.modalButtonText}>Excluir</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalButton, {backgroundColor: Colors.ORANGE, borderRadius: 30}]} onPress={onClose}>
                    <Text style={[styles.modalButtonText, { color: Colors.WHITE }]}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: Colors.INPUT_GRAY,
        borderRadius: 30,
        marginBottom: 15
    },

    modalButtonText: {
        marginLeft: 10,
        fontSize: 16,
    },
   
});

export default PhotoPickerModal;