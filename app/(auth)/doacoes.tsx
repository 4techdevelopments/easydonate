import BottomNavigation from "@/components/bottomNavigation";
import EasyDonateSvg from "@/components/easyDonateSvg";
import PrivateRoute from "@/routes/PrivateRoute";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts } from "expo-font";
import React, { useRef, useState } from "react";
import {
    LayoutChangeEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

const filtros = ["Todas", "Pendentes", "Em andamento", "Concluídas"] as const;

type FiltroStatus = typeof filtros[number];

type Doacao = {
    id: number;
    status: FiltroStatus;
    progresso: number;
    total: number;
    titulo: string;
    peso: string;
    data: string;
    ong: string;
    icone: React.ComponentProps<typeof FontAwesome6>['name'];
};

const MOCK_DOACOES: Doacao[] = [
    { id: 1, status: "Em andamento", progresso: 7, total: 10, titulo: "Alimentos", peso: "10 kg", data: "08/04/2025", ong: "ONG Viver", icone: "fastfood" },
    { id: 2, status: "Pendentes", progresso: 0, total: 5, titulo: "Roupas", peso: "3 kg", data: "10/04/2025", ong: "ONG Esperança", icone: "checkroom" },
    { id: 3, status: "Concluídas", progresso: 5, total: 5, titulo: "Brinquedos", peso: "2 kg", data: "05/04/2025", ong: "ONG Feliz", icone: "toys" },
];

function CardDoacao({ doacao }: { doacao: Doacao }) {
    return (



        <View style={styles.CardContainer}>
            <View style={styles.CardStatus}>
                <Text style={styles.CardStatusText}>{doacao.status}</Text>
            </View>
            <View style={styles.ProgressWrapper}>
                <View style={styles.ProgressBarBackground}>
                    <View style={[styles.ProgressBarFill, { width: `${(doacao.progresso / doacao.total) * 100}%` }]} />
                </View>
                <Text style={styles.ProgressText}>{doacao.progresso}/{doacao.total} itens doados</Text>
            </View>
            <View style={styles.CardContent}>
                <MaterialIcons name={doacao.icone} size={35} color="#000" />
                <View style={styles.CardInfo}>
                    <Text style={styles.CardTitle} numberOfLines={1} ellipsizeMode="tail">
                        {doacao.titulo}
                    </Text>

                    <View style={styles.CardBadge}>
                        <Text style={styles.CardBadgeText}>{doacao.peso}</Text>
                    </View>
                    <Text style={styles.CardDate}>{doacao.data}</Text>
                </View>
                <View style={styles.CardOng}>
                    <Text style={styles.CardPara}>Para:</Text>
                    <Text style={styles.CardOngName}>{doacao.ong}</Text>
                    <FontAwesome6 name="check-circle" size={16} color={Colors.ORANGE} style={{ marginLeft: 4 }} />
                </View>
            </View>
        </View>

    );
}


export default function Doacoes() {
    const [filtro, setFiltro] = useState<FiltroStatus>("Todas");
    const scrollRef = useRef<ScrollView>(null);
    const optionX = useRef<Record<string, number>>({});

    const [doacoes] = useState<Doacao[]>(MOCK_DOACOES);

    // Função onEditar removida, não existe mais.

    const onPressOption = (opcao: FiltroStatus) => {
        setFiltro(opcao);
        const x = optionX.current[opcao] ?? 0;
        scrollRef.current?.scrollTo({ x, animated: true });
    };

    const doacoesFiltradas =
        filtro === "Todas" ? doacoes : doacoes.filter(d => d.status === filtro);

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
        "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf"),
    });

    if (!fontsLoaded) {
        return (
            <View style={[styles.Container, { backgroundColor: Colors.BG }]}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.Container}>
                    <View style={styles.Wrapper}>
                        <View style={styles.Header}>
                            <View style={styles.WrapperTitulo}>
                                <View style={styles.DivOla}>

                                </View>
                                <View style={styles.DivPerfil}>
                                    <View style={styles.Img}>
                                        <FontAwesome6 name="user-large" size={15} color={Colors.ORANGE} />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.ScrollAll}>
                            <View style={styles.Section}>
                                <View style={styles.WrapperTextoDoar}>
                                    <View>
                                        <Text style={styles.TextVamos}>Histórico de</Text>
                                        <Text style={styles.TextDoar}>Doações</Text>
                                    </View>
                                    <TouchableOpacity style={styles.BtnNovaDoacao}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <MaterialIcons name="library-add" size={20} color="white" style={{ marginRight: 5 }} />
                                            <Text style={styles.TxtNovaDoacao}> Nova doação </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.DivOptions}>
                                    <ScrollView
                                        ref={scrollRef}
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={styles.OptionsContainer}
                                    >
                                        {filtros.map((opcao) => (
                                            <TouchableWithoutFeedback key={opcao} onPress={() => onPressOption(opcao)}>
                                                <View
                                                    style={filtro === opcao ? styles.OptionsActive : styles.Options}
                                                    onLayout={(e: LayoutChangeEvent) => { optionX.current[opcao] = e.nativeEvent.layout.x; }}
                                                >
                                                    <Text style={filtro === opcao ? styles.TextOptionsActive : styles.TextOptions}>
                                                        {opcao}
                                                    </Text>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        ))}
                                    </ScrollView>
                                </View>

                                {doacoesFiltradas.length === 0 ? (
                                    <View style={styles.CardContainer}>
                                        <Text style={styles.EmptyText}>
                                            {filtro === "Todas"
                                                ? "Você ainda não realizou nenhuma doação."
                                                : `Nenhuma doação ${filtro.toLowerCase()}.`}
                                        </Text>
                                    </View>
                                ) : (
                                    doacoesFiltradas.map((d) => (
                                        <CardDoacao key={d.id} doacao={d} />
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

// CSS
const styles = StyleSheet.create({
    Container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: Colors.BG },
    Wrapper: { width: "80%", height: "100%" },
    ScrollAll: { width: "100%" },
    Header: { width: "100%", height: "7%", justifyContent: "flex-end" },
    WrapperTitulo: { width: "100%", height: "90%", flexDirection: "row" },
    DivOla: { width: "85%", justifyContent: "center" },
    Text: { fontFamily: "Montserrat", fontSize: 18 },
    TextNome: { fontFamily: "Montserrat-Bold", fontSize: 18, color: Colors.ORANGE },
    DivPerfil: { width: "15%", alignItems: "flex-end", justifyContent: "center" },
    Img: { backgroundColor: Colors.BG, width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: Colors.ORANGE },
    Section: { width: "100%", paddingTop: 30 },
    WrapperTextoDoar: { width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    TextVamos: { fontSize: 20, fontFamily: "Montserrat" },
    TextDoar: { fontSize: 24, fontFamily: "Montserrat-Bold" },
    BtnNovaDoacao: { width: '55%', height: 50, backgroundColor: Colors.ORANGE, justifyContent: "center", alignItems: "center", borderRadius: 15 },
    TxtNovaDoacao: { fontFamily: "Montserrat", color: Colors.WHITE, fontSize: 16 },
    DivOptions: { width: "100%", marginTop: 30 },
    OptionsContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    Options: { paddingHorizontal: 15, paddingVertical: 6, marginHorizontal: 8, alignItems: "center" },
    OptionsActive: { paddingHorizontal: 15, paddingVertical: 6, marginHorizontal: 8, alignItems: "center", borderBottomWidth: 3, borderBottomColor: Colors.ORANGE },
    TextOptions: { fontSize: 14, fontFamily: "Montserrat", color: "#000" },
    TextOptionsActive: { fontSize: 14, fontFamily: "Montserrat-Bold", color: Colors.ORANGE },
    CardContainer: { backgroundColor: Colors.INPUT_GRAY, borderRadius: 20, padding: 16, marginVertical: 20 },
    CardStatus: { alignSelf: "flex-start", backgroundColor: Colors.ORANGE, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 12 },
    CardStatusText: { fontFamily: "Montserrat", fontSize: 12, color: "#fff" },
    ProgressWrapper: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    ProgressBarBackground: { flex: 1, height: 6, backgroundColor: "#e0e0e0", borderRadius: 3, marginRight: 10 },
    ProgressBarFill: { height: 6, backgroundColor: Colors.ORANGE, borderRadius: 3 },
    ProgressText: { fontFamily: "Montserrat", fontSize: 12, color: "#000" },
    CardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    CardInfo: { flex: 1, marginHorizontal: 10 },
    CardTitle: {
        fontFamily: "Montserrat-Bold",
        fontSize: 13,
        marginBottom: 4,
        flexShrink: 1,
        flexWrap: "nowrap",
    },
    CardBadge: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, alignSelf: "flex-start", marginBottom: 4 },
    CardBadgeText: { fontFamily: "Montserrat", fontSize: 12 },
    CardDate: { fontFamily: "Montserrat-Italic", fontSize: 12, color: "#555" },
    CardOng: { flexDirection: "row", alignItems: "center" },
    CardPara: { fontFamily: "Montserrat", fontSize: 10, marginRight: 3 },
    CardOngName: { fontFamily: "Montserrat-Bold", fontSize: 12, color: "#000" },
    CardOngLogo: { width: 40, height: 40, marginLeft: 8, resizeMode: "contain" },
    EmptyContainer: { padding: 20, alignItems: "center" },
    EmptyText: { fontFamily: "Montserrat", fontSize: 14, color: "#555" },
    Footer: { width: "100%", height: "8%", justifyContent: "flex-end" },
});
