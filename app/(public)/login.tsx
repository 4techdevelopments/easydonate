// app/(public)/login.tsx

import api from "@/api/axios";
import CustomInput from "@/components/CustomInput";
import EasyDonateSvg from "@/components/easyDonateSvg";
import PasswordInput from "@/components/PasswordInput";
import { Logar } from "@/constants/constants";
import { useModalFeedback } from '@/contexts/ModalFeedbackContext';
import { useAuth } from '@/routes/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";


export default React.memo(function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const { mostrarModalFeedback } = useModalFeedback();
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, () => {
            Animated.timing(translateY, {
                toValue: -80,
                duration: 500,
                easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                useNativeDriver: true,
            }).start();
        });

        const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, [translateY]);

    const handleLogin = async () => {
        try {
            const response = await api.post('/Login', { email, senha });
            const { token, usuario } = response.data;
            mostrarModalFeedback(
                "Login efetuado com sucesso!",
                'success',
                1500,
                "Bem-vindo(a) de volta!"
            );

            setTimeout(() => {
                login(token, usuario);
                router.replace('/home');
            }, 1500);

        } catch (error: any) {
            let msg = "Erro ao efetuar login.";
            if (typeof error.response?.data === 'string' && error.response.data) {
                msg = error.response.data;
            }
            mostrarModalFeedback(
                msg,
                'error',
                undefined
            );
        }
    };

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/images/bg-new.png")}
                    style={styles.bgImage}
                />

                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Feather name="arrow-left" style={styles.backIcon} />
                    </TouchableOpacity>
                </View>

                {/* O ScrollView precisa do flex: 1 para ocupar o espaço entre o header e o footer */}
                <ScrollView
                    style={{ flex: 1 }} 
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={[styles.section, { transform: [{ translateY }] }]}>
                        <Text style={styles.h1}>{Logar.bem_vindo}</Text>
                        <Text style={styles.h2}>{Logar.estamos_felizes}</Text>

                        <View style={styles.form}>
                            <CustomInput
                                label="Email"
                                inputProps={{
                                    placeholder: "Digite seu e-mail",
                                    placeholderTextColor: Colors.GRAY,
                                    value: email,
                                    onChangeText: setEmail,
                                    autoCapitalize: "none",
                                    keyboardType: "email-address",
                                    textContentType: "emailAddress",
                                    autoComplete: "email",
                                }}
                            />

                            <PasswordInput
                                label="Senha"
                                isPasswordVisible={senhaVisivel}
                                onToggleVisibility={() => setSenhaVisivel(!senhaVisivel)}
                                inputProps={{
                                    placeholder: "Digite sua senha",
                                    placeholderTextColor: Colors.GRAY,
                                    value: senha,
                                    onChangeText: setSenha,
                                    textContentType: "password",
                                    autoComplete: "password",
                                }}
                            />

                            <TouchableOpacity style={styles.forgotPasswordButton}>
                                <Text style={styles.forgotPasswordText}>{Logar.esqueceu_senha}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                                <Text style={styles.loginButtonText}>{Logar.login}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>

                <View style={styles.footer}>
                    <Image source={require("../../assets/images/mao.png")} style={styles.handImage} />
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>{Logar.sem_conta}</Text>
                        <TouchableOpacity onPress={() => router.replace('/(public)/cadastro')}>
                            <Text style={styles.signupLink}>{Logar.fazer_cadastro}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
});


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BG,
    },
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'rgba(10, 10, 10, 0.65)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG,
    },
    bgImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1,
    },
    header: {
        paddingTop: 30,
        paddingHorizontal: '8%',
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        color: Colors.WHITE,
        fontSize: 20,
    },
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: '8%',
    },
    section: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    h1: {
        color: Colors.ORANGE,
        fontSize: 30,
        fontFamily: "Montserrat-Bold",
        textAlign: 'center',
    },
    h2: {
        color: Colors.WHITE,
        fontSize: 14,
        textAlign: "center",
        fontFamily: "Montserrat",
        marginTop: 8,
        marginBottom: 30,
        lineHeight: 20,
        opacity: 0.8,
    },
    form: {
        width: '100%',
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
        marginTop: 12,
    },
    forgotPasswordText: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 14,
        opacity: 0.8,
    },
    loginButton: {
        width: "100%",
        backgroundColor: Colors.ORANGE,
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    loginButtonText: {
        textAlign: "center",
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: "Montserrat-Bold"
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 30,
        paddingHorizontal: '8%',
    },
    handImage: {
        width: 50,
        height: 43,
        marginBottom: 15,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 15,
        marginRight: 5,
    },
    signupLink: {
        color: Colors.ORANGE,
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
    }
});