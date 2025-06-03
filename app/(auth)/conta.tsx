import api from "@/api/axios";
import { useAuth } from "@/routes/AuthContext"; // ajuste o caminho se necessário
import PrivateRoute from "@/routes/PrivateRoute";
import { Entypo, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../../components/Colors"; // ajuste caminho para as cores

export default function Conta() {
    const { usuario } = useAuth();

    const [nome, setNome] = useState(usuario?.nome || "");
    const [email, setEmail] = useState(usuario?.email || '');
    const [senha, setSenha] = useState(usuario?.senha || "");
    const [senha2, setSenha2] = useState(usuario?.senha || "");
    const [dataCriacao, setDataCriacao] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');

    // [PEGAR USUARIO]
    const fetchUsuario = async () => {
        try {
            const response = await api.get(`/Usuario/${usuario.idUsuario}`);

            if (response.status === 200) {
                setDataCriacao(response.data.dataCriacao);
                setTipoUsuario(response.data.tipoUsuario);
            }
        } catch (error: any) {
            console.log("Erro ao puxar dados:", error);

            let msg = "Erro ao puxar usuário!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            Alert.alert(msg);
        }
    }

    useEffect(() => {
        fetchUsuario();
    }, []);

    // [LIMPAR SENHA]
    const resetSenha = () => {
        setSenha('');
        setSenha2('');
    };

    // [ATUALIZAR USUÁRIO]
    const handleSave = async () => {
        if (!email.trim() || !senha.trim() || !senha2.trim()) {
            Alert.alert("Erro", "Preencha os campos corretamente!");
            return;
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Erro", "Digite um e-mail válido!");
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senha)) {
            Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!");
            return;
        }

        if (senha !== senha2) {
            Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        let bodyRequest: any = {
            email,
            senha,
            dataCriacao,
            tipoUsuario
        }

        try {
            const response = await api.put(`/Usuario/${usuario.idUsuario}`, bodyRequest);

            if (response.status === 200) {
                Alert.alert("Sucesso", "Usuário atualizado com sucesso!");
                resetSenha();
            }
        } catch (error: any) {
            console.log("Erro ao atualizar:", error);

            let msg = "Erro ao atualizar usuário!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            Alert.alert(msg);
        }
    }

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
                                            editable={false}
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
                                            value={senha}
                                            onChangeText={setSenha}
                                            placeholder="Digite sua senha"
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
                                            value={senha2}
                                            onChangeText={setSenha2}
                                            placeholder="Repita sua senha"
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
                                <TouchableOpacity style={styles.button} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Salvar Alterações</Text>
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.ORANGE,
        backgroundColor: Colors.BRANCO_BTN_VOLTAR,
        marginBottom: 20
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
        width: "100%",
        height: "15%",
        display: "flex",
        justifyContent: "flex-end"
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
