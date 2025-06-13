import api from "@/api/axios";
import BottomNavigation from "@/components/bottomNavigation";
import Colors from "@/components/Colors";
import { DisplayAvatar } from '@/components/DisplayAvatar';
import EasyDonateSvg from "@/components/easyDonateSvg";
import OngCard from "@/components/ongCard";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { Ong } from "@/types/Ong";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Home() {
  const { usuario, atualizarUsuario } = useAuth();

  // [INPUT PESQUISA]
  const [searchText, setSearchText] = useState<string>('');

  // [FILTROS GERAL/ROUPAS/ETC]
  const [selectedCategory, setSelectedCategory] = useState<string>('Geral');

  // [ONGS]
  const [ongs, setOngs] = useState<Ong[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // [BUSCAR ONGS]
  const fetchOngs = async () => {
    try {
      setLoading(true);
      const response = await api.get<Ong[]>("/Ong");

      if (response.status === 200) {
        setOngs(response.data);
      } else {
        console.log("Não foi possível caregar as ongs!");
      }
    } catch (error: any) {
      //console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOngs();
  }, []);

  const filteredOngs = ongs.filter(ong => {
    const matchesSearch = ong.nome?.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Geral' ||
      ong.tipoAtividade?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf")
  });

  if (!fontsLoaded || loading) {
    return (
      <View style={[styles.Container, { backgroundColor: Colors.BG }]}>
        <EasyDonateSvg />
      </View>
    )
  }



  return (
    <PrivateRoute>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.Container}>

          <View style={styles.Wrapper}>

            <View style={styles.Header}>
              <View style={styles.WrapperTitulo}>
                <View style={styles.DivOla}>
                  <Text style={styles.Text}>Olá, </Text>
                  <Text style={styles.TextNome}>{usuario?.nome || "Usuário"}</Text>
                  <Text style={styles.Text}>!</Text>
                </View>
                <View style={styles.profileImageContainer}>
                  <DisplayAvatar />
                </View>
              </View>
            </View>
            <ScrollView horizontal={false} showsVerticalScrollIndicator={false} style={styles.ScrollAll}>

              <View style={styles.Section}>
                <View style={styles.WrapperTextoDoar}>
                  <Text style={styles.TextVamos}>O que vamos</Text>
                  <Text style={styles.TextDoar}>Doar hoje?</Text>
                </View>

                <View style={styles.DivInput}>
                  <View style={styles.WrapperInputSearch}>
                    <View style={styles.BtnSearch}>
                      <Octicons name="search" style={styles.IconSearch} />
                    </View>
                    <TextInput
                      value={searchText}
                      onChangeText={setSearchText}
                      placeholder="Buscar Organizações..."
                      style={styles.InputSearch}
                    />
                  </View>
                </View>

                <View style={styles.DivOptions}>
                  <ScrollView horizontal={true} style={styles.ScrollHorizontal} showsHorizontalScrollIndicator={false}>
                    <TouchableWithoutFeedback onPress={() => setSelectedCategory('Geral')}>
                      <View style={selectedCategory === 'Geral' ? styles.OptionsActive : styles.Options}>
                        <Text style={selectedCategory === 'Geral' ? styles.TextOptionsActive : styles.TextOptions}>Geral</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setSelectedCategory('Roupas')}>
                      <View style={selectedCategory === 'Roupas' ? styles.OptionsActive : styles.Options}>
                        <Ionicons name="shirt" size={20} />
                        <Text style={selectedCategory === 'Roupas' ? styles.TextOptionsActive : styles.TextOptions}>Roupas</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setSelectedCategory('Alimentos')}>
                      <View style={selectedCategory === 'Alimentos' ? styles.OptionsActive : styles.Options}>
                        <FontAwesome5 name="hamburger" size={20} />
                        <Text style={selectedCategory === 'Alimentos' ? styles.TextOptionsActive : styles.TextOptions}>Alimentos</Text>
                      </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={() => setSelectedCategory('Dinheiro')}>
                      <View style={selectedCategory === 'Dinheiro' ? styles.OptionsActive : styles.Options}>
                        <MaterialIcons name="pix" size={25} />
                        <Text style={selectedCategory === 'Dinheiro' ? styles.TextOptionsActive : styles.TextOptions}>Dinheiro</Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </ScrollView>
                </View>

                <View style={styles.TextOngs}>
                  <Text style={styles.Ong}>ONGs</Text>
                  <Text style={styles.Sugeridas}>sugeridas</Text>
                </View>

                {filteredOngs.length === 0 ? (
                  <Text style={{ fontFamily: "Montserrat" }}>Nenhuma ONG encontrada.</Text>
                ) : (
                  filteredOngs.map((ong) => (
                    <OngCard key={ong.idOng} ong={ong} />
                  ))
                )}

              </View>

            </ScrollView>
            <View style={styles.Footer}>
              <BottomNavigation />
            </View>

          </View>

        </View>
      </SafeAreaView>
    </PrivateRoute>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.BG
  },
  profileImageContainer: {
    // Não precisa de muito, ele serve como referência para a posição do ícone.
    // Pode-se definir width e height se necessário, mas vamos começar simples.
    position: 'relative', // Padrão, mas bom deixar explícito para clareza
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  editIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.ORANGE,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.WHITE,
  },
  Wrapper: {
    width: "80%",
    height: "100%"
  },
  ScrollAll: {
    width: "100%"
  },
  Header: {
    //backgroundColor: "#0f0",
    marginTop: 15,
    width: "100%",
    height: "7%",
    display: "flex",
    justifyContent: "flex-end"
  },
  WrapperTitulo: {
    //backgroundColor: "#00ffff80",
    width: "100%",
    height: "90%",
    display: "flex",
    flexDirection: "row"
  },
  DivOla: {
    //backgroundColor: "#f00",
    width: "85%",
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  Text: {
    fontFamily: "Montserrat",
    fontSize: 18
  },
  TextNome: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18,
    color: Colors.ORANGE
  },
  DivPerfil: {
    // backgroundColor: "#fff",
    width: "15%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  Img: {
    backgroundColor: Colors.ORANGE,
    width: 42.5,
    height: 42.5,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 2,
    // borderColor: Colors.ORANGE,
    overflow: 'hidden'
  },
  Section: {
    //backgroundColor: "#ff0",
    width: "100%",
    height: "85%",
    paddingTop: 30
  },
  WrapperTextoDoar: {
    //backgroundColor: "#f00",
    width: "100%",
    marginBottom: 30
  },
  TextVamos: {
    fontSize: 20,
    fontFamily: "Montserrat"
  },
  TextDoar: {
    fontSize: 24,
    fontFamily: "Montserrat-Bold"
  },
  DivInput: {
    //backgroundColor: "#0ff",
    width: "100%"
  },
  WrapperInputSearch: {
    width: "88%",
    display: "flex",
    flexDirection: "row"
  },
  BtnSearch: {
    backgroundColor: Colors.INPUT_GRAY,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  IconSearch: {
    fontSize: 20,
    color: Colors.GRAY,
    padding: 10
  },
  InputSearch: {
    width: "100%",
    backgroundColor: Colors.INPUT_GRAY,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    fontFamily: "Montserrat"
  },
  BtnFilter: {
    backgroundColor: Colors.INPUT_GRAY,
    marginLeft: "5%",
    width: "13%",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  ScrollHorizontal: {
    width: "100%"
  },
  DivOptions: {
    //backgroundColor: "#f00",
    width: "100%",
    marginTop: 30,
    display: "flex",
    flexDirection: "row"
  },
  OptionsActive: {
    //backgroundColor: "#0ff",
    width: 120,
    height: 40,
    borderWidth: 1.5,
    borderColor: Colors.ORANGE,
    marginRight: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  TextOptionsActive: {
    fontSize: 14,
    fontFamily: "Montserrat-Bold"
  },
  Options: {
    //backgroundColor: "#0ff",
    width: 120,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    marginRight: 20,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  TextOptions: {
    fontSize: 14,
    fontFamily: "Montserrat"
  },
  IconFilter: {
    fontSize: 20,
    color: Colors.ORANGE
  },
  TextOngs: {
    //backgroundColor: "#f00",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 40,
    marginBottom: 15
  },
  Ong: {
    fontFamily: "Montserrat-Bold",
    fontSize: 18
  },
  Sugeridas: {
    fontFamily: "Montserrat",
    fontSize: 18
  },
  Footer: {
    width: "100%",
    height: "8%",
    display: "flex",
    justifyContent: "flex-end"
  }
})