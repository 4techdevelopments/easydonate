import api from "@/api/axios";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { Logar } from "@/constants/constants";
import { Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // [LOGIN]
  const handleLogin = async () => {
    try {
      const response = await api.post('/Login', { email, senha });

      const { token, usuario } = response.data;

      await SecureStore.setItemAsync('token', token);
      await SecureStore.setItemAsync('usuario', JSON.stringify(usuario));

      Alert.alert("Login realizado com sucesso!");
      router.replace('/home');
    } catch (error: any) {
      console.log(error);

      let msg = "Erro ao efetuar login!";
      if (typeof error.response?.data === 'string') {
        msg = error.response.data;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }

      Alert.alert("Erro", msg);
    }
  };

  // [CARREGAR FONTS]
  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf")
  });

  // [SENHA VISIVEL]
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const alternarVisibilidadeSenha = () => {
    setSenhaVisivel(!senhaVisivel)
  }

  // [LOADING ENQUANTO NÃO CARREGA AS FONTES]
  if (!fontsLoaded) {
    return (
      <View style={[styles.Container, { backgroundColor: Colors.BG }]}>
        <EasyDonateSvg />
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}>

        <Image source={require("../../assets/images/bg-tela-login.png")}
          style={styles.Bg}
          resizeMode="cover"
        />

        <View style={styles.Wrapper}>

          <View style={styles.Header}>
            <TouchableOpacity style={styles.BtnVoltar} onPress={() => router.back()}>
              <Entypo name="chevron-left" style={styles.IconVoltar} />
            </TouchableOpacity>
          </View>

          <View style={styles.Section}>
            <View style={styles.WrapperLogin}>
              <Text style={styles.H1}>{Logar.bem_vindo}</Text>
              <Text style={styles.H2}>{Logar.estamos_felizes}</Text>

              <View style={styles.WrapperLoginEmail}>
                <Text style={styles.LabelEmailSenha}>Email</Text>
                <TextInput
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  maxLength={255}
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  style={styles.InputEmail}
                />
              </View>

              <View style={styles.WrapperLoginSenha}>
                <Text style={styles.LabelEmailSenha}>Senha</Text>
                <View style={styles.WrapperSenha}>
                  <TextInput
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    maxLength={128}
                    keyboardType="default"
                    textContentType="password"
                    secureTextEntry={!senhaVisivel}
                    style={styles.InputSenha}
                  />
                  <TouchableOpacity onPress={alternarVisibilidadeSenha} style={styles.MostrarSenha}>
                    <Entypo
                      name={senhaVisivel ? "eye-with-line" : "eye"}
                      style={styles.IconEye}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.WrapperTrocarSenha}>
                  <Text style={styles.LabelTrocarSenha}>{Logar.esqueceu_senha}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.BtnLogin} onPress={handleLogin}>
                  <Text style={styles.BtnTextLogin}>{Logar.login}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.Footer}>
            <View style={styles.WrapperCadastro}>
              <Image source={require("../../assets/images/mao.png")}
                style={styles.Mao}
              />
              <Text style={styles.Label}>{Logar.sem_conta}</Text>
              <TouchableOpacity onPress={() => router.navigate('/(public)/cadastro')}>
                <Text style={styles.Label2}>{Logar.fazer_cadastro}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.PRETO_BG
  },
  Bg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  Wrapper: {
    width: "80%",
    height: "100%"
  },
  Header: {
    //backgroundColor: "#0f0",
    width: "100%",
    height: "15%",
    display: "flex",
    justifyContent: "flex-end"
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
  IconVoltar: {
    color: Colors.WHITE,
    fontSize: 18
  },
  Section: {
    //backgroundColor: "#f00",
    width: "100%",
    height: "85%",
    display: "flex",
    justifyContent: "center",
    flex: 1
  },
  WrapperLogin: {
    //backgroundColor: "#cecece",
    width: "100%",
    height: "80%",
    display: "flex",
    alignItems: "center"
  },
  LabelEmailSenha: {
    color: Colors.WHITE,
    fontSize: 14,
    fontFamily: "Montserrat"
  },
  H1: {
    color: Colors.ORANGE,
    fontSize: 36,
    fontFamily: "Montserrat-Bold",
  },
  H2: {
    color: Colors.WHITE,
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Montserrat",
    width: "80%",
    paddingBottom: 40
  },
  WrapperLoginEmail: {
    //backgroundColor: "#f00",
    width: "100%",
    paddingBottom: 20
  },
  InputEmail: {
    backgroundColor: Colors.WHITE,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    borderRadius: 5,
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: Colors.GRAY,
    height: 50
  },
  WrapperLoginSenha: {
    //backgroundColor: "#f0f",
    width: "100%",
    paddingBottom: 10,
  },
  WrapperSenha: {
    display: "flex",
    flexDirection: "row"
  },
  InputSenha: {
    backgroundColor: Colors.WHITE,
    paddingLeft: 15,
    paddingRight: 65,
    fontSize: 14,
    borderRadius: 5,
    fontFamily: "Montserrat",
    borderWidth: 1,
    borderColor: Colors.GRAY,
    height: 55,
    width: "100%"
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
    top: 2
  },
  IconEye: {
    fontSize: 20,
    color: Colors.GRAY
  },
  WrapperTrocarSenha: {
    //backgroundColor: "#0f0",
    width: "100%",
    display: "flex",
    alignItems: "flex-end",
    paddingBottom: 25
  },
  LabelTrocarSenha: {
    color: Colors.WHITE,
    fontFamily: "Montserrat",
    fontSize: 14,
    marginTop: 5
  },
  BtnLogin: {
    width: "100%",
    backgroundColor: Colors.ORANGE,
    padding: 12,
    borderRadius: 5,
    marginBottom: 15
  },
  BtnTextLogin: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: "Montserrat-Medium"
  },
  Footer: {
    //backgroundColor: "#0ff",
    width: "100%",
    height: "15%",
    display: "flex",
    justifyContent: "flex-end"
  },
  WrapperCadastro: {
    //backgroundColor: "#121212",
    width: "100%",
    display: "flex",
    alignItems: "center"
  },
  Mao: {
    width: 60,
    height: 52,
    marginBottom: 10,
  },
  Label: {
    color: Colors.WHITE,
    fontFamily: "Montserrat",
    fontSize: 15,
  },
  Label2: {
    color: Colors.ORANGE,
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
    marginBottom: 20
  }
})