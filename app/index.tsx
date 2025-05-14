import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../components/Colors";

type JwtPayload = {
  exp: number;
};

export default function Index() {

  const router = useRouter();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");

        if (token) {
          const decoded: JwtPayload = jwtDecode(token);
          const agora = Date.now() / 1000;

          if (decoded.exp && decoded.exp > agora) {
            router.replace("/home");
            return;
          }
        }
      } catch (err) {
        console.log("Erro ao verificar token:", err);
      }

      router.replace("/inicio");
    };

    verificarAutenticacao();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.Container}></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BG
  }
})