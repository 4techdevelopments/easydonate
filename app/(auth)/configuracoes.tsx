// app/(tabs)/configuracoes.tsx

import { AvatarUploader } from '@/components/AvatarUploader';
import BottomNavigation from "@/components/bottomNavigation";
import Colors from "@/components/Colors";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

// --- COMPONENTES MEMORIZADOS PARA PERFORMANCE ---
const ProfileCard = React.memo(function ProfileCard() {
    const { usuario } = useAuth();
    return (
        <View style={styles.ProfileCard}>
            <View style={styles.ProfileContent}>
                <View style={styles.ProfileLeft}>
                    <AvatarUploader />
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                            <Text style={styles.ProfileName}>{usuario?.nome || "Usuário"}</Text>
                            <MaterialIcons name="verified" size={16} color={Colors.ORANGE} />
                        </View>
                        <Text style={styles.ProfileEmail}>{usuario?.email || "Email"}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
});

const SettingsList = React.memo(function SettingsList({ onLogoutPress }: { onLogoutPress: () => void }) {
    const { usuario } = useAuth();

    return (
        <View style={styles.SettingsList}>
            <TouchableOpacity style={styles.Item} onPress={() => router.push("/(auth)/conta")}>
                <View style={styles.ItemLeft}>
                    <Feather name="user" size={20} color={Colors.ORANGE} />
                    <Text style={styles.ItemText}>Minha conta</Text>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.GRAY} />
            </TouchableOpacity>


            <TouchableOpacity style={styles.Item} onPress={() => {}}>
                <View style={styles.ItemLeft}>
                    <Feather name="info" size={20} color={Colors.ORANGE} />
                    <Text style={styles.ItemText}>Suporte</Text>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.GRAY} />
            </TouchableOpacity>


            {usuario.tipoUsuario === "ADM" && (
                <TouchableOpacity style={styles.Item} onPress={() => router.push("/(auth)/addLocalizacoes")}>
                    <View style={styles.ItemLeft}>
                        <Feather name="map-pin" size={20} color={Colors.ORANGE} />
                        <Text style={styles.ItemText}>Localizações</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={Colors.GRAY} />
                </TouchableOpacity>
            )}


            <TouchableOpacity style={styles.Item} onPress={onLogoutPress}>
                <View style={styles.ItemLeft}> 
                    <Feather name="log-out" size={20} color={Colors.ORANGE} />
                    <Text style={[styles.ItemText, { color: Colors.ORANGE }]}>Sair</Text>
                </View>
                <Feather name="chevron-right" size={20} color={Colors.ORANGE} />
            </TouchableOpacity>
        </View>
    );
});

const LogoutModal = React.memo(function LogoutModal({ isVisible, onBackdropPress, onConfirm, onCancel }: any) {
    return (
        <Modal 
            isVisible={isVisible}
            onBackdropPress={onBackdropPress}
            onBackButtonPress={onBackdropPress}
            animationIn="fadeIn"
            animationOut="fadeOut"
            useNativeDriverForBackdrop
            style={styles.modalStyle}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Você realmente quer sair?</Text>
                <Text style={styles.modalSubtitle}>Qualquer alteração não salva será perdida.</Text>
                <View style={styles.modalButtonRow}>
                    <TouchableOpacity onPress={onCancel} style={styles.btnCancel}>
                        <Text style={styles.btnCancelText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onConfirm} style={styles.btnConfirm}>
                        <Text style={styles.btnConfirmText}>Sair</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
});

// --- COMPONENTE PRINCIPAL ---
export default function Configuracoes() {
    const { logout } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = useCallback(() => {
        setModalVisible(prev => !prev);
    }, []);

    const confirmLogout = useCallback(() => {
        toggleModal();
        setTimeout(logout, 300);
    }, [logout, toggleModal]);

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View style={[styles.Container, { justifyContent: "center" }]}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG }}>
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
                           <ProfileCard />
                           <SettingsList onLogoutPress={toggleModal} />
                        </ScrollView>
                        
                        <View style={styles.Footer}>
                            <BottomNavigation />
                        </View>
                    </View>
                </View>

                <LogoutModal 
                    isVisible={isModalVisible}
                    onBackdropPress={toggleModal}
                    onConfirm={confirmLogout}
                    onCancel={toggleModal}
                />
            </SafeAreaView>
        </PrivateRoute>
    );
}

// Estilos limpos e finais
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BG,
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
        marginBottom: 20,
        elevation: 2,
        shadowColor: "#12121275",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    ProfileContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    ProfileLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
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
    // Estilos do Modal
    modalStyle: {
        margin: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        width: '85%'
    },
    modalTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalSubtitle: {
        fontSize: 13,
        fontFamily: 'Montserrat',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtonRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 15,
        width: '100%',
    },
    btnCancel: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 35,
        borderColor: Colors.INPUT_GRAY,
        borderWidth: 1,
        alignItems: "center",
    },
    btnConfirm: {
        paddingVertical: 12,
        paddingHorizontal: 40,
        backgroundColor: Colors.ORANGE,
        borderRadius: 35,
        alignItems: "center",
    },
    btnCancelText: {
        color: Colors.BLACK,
        fontWeight: 'bold',
    },
    btnConfirmText: {
        color: Colors.WHITE,
        fontWeight: "bold",
    },
});
