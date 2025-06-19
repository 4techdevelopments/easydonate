// app/(public)/cadastroTeste.tsx

import EasyDonateSvg from "@/components/easyDonateSvg";
import RadioSelector from "@/components/radioGroup";
import { useModalFeedback } from "@/contexts/ModalFeedbackContext";
import { Feather } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default React.memo(function CadastroTeste() {
    const router = useRouter();

    const [etapa, setEtapa] = useState<'selecao' | 'formulario'>('selecao');
    const [selectedOption, setSelectedOption] = useState<string>('');
    const translateY = useRef(new Animated.Value(0)).current;
    const { mostrarModalFeedback } = useModalFeedback();

    useEffect(() => {
        const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, () => {
            Animated.timing(translateY, {
                toValue: -80,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, [translateY]);


    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    });

    const handleBackPress = () => {
        if (etapa === 'formulario') {
            setEtapa('selecao');
        } else {
            router.back();
        }
    };

    const handleNextPress = () => {
        if (!selectedOption) {
            mostrarModalFeedback("Por favor, selecione uma opção para continuar.", 'error', undefined, "Ops! Algo deu errado...");
            return;
        }
        setEtapa('formulario');
    };


    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* --- INÍCIO DA REESTRUTURAÇÃO --- */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Image
                    source={require("../../assets/images/bg-new.png")}
                    style={styles.bgImage}
                />

                {/* 1. HEADER Fixo no Topo */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Feather name="arrow-left" style={styles.backIcon} />
                    </TouchableOpacity>
                </View>

                {/* 2. SCROLLVIEW ocupa o espaço do meio */}
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View style={[styles.section, { transform: [{ translateY }] }]}>
                        {etapa === 'selecao' && (
                            <>
                                <Text style={styles.h1}>Vamos começar!</Text>
                                <Text style={styles.h2}>Selecione como você deseja participar:</Text>
                                <RadioSelector
                                    options={['Doador', 'ONG']}
                                    selectedOption={selectedOption}
                                    onSelect={setSelectedOption}
                                />
                                <TouchableOpacity style={styles.mainButton} onPress={handleNextPress}>
                                    <Text style={styles.mainButtonText}>Próximo </Text>
                                    <Feather name="arrow-right" style={styles.backIcon} />

                                </TouchableOpacity>

                            </>
                        )}

                        {etapa === 'formulario' && (
                            <View>
                                <Text style={{ color: 'white', fontSize: 18, textAlign: 'center' }}>Formulário de <Text style={{ fontWeight: 'bold' }}>{selectedOption}</Text></Text>
                                <Text style={{ color: 'white', textAlign: 'center', marginTop: 10 }}>Aqui entrará todo o seu código do formulário de cadastro, já com os estilos padronizados.</Text>
                            </View>
                        )}
                    </Animated.View>
                </ScrollView>

                {/* 3. FOOTER Fixo na Base */}
                <View style={styles.footer}>
                    <Image source={require("../../assets/images/mao.png")} style={styles.handImage} />
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Já tem uma conta?</Text>
                        <TouchableOpacity onPress={() => router.navigate('/(public)/login')}>
                            <Text style={styles.signupLink}>Faça seu login!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
            {/* --- FIM DA REESTRUTURAÇÃO --- */}
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
    // O ScrollView agora só precisa garantir que o conteúdo possa crescer
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center', // Centraliza o conteúdo principal na vertical
        paddingHorizontal: '8%',
    },
    // O Header agora tem padding para não colar nas bordas
    header: {
        paddingTop: 20,
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
    // A Section continua a mesma, centralizando os itens
    section: {
        alignItems: 'center',
        paddingVertical: 20,
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
        lineHeight: 25,
        opacity: 0.8,
    },
    mainButton: {
        width: "100%",
        backgroundColor: Colors.ORANGE,
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 30,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "center"
    },
    mainButtonText: {
        textAlign: "center",
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: "Montserrat-Medium"
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 25,
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
