// app/(public)/login.tsx

import api from "@/api/axios";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { Logar } from "@/constants/constants";
import { useModalFeedback } from '@/contexts/ModalFeedbackContext';
import { useAuth } from '@/routes/AuthContext';
import { Entypo, Feather } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
// --- IMPORTAÇÕES OTIMIZADAS ---
// LayoutAnimation e UIManager foram removidos.
import {
  Animated, Easing, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
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
        toValue: -45, // Valor que você ajustou e gostou
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

  // O useEffect do LayoutAnimation foi removido por ser redundante.

  const handleLogin = async () => {
    try {
      const response = await api.post('/Login', { email, senha });
      const { token, usuario } = response.data;
      mostrarModalFeedback("Login efetuado com sucesso!", 'success');

      setTimeout(() => {
        login(token, usuario);
        router.replace('/home');
      }, 1500);

    } catch (error: any) {
      let msg = "Erro ao efetuar login.";
      if (typeof error.response?.data === 'string' && error.response.data) {
        msg = error.response.data;
      }
      mostrarModalFeedback(msg, 'error');
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Image
          source={require("../../assets/images/bg-new.png")}
          style={styles.bgImage}
        />

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* --- HEADER --- */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" style={styles.backIcon} />
            </TouchableOpacity>
          </View>
          
          {/* --- SECTION (main content) --- */}
          <Animated.View style={[styles.section, { transform: [{ translateY }] }]}>
            <Text style={styles.h1}>{Logar.bem_vindo}</Text>
            <Text style={styles.h2}>{Logar.estamos_felizes}</Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Digite seu e-mail"
                  placeholderTextColor={Colors.GRAY}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.inputInner}
                    placeholder="Digite sua senha"
                    placeholderTextColor={Colors.GRAY}
                    value={senha}
                    onChangeText={setSenha}
                    secureTextEntry={!senhaVisivel}
                  />
                  <TouchableOpacity style={styles.eyeButton} onPress={() => setSenhaVisivel(!senhaVisivel)}>
                    <Entypo name={senhaVisivel ? "eye-with-line" : "eye"} style={styles.eyeIcon} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.forgotPasswordButton}>
                  <Text style={styles.forgotPasswordText}>{Logar.esqueceu_senha}</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>{Logar.login}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* --- FOOTER --- */}
          <View style={styles.footer}>
            <Image source={require("../../assets/images/mao.png")} style={styles.handImage} />
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>{Logar.sem_conta}</Text>
              <TouchableOpacity onPress={() => router.navigate('/(public)/cadastro')}>
                <Text style={styles.signupLink}>{Logar.fazer_cadastro}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

// Seus estilos permanecem os mesmos
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
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-around', // Distribui o espaço de forma mais equilibrada
    paddingHorizontal: '8%',
  },
  header: {
    paddingTop: 20,
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
  section: {
    alignItems: 'center',
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
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: "Montserrat",
    marginBottom: 8,
    opacity: 0.9,
  },
  input: {
    backgroundColor: 'rgba(16, 16, 16, 0.2)',
    color: Colors.WHITE,
    paddingHorizontal: 15,
    fontSize: 14,
    borderRadius: 10,
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 55,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 16, 16, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 55,
  },
  inputInner: {
    flex: 1,
    color: Colors.WHITE,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "Montserrat",
  },
  eyeButton: {
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: Colors.GRAY,
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
    marginBottom: 20,
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
    marginBottom: 25,
  },
  handImage: {
    width: 50,
    height: 43,
    marginBottom: 15,
  },
  signupContainer: {
    flexDirection: 'column',
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
