import api from '@/api/axios';
import Colors from '@/components/Colors';
import EasyDonateSvg from '@/components/easyDonateSvg';
import { useAuth } from '@/routes/AuthContext';
import PrivateRoute from '@/routes/PrivateRoute';
import { Ong } from '@/types/Ong';
import { Entypo } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OngDetalhes() {
    const { idOng } = useLocalSearchParams();
    const { usuario } = useAuth();
    const router = useRouter();

    const [ong, setOng] = useState<Ong | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const isDono = usuario?.tipoUsuario === 'Ong' && usuario?.idUsuario === ong?.idUsuario;

    const fetchOng = async () => {
        try {
            setLoading(true);
            const response = await api.get<Ong>(`/Ong/${idOng}`);

            if (response.status === 200) {
                setOng(response.data);
            }
            //console.log(response.data);
        } catch (error: any) {
            console.log(error)

            let msg = "ONG não encontrada!";
            if (typeof error.response?.data === "string") {
                msg = error.response.data;
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOng();
    }, []);

    const handleSave = async () => {
        try {
            await api.put(`/Ong/${idOng}`, ong);
            Alert.alert('Sucesso', 'Dados atualizados com sucesso');
        } catch (error: any) {

            let msg = "ONG não encontrada!";
            if (typeof error.response?.data === "string") {
                msg = error.response.data;
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }

            Alert.alert('Erro', msg);
        }
    };

    if (loading || !ong) {
        return (
            <View style={styles.Container}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.BG }}>
                <View style={styles.Container}>
                    <View style={styles.Wrapper}>

                        <View style={styles.Header}>
                            <TouchableOpacity style={styles.BtnVoltar} onPress={() => router.push('/home')}>
                                <Entypo name="chevron-left" style={styles.IconVoltar} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.title}>Detalhes da ONG</Text>

                        <View style={styles.Section}>
                            <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nome</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.nome}
                                        maxLength={255}
                                        onChangeText={(text) => setOng({ ...ong, nome: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Tipo de Doação</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.tipoAtividade}
                                        maxLength={255}
                                        onChangeText={(text) => setOng({ ...ong, tipoAtividade: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Cidade</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.cidade}
                                        maxLength={100}
                                        onChangeText={(text) => setOng({ ...ong, cidade: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Estado</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.estado}
                                        maxLength={2}
                                        onChangeText={(text) => setOng({ ...ong, estado: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>DDD</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.ddd}
                                        maxLength={2}
                                        onChangeText={(text) => setOng({ ...ong, ddd: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Telefone</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.telefone || ""}
                                        maxLength={8}
                                        onChangeText={(text) => setOng({ ...ong, telefone: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Celular</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.telefoneCelular || ""}
                                        maxLength={9}
                                        onChangeText={(text) => setOng({ ...ong, telefoneCelular: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Descrição da ONG</Text>
                                    <TextInput
                                        style={styles.TextArea}
                                        value={ong.descricaoMissao || ""}
                                        maxLength={1000}
                                        onChangeText={(text) => setOng({ ...ong, descricaoMissao: text })}
                                        multiline
                                        editable={isDono}
                                    />
                                </View>
                            </ScrollView>
                        </View>

                        <View style={styles.Footer}>
                            {isDono && (
                                <TouchableOpacity onPress={handleSave} style={styles.BtnSalvar}>
                                    <Text style={styles.TextSalvar}>Salvar</Text>
                                </TouchableOpacity>
                            )}
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
    Wrapper: {
        width: "80%",
        height: "100%"
    },
    Header: {
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
        backgroundColor: Colors.BG,
        marginBottom: 20,
    },
    IconVoltar: {
        color: Colors.BLACK,
        fontSize: 18
    },
    title: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 20,
        color: Colors.ORANGE
    },
    Section: {
        //backgroundColor: "#f00",
        width: "100%",
        height: "60%"
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontFamily: 'Montserrat',
        marginBottom: 5,
        color: Colors.BLACK
    },
    input: {
        backgroundColor: Colors.INPUT_GRAY,
        padding: 10,
        borderRadius: 5,
        fontFamily: 'Montserrat',
    },
    TextArea: {
        backgroundColor: Colors.INPUT_GRAY,
        height: 100,
        borderRadius: 5,
        fontFamily: "Montserrat"
    },
    Footer: {
        //backgroundColor: "#cecece",
        width: "100%",
        height: "25%",
        marginTop: 20
    },
    BtnSalvar: {
        backgroundColor: Colors.ORANGE,
        width: "100%",
        borderRadius: 5,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10
    },
    TextSalvar: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 16,
    }
});
