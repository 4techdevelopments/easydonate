import BottomNavigation from "@/components/bottomNavigation";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Configuracoes() {
    const { usuario, logout } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
    const [novaFotoUri, setNovaFotoUri] = useState<string | null>(null);

    const toggleModal = () => setModalVisible(!isModalVisible);
    const togglePhotoModal = () => setPhotoModalVisible(!isPhotoModalVisible);

    const confirmLogout = () => {
        setModalVisible(false);
        logout();
    };

    const takePhotoWithCamera = async () => {
        // 1. Pedir permissão para a CÂMERA
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos da permissão da câmera para isso funcionar!');
            return;
        }

        // 2. Abrir a câmera
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        // 3. Lidar com o resultado
        if (!result.canceled) {
            setNovaFotoUri(result.assets[0].uri);
            togglePhotoModal(); // Fecha o modal
        }
    };

    const pickImageFromGallery = async () => {
        // 1. Pedir permissão para acessar a galeria
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos da permissão da galeria para isso funcionar!');
            return;
        }

        // 2. Abrir a galeria de imagens
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Apenas imagens
            allowsEditing: true, // Permite ao usuário cortar a imagem
            aspect: [1, 1], // Força o corte para uma proporção quadrada
            quality: 1, // Qualidade máxima
        });

        // 3. Lidar com o resultado
        if (!result.canceled) {
            // Por enquanto, vamos apenas mostrar a URI (o caminho local) da imagem no console
            setNovaFotoUri(result.assets[0].uri);
            togglePhotoModal(); // Fecha o modal após selecionar
        }
    };

    // ...

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

                                            <TouchableOpacity style={styles.ProfileIcon} onPress={togglePhotoModal}>
                                                {/* Se existe uma nova URI OU o usuário já tem uma foto, mostre a imagem */}
                                                {novaFotoUri || usuario?.fotoUrl ? (
                                                    <Image
                                                        source={{ uri: novaFotoUri || usuario?.fotoUrl }}
                                                        style={styles.profileImage}
                                                    />
                                                ) : (
                                                    // Senão, mostre o ícone padrão
                                                    <Feather name="user" size={25} color={Colors.WHITE} />
                                                )}

                                                {/* Ícone de edição sobreposto */}
                                                <View style={styles.editIconOverlay}>
                                                    <Feather name="edit-2" size={12} color={Colors.WHITE} />
                                                </View>
                                            </TouchableOpacity>

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
                <Modal
                    isVisible={isPhotoModalVisible}
                    onBackdropPress={togglePhotoModal} // Fecha o modal ao tocar fora
                    style={styles.bottomModal}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Alterar Foto de Perfil</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={takePhotoWithCamera}>
                            <Feather name="camera" size={20} color={Colors.ORANGE} />
                            <Text style={styles.modalButtonText}>Tirar Foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
                            <Feather name="image" size={20} color={Colors.ORANGE} />
                            <Text style={styles.modalButtonText}>Escolher da Galeria</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton]} onPress={togglePhotoModal}>
                            <Text style={[styles.modalButtonText, { color: Colors.GRAY }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

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
        alignItems: "center",
    },
    ProfileLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    // ... no seu objeto de estilos
    ProfileIcon: {
        backgroundColor: Colors.ORANGE,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        // Remova borderWidth e borderColor se você os tiver, a imagem cuidará da borda.
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    editIconOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.ORANGE,
        borderRadius: 10,
        padding: 3,
        borderWidth: 1,
        borderColor: Colors.WHITE,
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
