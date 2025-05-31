import EasyDonateSvg from "@/components/easyDonateSvg";
import { Inicio } from "@/constants/constants";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Index() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === 'dark') {
      SystemUI.setBackgroundColorAsync("#000000");
    } else {
      SystemUI.setBackgroundColorAsync("#F6F7F9");
    }
  }, [colorScheme]);

  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf")
  });

  const router = useRouter();

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

        <Image source={require("../../assets/images/bg-menina-ok.webp")}
          style={styles.Bg}
          resizeMode="cover"
        />

        <View style={styles.Wrapper}>

          <View style={styles.Header}>
            <Image
              source={require("../../assets/images/logo-easy-donate.webp")}
              style={styles.ImgEasyDonate}
            />
          </View>

          <View style={styles.Section}>
            <View style={styles.WrapperLoginCadastro}>
              <Text
                style={styles.H1}>{Inicio.ola}</Text>

              <Text style={styles.H2}>{Inicio.mudar_vidas}</Text>

              <TouchableOpacity style={styles.BtnLogin} onPress={() => router.navigate('/(public)/login')}>
                <Text style={styles.BtnTextLogin}>{Inicio.login}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.BtnCadastro} onPress={() => router.navigate('/(public)/cadastro')}>
                <Text style={styles.BtnTextCadastro}>{Inicio.cadastro}</Text>
              </TouchableOpacity>

              <Text style={styles.P}>{Inicio.transformar_generosidade}</Text>
            </View>
          </View>

          <View style={styles.Footer}>
            <View style={styles.WrapperCopy}>
              <Text style={styles.TextLive}>live</Text>
              <Text style={styles.TextFour}>4</Text>
              <Text style={styles.TextTech}>tech</Text>
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
    justifyContent: "center"
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
    height: "25%",
    display: "flex",
    justifyContent: "flex-end"
  },
  ImgEasyDonate: {
    //backgroundColor: "#121212"
    width: "100%",
    height: 100
  },
  Section: {
    //backgroundColor: "#ff0",
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
  },
  WrapperLoginCadastro: {
    //backgroundColor: "#0ff",
    width: "100%",
    height: "80%",
    display: "flex",
    alignItems: "center",
    marginTop: "20%"
  },
  H1: {
    fontSize: 36,
    color: Colors.ORANGE,
    fontFamily: "Montserrat-Bold"
  },
  H2: {
    fontSize: 17,
    color: Colors.WHITE,
    fontFamily: "Montserrat",
    marginBottom: 15
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
  BtnCadastro: {
    width: "100%",
    backgroundColor: Colors.WHITE,
    padding: 12,
    borderRadius: 5,
    marginBottom: 30
  },
  BtnTextCadastro: {
    textAlign: "center",
    color: Colors.ORANGE,
    fontSize: 17,
    fontFamily: "Montserrat-Medium"
  },
  P: {
    textAlign: "center",
    color: Colors.WHITE,
    fontSize: 17,
    fontFamily: "Montserrat"
  },
  Footer: {
    //backgroundColor: "#f00",
    width: "100%",
    height: "15%",
    display: "flex",
    justifyContent: "flex-end"
  },
  WrapperCopy: {
    //backgroundColor: "#121212",
    width: "100%",
    height: 60,
    marginBottom: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    flexDirection: "row"
  },
  TextLive: {
    color: Colors.WHITE,
    fontFamily: "Montserrat-BoldItalic",
    fontSize: 19
  },
  TextFour: {
    color: Colors.WHITE,
    fontFamily: "Montserrat-Italic",
    fontSize: 20
  },
  TextTech: {
    color: Colors.WHITE,
    fontFamily: "Montserrat-BoldItalic",
    fontSize: 19
  }
})