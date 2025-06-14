// components/AvatarUploader.tsx

import { FontAwesome6 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';

import api from '@/api/axios';
import { useAuth } from '@/routes/AuthContext';
import Colors from './Colors';
import PhotoPickerModal from './PhotoPickerModal';

// Chave da API do ImgBB
const IMG_BB_API_KEY = "0064c7ca5d35d2ff095d09220c71f750";

// --- NOVA INTERFACE DE PROPRIEDADES ---
// Adicionamos uma interface para as props do componente.
// 'size' é opcional e tem um valor padrão de 60.
interface AvatarUploaderProps {
  size?: number;
}

// --- COMPONENTE PRINCIPAL ---
export function AvatarUploader({ size = 60 }: AvatarUploaderProps) {
    // --- LÓGICA EXISTENTE (sem alterações estruturais) ---
    const { usuario, atualizarUsuario } = useAuth();
    
    const [previewUri, setPreviewUri] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

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
        setModalVisible(false); // Fecha o modal ao iniciar o upload
        setPreviewUri(uri);
        setIsUploading(true);
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            
            // Convertendo o blob para base64 para enviar ao ImgBB
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

            await api.put(`/Usuario/Upload/${usuario.idUsuario}`, {
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
        setModalVisible(false); 

        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir sua foto? Essa ação é irreversível!",
            [
                {
                    text: "Não",
                    style: "cancel"
                },
                { 
                    text: "Sim, Excluir", 
                    onPress: async () => {
                        setIsUploading(true);
                        try {
                            await api.put(`/Usuario/Upload/${usuario.idUsuario}`, {
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

    // --- NOVA GERAÇÃO DE ESTILOS DINÂMICOS ---
    // Usamos 'useMemo' para calcular os estilos apenas quando a prop 'size' mudar.
    // Todos os valores (width, height, borderRadius, icon size, etc.) são calculados
    // proporcionalmente com base no 'size' fornecido.
    const styles = useMemo(() => getDynamicStyles(size), [size]);
    
    // --- PARTE VISUAL (com estilos dinâmicos) ---
    return (
        <>
            <TouchableOpacity style={styles.profileImageContainer} onPress={() => setModalVisible(true)} disabled={isUploading}>
                <View style={styles.imgContainer} >
                    {previewUri || usuario?.avatar ? (
                        <Image
                            source={{ uri: previewUri || usuario?.avatar }}
                            style={styles.profileImage}
                        />
                    ) : (
                        // O tamanho do ícone também é dinâmico
                        <FontAwesome6 name="user-large" size={size * 0.4} color={Colors.WHITE} />
                    )}

                    {isUploading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="small" color={Colors.WHITE} />
                        </View>
                    )}
                </View>

                <View style={styles.editIconOverlay}>
                     {/* O tamanho do ícone de câmera também é dinâmico */}
                    <FontAwesome6 name="camera" size={size * 0.15} color={Colors.BG} />
                </View>
            </TouchableOpacity>
            
            <PhotoPickerModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onPhotoSelected={handleUpload} 
                onDelete={handleDelete} 
                // Adiciona uma verificação para só mostrar a opção de deletar se houver um avatar
                showDeleteOption={!!usuario?.avatar}
            />
        </>
    );
};

// --- NOVA FUNÇÃO DE ESTILOS DINÂMICOS ---
// Esta função gera um objeto de estilo com base no tamanho fornecido.
// Isso evita a repetição e torna os estilos mais fáceis de manter.
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
        borderRadius: size / 2, // Perfeitamente circular
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // borderWidth: 0.5 * size / 60, // Borda proporcional ao tamanho
        // borderColor: Colors.ORANGE,
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
        borderRadius: size * 0.3, // Proporcional
        padding: size * 0.08, // Proporcional
        borderWidth: Math.max(1, size * 0.015), // Borda com mínimo de 1px
        borderColor: Colors.BG,
        // 'pointerEvents' não é necessário aqui pois o ícone está sobre o TouchableOpacity
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: size / 2, // Garante que o overlay também seja circular
    }
});
