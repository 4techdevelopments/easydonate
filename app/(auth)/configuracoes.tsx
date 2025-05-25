import BottomNavigation from "@/components/bottomNavigation";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Configuracoes() {
    const { usuario, logout } = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => setModalVisible(!isModalVisible);
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
                                <TouchableOpacity style={styles.ProfileTouchable}>
                                    <View style={styles.ProfileContent}>
                                        <View style={styles.ProfileLeft}>
                                            <View style={styles.ProfileIcon}>
                                                <Feather name="user" size={25} color={Colors.WHITE} />
                                            </View>
                                            <View>
                                                <Text style={styles.ProfileName}>{usuario?.nome || "Usuário"}</Text>
                                                <Text style={styles.ProfileEmail}>{usuario?.email || "Email"}</Text>
                                            </View>
                                        </View>
                                        <Feather name="chevron-right" size={20} color={Colors.GRAY} />
                                    </View>
                                </TouchableOpacity>
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
    ProfileIcon: {
        backgroundColor: Colors.ORANGE,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: Colors.ORANGE,
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
});
