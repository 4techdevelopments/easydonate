import api from '@/api/axios';
import Colors from '@/components/Colors';
import EasyDonateSvg from '@/components/easyDonateSvg';
import ModalDoacao from '@/components/modalDoacao';
import { useModalFeedback } from '@/contexts/ModalFeedbackContext';
import { useAuth } from '@/routes/AuthContext';
import PrivateRoute from '@/routes/PrivateRoute';
import { Ong } from '@/types/Ong';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OngDetalhes() {
    const { idOng } = useLocalSearchParams();
    const { usuario } = useAuth();
    const router = useRouter();
    const [ong, setOng] = useState<Ong | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const { mostrarModalFeedback } = useModalFeedback();

    const isDono = usuario?.tipoUsuario === 'Ong' && usuario?.idUsuario === ong?.idUsuario;
    const isDoador = usuario?.tipoUsuario === 'Doador';

    // [PUXAR TODAS AS ONGS]
    const fetchOng = async () => {
        try {
            setLoading(true);
            const response = await api.get<Ong>(`/Ong/${idOng}`);

            if (response.status === 200) {
                setOng(response.data);
            }

        } catch (error: any) {
            console.warn(error)

            let msg = "ONG não encontrada!";
            if (typeof error.response?.data === "string") {
                msg = error.response.data;
            } else if (error.response?.data?.message) {
                msg = error.response.data.message;
            }

            mostrarModalFeedback(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOng();
    }, []);

    // [ALTERAR DADOS DA ONG]
    const handleSave = async () => {
        if (ong?.cidade === null) {
            mostrarModalFeedback("Preencha sua cidade!", 'error');
            return;
        }

        if (ong?.estado.length !== 2) {
            mostrarModalFeedback("Preencha com um estado válido!", 'error');
            return;
        }

        if (ong?.ddd.length !== 2) {
            mostrarModalFeedback("Preencha com um DDD válido!", 'error');
            return;
        }

        if (ong?.telefone !== null && ong?.telefone?.length !== 8) {
            mostrarModalFeedback("Preencha com um telefone válido!", 'error');
            return;
        }

        if (ong?.telefoneCelular !== null && ong?.telefoneCelular?.length !== 9) {
            mostrarModalFeedback("Preencha com um celular válido!", 'error');
            return;
        }

        try {
            const response = await api.put(`/Ong/${idOng}`, ong);

            if (response.status === 200) {
                mostrarModalFeedback("Dados atualizados com sucesso", 'success');
                setTimeout(() => {
                    router.replace('/home');
                }, 2100);
            }

        } catch (error: any) {

            let msg = "ONG não encontrada!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            mostrarModalFeedback(msg, 'error');
        }
    };

    // [SELECIONAR IMAGEM E SALVAR]
    const handleImagePick = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            mostrarModalFeedback('É necessário permitir acesso à galeria para selecionar uma imagem.', 'error', undefined, 'Permissão Negada!');
            return;
        }

        // Abre a galeria
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        // Se o usuário cancelou, não faz nada
        if (result.canceled) return;

        const selectedImageUri = result.assets[0].uri;

        // Aqui você pode chamar sua função de upload com a URI
        handleUpload(selectedImageUri);

        setTimeout(() => {
            router.push('/(auth)/home');
        }, 2100);
    };

    const IMG_BB_API_KEY = "730d4ced756f66548ca8bdc5295b81a0";

    // [UPLOAD LOGO]
    const handleUpload = async (uri: string) => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result?.toString().split(",")[1] || "");
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            const formData = new FormData();
            formData.append("image", base64);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const uploadData = await res.json();
            const uploadedUrl = uploadData.data?.url;
            if (!uploadedUrl) throw new Error("Falha ao obter URL da imagem do ImgBB.");
            await api.put(`/Upload/Logo/${ong?.idOng}`, {
                idOng: ong?.idOng,
                logo: uploadedUrl
            });

            setLogoUrl(uploadedUrl);
        } catch (error) {
            console.warn("Erro no processo de upload:", error);
            mostrarModalFeedback("Não foi possível enviar sua foto. Tente novamente.", 'error', undefined, 'Erro de Upload!');
            return;
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
                    <ModalDoacao
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        ong={ong}
                    />

                    <View style={styles.Wrapper}>

                        <View style={styles.Header}>
                            <TouchableOpacity style={styles.BtnVoltar} onPress={() => router.push('/home')}>
                                <Entypo name="chevron-left" style={styles.IconVoltar} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.title}>Detalhes da ONG</Text>

                        <View style={styles.Section}>
                            <ScrollView horizontal={false} showsVerticalScrollIndicator={true}>

                                {((isDoador || !isDono) && ong.logo) ? (
                                    <View style={styles.CardImg}>
                                        <View style={styles.WrapperImg}>
                                            {ong?.logo ? (
                                                <Image
                                                    source={{ uri: ong.logo }}
                                                    resizeMode='center'
                                                    style={styles.OngLogo}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                ) : null}

                                {isDono && (
                                    <View style={styles.CardImg}>
                                        <Pressable style={styles.WrapperImg} onPress={handleImagePick}>
                                            {ong?.logo ? (
                                                <Image
                                                    source={{ uri: logoUrl || ong.logo }}
                                                    resizeMode='center'
                                                    style={styles.OngLogo}
                                                />
                                            ) : (
                                                <View style={{ width: "100%", height: "100%", justifyContent: "center", alignContent: "center", borderWidth: 2, borderColor: Colors.ORANGE, borderRadius: 15 }}>
                                                    <MaterialIcons name='cloud-upload' size={100} color={Colors.ORANGE} style={{ textAlign: "center" }} />
                                                    <Text style={{ textAlign: "center", fontSize: 17, color: Colors.ORANGE }}>Escolher Imagem</Text>
                                                </View>
                                            )}
                                        </Pressable>
                                    </View>
                                )}

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Nome</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.nome}
                                        maxLength={255}
                                        onChangeText={(text) => setOng({ ...ong, nome: text })}
                                        editable={false}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Tipo de Doação</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.tipoAtividade}
                                        maxLength={255}
                                        onChangeText={(text) => setOng({ ...ong, tipoAtividade: text })}
                                        editable={false}
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
                                    <Text style={styles.label}>Rede Social</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.redeSocial || ""}
                                        maxLength={9}
                                        onChangeText={(text) => setOng({ ...ong, redeSocial: text })}
                                        editable={isDono}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Site</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={ong.site || ""}
                                        maxLength={9}
                                        onChangeText={(text) => setOng({ ...ong, site: text })}
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
                                    <Text style={styles.TextSalvar}>Salvar Alterações</Text>
                                </TouchableOpacity>
                            )}

                            {isDoador && (
                                <TouchableOpacity style={styles.BtnSalvar} onPress={() => setModalVisible(true)}>
                                    <Text style={styles.TextSalvar}>Doe Agora</Text>
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
    CardImg: {
        //backgroundColor: "#f00",
        width: "100%",
        height: 300,
        marginBottom: 15,
        padding: 30,
        justifyContent: "center",
        alignContent: "center"
    },
    WrapperImg: {
        //backgroundColor: "#cecece",
        width: "100%",
        height: "100%",
        borderRadius: 10,
        justifyContent: "center",
        alignContent: "center"
    },
    OngLogo: {
        width: "100%",
        height: "100%"
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
