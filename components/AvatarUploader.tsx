// components/AvatarUploader.tsx

import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import api from '@/api/axios';
import { useAuth } from '@/routes/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from './Colors';
import PhotoPickerModal from './PhotoPickerModal';

// A importação do ImageManipulator e MaterialIcons foi removida.

const IMG_BB_API_KEY = "0064c7ca5d35d2ff095d09220c71f750";

interface AvatarUploaderProps {
    size?: number;
}

export function AvatarUploader({ size = 60 }: AvatarUploaderProps) {
    const { usuario, atualizarUsuario } = useAuth();
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPickerModalVisible, setPickerModalVisible] = useState(false);
    const [isFullViewModalVisible, setFullViewModalVisible] = useState(false);
    
    // A lógica de fetch, upload e delete permanece a mesma.
    const fetchUsuarioAtualizado = useCallback(async () => {
        if (!usuario?.idUsuario) return;
        try {
            const response = await api.get(`/Usuario/${usuario.idUsuario}`);
            if (response.status === 200 && response.data.avatar !== usuario.avatar) {
                atualizarUsuario({ avatar: response.data.avatar });
            }
        } catch (error) {
            console.warn("Erro ao buscar dados atualizados do usuário:", error);
        }
    }, [usuario?.idUsuario, usuario?.avatar, atualizarUsuario]);

    useFocusEffect(
        useCallback(() => {
            fetchUsuarioAtualizado();
        }, [fetchUsuarioAtualizado])
    );

    const handleUpload = async (uri: string) => {
        setPickerModalVisible(false);
        setFullViewModalVisible(false);
        setPreviewUri(uri);
        setIsUploading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            const formData = new FormData();
            formData.append("image", base64);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const uploadData = await res.json();
            const uploadedUrl = uploadData.data?.url;
            if (!uploadedUrl) throw new Error("Falha ao obter URL da imagem do ImgBB.");
            // antes: /Usuario/Upload/${usuario.idUsuario}
            await api.put(`/Upload/Avatar/${usuario.idUsuario}`, {
                idUsuario: usuario.idUsuario,
                avatar: uploadedUrl
            });
            atualizarUsuario({ avatar: uploadedUrl });
        } catch (error) {
            console.warn("Erro no processo de upload:", error);
            Alert.alert("Erro de Upload", "Não foi possível enviar sua foto. Tente novamente.");
        } finally {
            setIsUploading(false);
            setPreviewUri(null);
        }
    };

    const handleDelete = async () => {
        setPickerModalVisible(false);
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua foto? Essa ação é irreversível!",
            [
                { text: "Não", style: "cancel" },
                {
                    text: "Sim, Excluir",
                    onPress: async () => {
                        setIsUploading(true);
                        try {
                            await api.put(`/Upload/Avatar/${usuario.idUsuario}`, {
                                idUsuario: usuario.idUsuario,
                                avatar: null
                            });
                            atualizarUsuario({ avatar: null });
                        } catch (error) {
                            console.warn("Erro ao excluir a foto:", error);
                            Alert.alert("Erro", "Não foi possível excluir a foto. Tente novamente.");
                        } finally {
                            setIsUploading(false);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const handleLongPress = () => {
        if (usuario?.avatar) {
            setFullViewModalVisible(true);
        }
    };

    const handleEditPress = () => {
        setFullViewModalVisible(false);
        setPickerModalVisible(true);
    };

    // A função 'handleCropPress' foi removida.

    const styles = useMemo(() => getDynamicStyles(size), [size]);

    return (
        <>
            <TouchableOpacity
                style={styles.profileImageContainer}
                onPress={() => setPickerModalVisible(true)}
                onLongPress={handleLongPress}
                delayLongPress={500}
                disabled={isUploading}
            >
                <View style={styles.imgContainer} >
                    {previewUri || usuario?.avatar ? (
                        <Image
                            source={{ uri: previewUri || usuario?.avatar }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <FontAwesome6 name="user-large" size={size * 0.4} color={Colors.WHITE} />
                    )}
                    {isUploading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color={Colors.WHITE} />
                        </View>
                    )}
                </View>
                <View style={styles.editIconOverlay}>
                    <FontAwesome6 name="camera" size={size * 0.13} color={Colors.BG} />
                </View>
            </TouchableOpacity>

            <PhotoPickerModal
                isVisible={isPickerModalVisible}
                onClose={() => setPickerModalVisible(false)}
                onPhotoSelected={handleUpload}
                onDelete={handleDelete}
                showDeleteOption={!!usuario?.avatar}
            />

            <Modal
                visible={isFullViewModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setFullViewModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.fullScreenModalBackground}
                    activeOpacity={1}
                    onPress={() => setFullViewModalVisible(false)}
                >
                    <TouchableWithoutFeedback>
                        <Image
                            source={{ uri: usuario?.avatar || '' }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback>
                        {/* O container de botões agora tem apenas um botão */}
                        <View style={styles.controlButtonsContainer}>
                            <TouchableOpacity onPress={handleEditPress}>
                                <LinearGradient
                                    {...Colors.SUNSET_GRADIENT}
                                    style={styles.gradientButton}
                                >
                                    <FontAwesome6 name="camera" size={20} color={Colors.WHITE} />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </>
    );
};

const getDynamicStyles = (size: number) => StyleSheet.create({
    profileImageContainer: {
        position: 'relative',
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        backgroundColor: Colors.ORANGE,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    editIconOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.ORANGE,
        borderRadius: size * 0.3,
        padding: size * 0.08,
        borderWidth: Math.max(1, size * 0.015),
        borderColor: Colors.BG,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: size / 2,
    },
    fullScreenModalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenImage: {
        width: '100%',
        height: '50%',
    },
    controlButtonsContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    // Estilo ajustado para um único botão
    gradientButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
});
