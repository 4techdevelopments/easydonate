import Colors from "@/components/Colors";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddLocalizacoes() {
    const router = useRouter();
    const { usuario } = useAuth();

    if (usuario.tipoUsuario !== "ADM") {
        setTimeout(() => {
            router.replace("/(auth)/home");
        }, 2100)

        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.Container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Feather name="arrow-left" size={24} color={Colors.BLACK} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", alignContent: "center" }}>
                        <Text style={{ fontFamily: "Montserrat-Bold", textAlign: "center" }}>Redirecionando...</Text>
                        <Text style={{ fontFamily: "Montserrat", textAlign: "center" }}>Você não tem permissão para acessar esse conteúdo!</Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <PrivateRoute>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.Container}>

                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Feather name="arrow-left" size={24} color={Colors.BLACK} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Feather name="map-pin" size={20} color={Colors.BLACK} />
                            <Text style={styles.headerTitle}>Controle de Localizações</Text>
                            <View style={{ width: 25 }} />
                        </View>
                    </View>


                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            <View style={styles.WrapperForm}>
                                <View style={styles.dataSection}>
                                    <Text style={styles.Label}>ID ONG</Text>
                                    <TextInput
                                        placeholder="0"
                                        style={[styles.Input, { backgroundColor: Colors.INPUT_GRAY }]}
                                        keyboardType="number-pad"
                                        editable={false}
                                    />
                                </View>

                                <View style={styles.dataSection}>
                                    <Text style={styles.Label}>Nome ONG</Text>
                                    <TextInput
                                        placeholder="Ex: ONG Viver"
                                        style={styles.Input}
                                        maxLength={255}
                                    />
                                    <Pressable style={styles.Search} onPress={() => { }}>
                                        <Feather name="search" size={20} color={Colors.ORANGE} />
                                    </Pressable>
                                </View>

                                <View style={styles.dataSection}>
                                    <Text style={styles.Label}>Endereço</Text>
                                    <TextInput
                                        placeholder="Ex: R. Bernardo Sayão, 319"
                                        style={styles.Input}
                                        maxLength={110}
                                    />
                                </View>

                                <View style={styles.dataSection}>
                                    <Text style={styles.Label}>Latitude</Text>
                                    <TextInput
                                        placeholder="-23.329989247504727"
                                        style={styles.Input}
                                        maxLength={30}
                                        keyboardType="number-pad"
                                    />
                                </View>

                                <View style={styles.dataSection}>
                                    <Text style={styles.Label}>Longitude</Text>
                                    <TextInput
                                        placeholder="-51.15615050407202"
                                        style={styles.Input}
                                        maxLength={30}
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>

                        </ScrollView>
                    </View>


                    <View style={styles.WrapperBtns}>
                        <TouchableOpacity style={styles.updateButton} activeOpacity={0.5}>
                            <Text style={styles.updateButtonText}>Alterar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
                            <Text style={styles.saveButtonText}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        </PrivateRoute>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BG,
    },
    Container: {
        flex: 1,
        paddingHorizontal: 35
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        gap: 10
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Montserrat",
        color: Colors.BLACK,
    },
    WrapperForm: {
        flex: 1,
        marginTop: 50
    },
    dataSection: {
        marginBottom: 10,
    },
    Search: {
        position: "absolute",
        borderRadius: 10,
        right: 0,
        bottom: 0,
        padding: 15
    },
    Label: {
        fontSize: 14,
        fontFamily: "Montserrat",
        color: Colors.TEXT_LIGHT,
        marginBottom: 5,
    },
    Input: {
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 15,
        borderRadius: 10,
        fontSize: 16,
        fontFamily: "Montserrat",
        color: Colors.BLACK,
        paddingVertical: 0,
        flex: 1,
        minHeight: 50
    },
    WrapperBtns: {
        width: "100%",
        flexDirection: "row",
        gap: 10
    },
    updateButton: {
        borderRadius: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: Colors.ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        flex: 1
    },
    updateButtonText: {
        color: Colors.ORANGE,
        fontSize: 16,
        fontFamily: 'Montserrat',
    },
    saveButton: {
        backgroundColor: Colors.ORANGE,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        flex: 1
    },
    saveButtonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Montserrat',
    },
});