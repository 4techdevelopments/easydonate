import api from "@/api/axios";
import BottomNavigation from "@/components/bottomNavigation";
import { DisplayAvatar } from "@/components/DisplayAvatar";
import EasyDonateSvg from "@/components/easyDonateSvg";
import { useAuth } from "@/routes/AuthContext";
import PrivateRoute from "@/routes/PrivateRoute";
import { MaterialIcons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    Alert,
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

// const router = useRouter();

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
    descricao: string;
    icone: React.ComponentProps<typeof FontAwesome6>['name'];
};

const iconePorItem: Record<string, Doacao['icone']> = {
    "Alimentos": "fastfood",
    "Roupas": "checkroom",
    "Dinheiro": "pix",
    "Outros": "volunteer-activism"
}

function formatarPeso(titulo: string, peso: string) {
    const valor = Number(peso);

    switch (titulo) {
        case "Dinheiro":
            return `R$ ${valor.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        case "Roupas":
            return `${Math.round(valor)} un`;
        case "Alimentos":
            return `${peso} kg`;
        case "Outros":
            return peso;
        default:
            return peso;
    }
}

function CardDoacao({ doacao, onPress }: { doacao: Doacao, onPress: (id: number) => void }) {
    return (

        <TouchableOpacity style={styles.CardContainer} onPress={() => onPress(doacao.id)} activeOpacity={0.8}>
            <View style={styles.CardStatus}>
                <Text style={styles.CardStatusText}>{doacao.status}</Text>
            </View>

            <Text style={styles.ProgressText}>Progresso Doação</Text>

            <View style={styles.ProgressWrapper}>
                <View style={styles.ProgressBarBackground}>
                    <View style={[styles.ProgressBarFill, { width: `${(doacao.progresso / doacao.total) * 100}%` }]} />
                </View>
            </View>

            {doacao.titulo !== "Dinheiro" && (
                <View style={styles.CardDescription}>
                    <Text style={styles.CardTextDescriptionBold}>Descrição: </Text>
                    <Text style={styles.CardTextDescription}>{doacao.descricao}</Text>
                </View>
            )}


            <View style={styles.CardContent}>
                <MaterialIcons name={doacao.icone} size={35} color="#000" />
                <View style={styles.CardInfo}>
                    <Text style={styles.CardTitle} numberOfLines={1} ellipsizeMode="tail">
                        {doacao.titulo}
                    </Text>

                    <View style={styles.CardBadge}>
                        <Text style={styles.CardBadgeText}>{formatarPeso(doacao.titulo, doacao.peso)}</Text>
                    </View>
                    <Text style={styles.CardDate}>{doacao.data}</Text>
                </View>
                <View style={styles.CardOng}>
                    <Text style={styles.CardPara}>Para:</Text>
                    <Text style={styles.CardOngName}>{doacao.ong}</Text>
                    <FontAwesome6 name="check-circle" size={16} color={Colors.ORANGE} style={{ marginLeft: 4 }} />
                </View>
            </View>
        </TouchableOpacity>

    );
}

export default function Doacoes() {
    const { usuario } = useAuth();
    const router = useRouter();

    const [filtro, setFiltro] = useState<FiltroStatus>("Todas");
    const scrollRef = useRef<ScrollView>(null);
    const optionX = useRef<Record<string, number>>({});

    const [doacoes, setDoacoes] = useState<Doacao[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const carregarDoacoes = async () => {
            try {
                const response = await api.get("/Doacao");
                const dados: any[] = response.data;

                const doacoesFiltradas = dados.filter(item => {
                    if (usuario?.tipoUsuario === "Doador") {
                        return item.idDoador === usuario.doador.idDoador;
                    } else if (usuario?.tipoUsuario === "Ong") {
                        return item.idOng === usuario.ong.idOng;
                    }

                    return false;
                });

                const doacoesMapeadas = doacoesFiltradas.map((item) => {
                    const statusTraduzido = traduzirStatus(item.status);
                    const progresso = statusTraduzido === "Concluídas" ? 1 : statusTraduzido === "Em andamento" ? 0.5 : 0;

                    return {
                        id: item.idDoacao,
                        status: statusTraduzido,
                        progresso,
                        total: 1,
                        titulo: item.tipoItem,
                        peso: item.quantidade,
                        data: formatarData(item.dataHoraDoacao),
                        ong: item.nome,
                        descricao: item.descricao,
                        icone: iconePorItem[item.tipoItem] ?? "volunteer-activism"
                    };
                });

                setDoacoes(doacoesMapeadas);
            } catch (error) {
                console.warn("Erro ao carregar doações:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarDoacoes();
    }, []);

    const traduzirStatus = (statusApi: string): FiltroStatus => {
        switch (statusApi) {
            case "Pendente": return "Pendentes";
            case "Andamento": return "Em andamento";
            case "Concluido": return "Concluídas";
            default: return "Pendentes";
        }
    };

    const formatarData = (dataISO: string): string => {
        const data = new Date(dataISO);
        return data.toLocaleDateString("pt-BR");
    };

    const onPressOption = (opcao: FiltroStatus) => {
        setFiltro(opcao);
        const x = optionX.current[opcao] ?? 0;
        scrollRef.current?.scrollTo({ x, animated: true });
    };

    const doacoesFiltradas =
        filtro === "Todas" ? doacoes : doacoes.filter(d => d.status === filtro);

    // [ALTERAR STATUS PARA CONCLUÍDO]
    const alterarStatus = async (id: number) => {
        let bodyRequestAgendamento: any = {
            status: "Concluido"
        };

        try {
            const response = await api.put(`/Agendamento/${id}`, bodyRequestAgendamento);

            if (response.status === 200) {
                Alert.alert("Doação confirmada com sucesso!");
                return;
            }

        } catch (error: any) {
            console.log(error);

            let msg = "Não foi possível alterar a situação para finalizado!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            if (msg !== "O agendamento já está concluído!") {
                console.warn(msg);
            }
        }
    }

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
        "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf"),
    });

    if (loading || !fontsLoaded) {
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
                                    <DisplayAvatar />
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
                                        <CardDoacao key={d.id} doacao={d} onPress={(id) => {
                                            if (usuario.tipoUsuario === "Ong") {

                                                Alert.alert(
                                                    "Confirmar Doação", // Título do Alerta
                                                    "Tem certeza que deseja confirmar essa doação? Após mudar a situação para concluída, não poderá ser alterada!", // Mensagem
                                                    [
                                                        // Array de botões
                                                        {
                                                            text: "Não",
                                                            onPress: () => console.log("Exclusão cancelada"),
                                                            style: "cancel" // Estilo para iOS
                                                        },
                                                        {
                                                            text: "Sim, Confirmar",
                                                            onPress: async () => {
                                                                alterarStatus(id);
                                                                setTimeout(() => {
                                                                    router.replace('/doacoes');
                                                                }, 500);
                                                            },
                                                            style: "destructive" // No iOS, isso deixa o texto do botão vermelho
                                                        }
                                                    ]
                                                );


                                            }
                                        }} />
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
    Header: { width: "100%", height: "7%", justifyContent: "flex-end", marginTop: 15, },
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
    ProgressText: { fontFamily: "Montserrat", fontSize: 12, color: "#000", marginBottom: 5 },
    CardContent: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    CardInfo: { flex: 1, marginHorizontal: 10 },
    CardDescription: { width: "100%", marginBottom: 15, flexDirection: "row" },
    CardTextDescriptionBold: { fontFamily: "Montserrat-Bold", fontSize: 12 },
    CardTextDescription: { fontFamily: "Montserrat", fontSize: 12 },
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