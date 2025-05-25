import { useAuth } from "@/routes/AuthContext"; // ajuste o caminho se necessário
import PrivateRoute from "@/routes/PrivateRoute";
import { Entypo, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../../components/Colors"; // ajuste caminho para as cores

export default function Conta() {
    const { usuario, atualizarUsuario } = useAuth();

    const [nome, setNome] = useState(usuario?.nome || "");
    const [email, setEmail] = useState(usuario?.email || "");
    const [password, setSenha] = useState(usuario?.senha || "");
    const [repeatPassword, setSenha2] = useState(usuario?.senha || "");

    const salvarAlteracoes = () => {
        if (!nome.trim() || !email.trim()) {
            Alert.alert("Erro", "Nome e email não podem ficar vazios.");
            return;
        }

        atualizarUsuario({ nome, email });
        Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    };

    // [SENHA VISIVEL]
    // [SENHA VISIVEL]
    const [senhasVisiveis, setSenhasVisiveis] = useState<boolean[]>([false, false, false, false]);

    const alternarVisibilidadeSenha = (index: number) => {
        setSenhasVisiveis(prev => {
            const novas = [...prev];
            novas[index] = !novas[index];
            return novas;
        });
    };

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.Container}>
                    <View style={styles.Wrapper}>
                        <View style={styles.Header}>
                            <TouchableOpacity style={styles.BtnVoltar} onPress={() => router.back()}>
                                <Feather name="chevron-left" style={styles.IconVoltar} />
                            </TouchableOpacity>


                        </View>


                        <ScrollView style={styles.ScrollAll} showsVerticalScrollIndicator={false}>
                            <View style={styles.SettingsList}>

                                <View style={styles.TitleWrapper}>
                                    <View style={styles.TitleContainer}>
                                        <Feather name="edit" size={20} color={Colors.ORANGE} />
                                        <Text style={styles.Title}>Editar informações</Text>
                                    </View>
                                </View>


                                <View style={styles.Item}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="user" size={20} color={Colors.ORANGE} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={nome}
                                            maxLength={255}
                                            onChangeText={setNome}
                                            placeholder="Digite seu nome"
                                        />
                                    </View>
                                </View>

                                <View style={styles.Item}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="mail" size={20} color={Colors.ORANGE} style={styles.inputIcon} />

                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={email}
                                            maxLength={255}
                                            onChangeText={setEmail}
                                            placeholder="Digite seu email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>
                                <View style={styles.Item}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="lock" size={20} color={Colors.ORANGE} style={styles.inputIcon} />

                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={password}
                                            onChangeText={setSenha}
                                            placeholder="Digite seua senha"
                                            maxLength={128}

                                            keyboardType="default"
                                            secureTextEntry={!senhasVisiveis[0]}
                                            textContentType="password"
                                            autoCapitalize="none"
                                        />

                                        <TouchableOpacity onPress={() => alternarVisibilidadeSenha(0)} style={styles.MostrarSenha}>
                                            <Entypo
                                                name={senhasVisiveis[0] ? "eye-with-line" : "eye"}
                                                style={styles.IconEye}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.Item}>
                                    <View style={styles.inputWrapper}>
                                        <Feather name="lock" size={20} color={Colors.ORANGE} style={styles.inputIcon} />

                                        <TextInput
                                            style={styles.inputWithIcon}
                                            value={repeatPassword}
                                            onChangeText={setSenha2}
                                            placeholder="Digite sua senha"
                                            maxLength={128}

                                            keyboardType="default"
                                            secureTextEntry={!senhasVisiveis[1]}
                                            textContentType="password"
                                            autoCapitalize="none"
                                        />

                                        <TouchableOpacity onPress={() => alternarVisibilidadeSenha(1)} style={styles.MostrarSenha}>
                                            <Entypo
                                                name={senhasVisiveis[1] ? "eye-with-line" : "eye"}
                                                style={styles.IconEye}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                            <View style={styles.WrapperBtn}>
                                <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
                                    <Text style={styles.buttonText}>Salvar</Text>
                                </TouchableOpacity>
                            </View>

                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        </PrivateRoute>
    );
}

const styles = StyleSheet.create({
    ScrollAll: {
        flex: 1,
    },
    IconVoltar: {
        color: Colors.BLACK,
        fontSize: 18
    },
    BtnVoltar: {
        position: "absolute",
        left: 0,
        top: "50%",
        transform: [{ translateY: -20 }],
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.ORANGE,
        backgroundColor: Colors.BRANCO_BTN_VOLTAR,
    },
    IconEye: {
        fontSize: 20,
        color: Colors.GRAY
    },

    MostrarSenha: {
        //backgroundColor: "#f00",
        width: "20%",
        height: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 0,
        // top: 0
    },

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
        height: 60,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginTop: 30,
        marginBottom: 10,
    },
    ImgEasyDonate: {
        width: 120,
        height: 40,
        marginBottom: 10,
    },
    TitleWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    TitleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 10,
    },
    Title: {
        fontSize: 16,
        fontFamily: "Montserrat-Bold",
        color: Colors.BLACK,
    },
    SettingsList: {
        borderRadius: 15,
        // backgroundColor: Colors.WHITE,
        paddingVertical: 10,
        // gap: 5,
        // marginTop: 20,
        // elevation: 2,
        // shadowColor: "#12121275",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
    },
    Item: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    inputWrapper: {
        position: "relative",
        width: "100%",
        height: 48,  // altura suficiente para o input e ícone
        // marginBottom: 15,

    },

    inputWithIcon: {
        backgroundColor: Colors.INPUT_GRAY,
        paddingVertical: 12,
        paddingLeft: 40,  // espaço para o ícone
        borderRadius: 8,
        fontSize: 16,
        borderColor: Colors.PRETO_BG,
        borderWidth: 1,
        width: "100%",
        height: "100%",
    },

    inputIcon: {
        position: "absolute",
        left: 12,
        top: "50%",
        transform: [{ translateY: -10 }],  // metade da altura do ícone (20px)
        zIndex: 10,  // garantir que fique na frente
    },

    WrapperBtn: {
        display: "flex",
        alignItems: "center",
    },

    button: {
        backgroundColor: Colors.ORANGE,
        display: "flex",
        justifyContent: "center",
        // paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        height: 50,
        width: 200,
    },
    buttonText: {
        color: Colors.WHITE,
        // fontWeight: "bold",
        fontSize: 18,
    },
});
