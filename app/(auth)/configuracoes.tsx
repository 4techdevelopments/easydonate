import api from "@/api/axios";
import BottomNavigation from "@/components/bottomNavigation";
import Colors from "@/components/Colors";
import EasyDonateSvg from "@/components/easyDonateSvg";
import PhotoPickerModal from "@/components/PhotoPickerModal";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Configuracoes() {
    const { usuario, logout, atualizarUsuario } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
    const [novaFotoUri, setNovaFotoUri] = useState<string | null>(null);

    // [UPLOAD IMAGEM IMAGEBB]
    const uploadToImgbb = async (imageUri: string): Promise<string | null> => {
        try {
            const apiKey = "0064c7ca5d35d2ff095d09220c71f750";

            const response = await fetch(imageUri);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });

            const formData = new FormData();
            formData.append("image", base64);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            return data.data?.url || null;
        } catch (error) {
            console.warn("Erro ao enviar imagem para ImgBB:", error);
            return null;
        }
    };

    // [SETAR FOTO]
    const [isUploading, setIsUploading] = useState(false);
    const handlePhotoSelected = async (uri: string) => {
        //console.log("URI recebida na Home:", uri);
        setNovaFotoUri(uri); // Mostra a preview da imagem imediatamente

        // Aqui entraria a lógica de upload que discutimos
        setIsUploading(true);
        try {
            const uploadedUrl = await uploadToImgbb(uri);

            if (uploadedUrl) {
                //console.log("URL da imagem no ImgBB:", uploadedUrl);

                const response = await api.put(`/Usuario/Upload/${usuario.idUsuario}`, {
                    idUsuario: usuario.idUsuario,
                    avatar: uploadedUrl
                });

                if (response.status === 200) {
                    //console.log(response.data);
                    await fetchUsuarioAtualizado();
                }

                atualizarUsuario({ avatar: uploadedUrl });
            }
        } catch (error) {
            console.warn("Erro no upload:", error);
        } finally {
            setIsUploading(false);
        }
    };

    // [ATUALIZAR AVATAR DO USUARIO]
    const fetchUsuarioAtualizado = async () => {
        try {
            const response = await api.get(`/Usuario/${usuario.idUsuario}`);
            if (response.status === 200) {
                atualizarUsuario({ avatar: response.data.avatar });
            }
        } catch (error) {
            console.warn("Erro ao buscar dados atualizados do usuário:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsuarioAtualizado();
        }, [])
    );


    const toggleModal = () => setModalVisible(!isModalVisible);
    const togglePhotoModal = () => setPhotoModalVisible(!isPhotoModalVisible);

    const confirmLogout = () => {
        setModalVisible(false);
        logout();
    };

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View style={[styles.Container, { backgroundColor: Colors.BG }]}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.Container}>
                    <View style={styles.Wrapper}>
                        <View style={styles.Header}>
                            <Image
                                source={require("../../assets/images/logo-easy-donate-black.webp")}
                                style={styles.ImgEasyDonate}
                                resizeMode="contain"
                            />
                            <View style={styles.TitleContainer}>
                                <Feather name="settings" size={24} color={Colors.ORANGE} />
                                <Text style={styles.Title}>Configurações</Text>
                            </View>
                        </View>

                        <ScrollView style={styles.ScrollAll} showsVerticalScrollIndicator={false}>
                            <View style={styles.ProfileCard}>
                                <View style={styles.ProfileTouchable}>
                                    <View style={styles.ProfileContent}>
                                        <View style={styles.ProfileLeft}>



                                            <View style={styles.profileImageContainer}>

                                                {/* O TouchableOpacity agora só contém a imagem ou o ícone padrão */}
                                                <TouchableOpacity style={styles.Img} onPress={togglePhotoModal}>
                                                    {novaFotoUri || usuario?.avatar ? (
                                                        <Image
                                                            source={{ uri: novaFotoUri || usuario?.avatar }}
                                                            style={styles.profileImage}
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <FontAwesome6 name="user-large" size={15} color={Colors.WHITE} />
                                                    )}
                                                </TouchableOpacity>

                                                {/* --- PASSO 2: Mova o ícone para fora, como irmão do TouchableOpacity --- */}
                                                <View style={styles.editIconOverlay}>
                                                    <FontAwesome6 name="camera" size={12} color={Colors.WHITE} />
                                                </View>

                                            </View>

                                            <View>
                                                <Text style={styles.ProfileName}>{usuario?.nome || "Usuário"}</Text>
                                                <Text style={styles.ProfileEmail}>{usuario?.email || "Email"}</Text>
                                            </View>

                                        </View>

                                    </View>
                                </View>
                            </View>

                            <View style={styles.SettingsList}>
                                <TouchableOpacity style={styles.Item} onPress={() => router.push("/(auth)/conta")}>
                                    <View style={styles.ItemLeft}>
                                        <Feather name="user" size={20} color={Colors.ORANGE} />
                                        <Text style={styles.ItemText}>Conta</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color={Colors.GRAY} />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.Item} onPress={toggleModal}>
                                    <View style={styles.ItemLeft}> 
                                        <Feather name="log-out" size={20} color={Colors.ORANGE} />
                                        <Text style={[styles.ItemText, { color: Colors.ORANGE }]}>Sair</Text>
                                    </View>
                                    <Feather name="chevron-right" size={20} color={Colors.ORANGE} />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        <View style={styles.Footer}>
                            <BottomNavigation />
                        </View>
                    </View>
                </View>

                {/* Modal de confirmação */}
                <Modal isVisible={isModalVisible}>
                    <View style={{ backgroundColor: "white", padding: 20, borderRadius: 15 }}>
                        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>
                            Você realmente quer sair?
                        </Text>
                        <Text style={{ fontSize: 13, fontWeight: "light", marginBottom: 20 }}>
                            Qualquer alteração não salva será perdida.
                        </Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableOpacity onPress={toggleModal} style={styles.btnCancel}>
                                <Text style={styles.btnCancelText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={confirmLogout} style={styles.btnConfirm}>
                                <Text style={styles.btnConfirmText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para alterar a foto de perfil */}
                <PhotoPickerModal
                    isVisible={isPhotoModalVisible}
                    onClose={togglePhotoModal}
                    onPhotoSelected={handlePhotoSelected}
                />

            </SafeAreaView>
        </PrivateRoute>
    );
}


