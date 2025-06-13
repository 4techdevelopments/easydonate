// components/AvatarUploader.tsx (VERSÃO CORRIGIDA)

import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import api from '@/api/axios';
import { useAuth } from '@/routes/AuthContext';
import Colors from './Colors';
import PhotoPickerModal from './PhotoPickerModal'; // Seu modal inteligente

const IMG_BB_API_KEY = "0064c7ca5d35d2ff095d09220c71f750";

export function AvatarUploader() {
    // --- LÓGICA ---
    const { usuario, atualizarUsuario } = useAuth();
    
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    // ERRO 1 CORRIGIDO: A função async é chamada dentro do useCallback
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
        (async () => {
          await fetchUsuarioAtualizado();
        })();
      }, [fetchUsuarioAtualizado])
    );

    // Esta função agora recebe a URI diretamente do PhotoPickerModal
    const handleUpload = async (uri: string) => {
        setPreviewUri(uri);
        setIsUploading(true);
        try {
            const response = await fetch(uri);
        const blob = await response.blob();
        
        // Convertendo o blob para base64
        const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const formData = new FormData();
        // O ImgBB aceita a imagem como uma string base64 no campo 'image'
        formData.append("image", base64);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const uploadData = await res.json();
            const uploadedUrl = uploadData.data?.url;

            if (!uploadedUrl) throw new Error("Falha ao obter URL da imagem.");

            await api.put(`/Usuario/Upload/${usuario.idUsuario}`, {
                idUsuario: usuario.idUsuario,
                avatar: uploadedUrl
            });

            atualizarUsuario({ avatar: uploadedUrl });

        } catch (error) {
            console.warn("Erro no processo de upload:", error);
        } finally {
            setIsUploading(false);
            setPreviewUri(null);
        }
    };

    // Esta função serve pra excluir a foto do usuário
    // Ela é chamada quando o usuário confirma a exclusão no modal
 const handleDelete = async () => {
        setModalVisible(false); // Fecha o modal de opções de qualquer maneira

        // 2. Mostra o Alerta de confirmação
        Alert.alert(
            "Confirmar Exclusão", // Título do Alerta
            "Tem certeza que deseja excluir sua foto? Essa ação é irreversível!", // Mensagem
            [
                // Array de botões
                {
                    text: "Não",
                    onPress: () => console.log("Exclusão cancelada"),
                    style: "cancel" // Estilo para iOS
                },
                { 
                    text: "Sim, Excluir", 
                    onPress: async () => {
                        // 3. A lógica de exclusão agora vive dentro do 'onPress' do botão "Sim"
                        setIsUploading(true);
                        try {
                            await api.put(`/Usuario/Upload/${usuario.idUsuario}`, {
                                idUsuario: usuario.idUsuario,
                                avatar: null
                            });
                            atualizarUsuario({ avatar: null });
                        } catch (error) {
                            console.warn("Erro ao excluir a foto:", error);
                            // Opcional: Mostrar um alerta de erro aqui também
                            Alert.alert("Erro", "Não foi possível excluir a foto. Tente novamente.");
                        } finally {
                            setIsUploading(false);
                        }
                    },
                    style: "destructive" // No iOS, isso deixa o texto do botão vermelho
                }
            ]
        );
    };
    
    // --- PARTE VISUAL ---
    return (
        <>
            <View style={styles.profileImageContainer}>
                <TouchableOpacity style={styles.imgContainer} onPress={() => setModalVisible(true)} disabled={isUploading}>
                    {previewUri || usuario?.avatar ? (
                        <Image
                            source={{ uri: previewUri || usuario?.avatar }}
                            style={styles.profileImage}
                        />
                    ) : (
                        <FontAwesome6 name="user-large" size={15} color={Colors.WHITE} />
                    )}

                    {isUploading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color={Colors.WHITE} />
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.editIconOverlay}>
                    <FontAwesome6 name="camera" size={12} color={Colors.WHITE} />
                </View>
            </View>

            {/* ERRO 2 CORRIGIDO: Passando a prop 'onPhotoSelected' que o seu modal espera */}
            <PhotoPickerModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onPhotoSelected={handleUpload} 
                onDelete={handleDelete} 
            />
        </>
    );
};

const styles = StyleSheet.create({
    profileImageContainer: {
        position: 'relative',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        backgroundColor: Colors.ORANGE,
        width: 50,
        height: 50,
        borderRadius: 25,
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
        borderRadius: 15,
        padding: 5,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        pointerEvents: 'none',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});