const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BG,

    },
    //... no final do seu objeto de estilos
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee'
    },
    modalButtonText: {
        marginLeft: 15,
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: Colors.BLACK,
    },
    btnCancel: {
        // backgroundColor: Colors.BG,
        padding: 10,
        borderRadius: 35,
        width: 140,
        borderColor: Colors.INPUT_GRAY,
        borderWidth: 1,
        alignItems: "center",
    },
    btnCancelText: {
        color: Colors.BLACK,
        // fontWeight: "bold",
    },
    btnConfirm: {
        backgroundColor: Colors.ORANGE,
        padding: 10,
        borderRadius: 35,
        width: 140,
        alignItems: "center",
    },
    btnConfirmText: {
        color: Colors.WHITE,
        fontWeight: "bold",
    },
    Wrapper: {
        width: "80%",
        height: "100%",
    },
    Header: {
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    ImgEasyDonate: {
        width: 120,
        height: 40,
        marginBottom: 10,
    },
    TitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    Title: {
        fontSize: 20,
        fontFamily: "Montserrat-Bold",
        color: Colors.BLACK,
        marginBottom: 10,
        marginTop: 10,
    },
    ScrollAll: {
        flex: 1,
    },
    ProfileCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: 15,
        padding: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#12121275",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    ProfileTouchable: {
        flex: 1,
    },
    ProfileContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    ProfileLeft: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    DivPerfil: {
        // backgroundColor: "#fff",
        width: "15%",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center"
    },

    profileImageContainer: {
        // Não precisa de muito, ele serve como referência para a posição do ícone.
        // Pode-se definir width e height se necessário, mas vamos começar simples.
        position: 'relative', // Padrão, mas bom deixar explícito para clareza
    },
    Img: {
        backgroundColor: Colors.ORANGE,
        width: 50,
        height: 50,
        borderRadius: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: Colors.ORANGE,
        overflow: 'hidden'
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    editIconOverlay: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        backgroundColor: Colors.ORANGE,
        borderRadius: 15,
        padding: 5,
    },
    // ...
    ProfileName: {
        fontFamily: "Montserrat-Bold",
        fontSize: 16,
    },
    ProfileEmail: {
        fontFamily: "Montserrat",
        fontSize: 14,
        color: Colors.GRAY,
    },
    SettingsList: {
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        paddingVertical: 10,
        gap: 5,
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#12121275",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    Item: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    ItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    ItemText: {
        fontSize: 16,
        fontFamily: "Montserrat",
    },
    Footer: {
        width: "100%",
        height: "8%",
        justifyContent: "flex-end",
    },
});
