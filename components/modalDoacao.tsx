import api from "@/api/axios";
import { useModalFeedback } from "@/contexts/ModalFeedbackContext";
import { useAuth } from "@/routes/AuthContext";
import { Doador } from "@/types/Doador";
import { Ong } from "@/types/Ong";
import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import Dropdown from "./dropdown";

type ModalDoacaoProps = {
    visible: boolean;
    onClose: () => void;
    ong: Ong;
};

export default function ModalDoacao({ visible, onClose, ong }: ModalDoacaoProps) {
    const { usuario } = useAuth();
    const [tipoItem, setTipoItem] = useState('');
    const [metodoEnvio, setMetodoEnvio] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [descricao, setDescricao] = useState('');
    const [endereco, setEndereco] = useState('');
    const [dataColeta, setDataColeta] = useState('');
    const [horaColeta, setHoraColeta] = useState('');
    const [idDoador, setIdDoador] = useState<Number>();
    const [status] = useState('');
    const { mostrarModalFeedback } = useModalFeedback();

    // [PUXAR ENDEREÇO DA ONG]
    useEffect(() => {
        if (ong.rua && ong.numero) {
            setEndereco(`${ong.rua}, ${ong.numero}`);
        } else if (ong.rua && !ong.numero) {
            setEndereco(`${ong.rua}`);
        }
    }, [ong.rua, ong.numero]);

    // [APARECER OS CAMPOS DE ACORDO COM QUE TIPO DE DOAÇÃO A ONG ACEITA]
    const getTipoDoacaoOptions = () => {
        switch (ong.tipoAtividade) {
            case "Dinheiro":
                return [{ value: "Dinheiro", label: "Dinheiro" }];
            case "Alimentos":
                return [{ value: "Alimentos", label: "Alimentos / Ração" }];
            case "Roupas":
                return [{ value: "Roupas", label: "Roupas" }];
            case "Geral":
                return [
                    { value: "Roupas", label: "Roupas" },
                    { value: "Dinheiro", label: "Dinheiro" },
                    { value: "Alimentos", label: "Alimentos / Ração" },
                    { value: "Outros", label: "Outros" }
                ];
            default:
                return [
                    { value: "Roupas", label: "Roupas" },
                    { value: "Dinheiro", label: "Dinheiro" },
                    { value: "Alimentos", label: "Alimentos / Ração" },
                    { value: "Outros", label: "Outros" }
                ];
        }
    };

    // [LIMPAR CAMPOS E FECHAR MODAL]
    const handleClose = () => {
        setTipoItem('');
        setMetodoEnvio('');
        setQuantidade('');
        setDescricao('');
        setDataColeta('');
        setHoraColeta('');
        onClose();
    }

    // [PEGAR ID DOADOR]
    const fetchDoador = async () => {
        try {
            const response = await api.get<Doador>(`/Doador/${usuario.idUsuario}`);

            if (response.status === 200) {
                setIdDoador(response.data.idDoador);
            } else {
                return;
            }
        } catch (error: any) {
            //console.log(error);
        }
    };

    useEffect(() => {
        fetchDoador();
    }, []);

    const cadastrarDoacao = async () => {
        if (!tipoItem) {
            Alert.alert("Erro", "Selecione um tipo de doação!");
            return;
        }

        // [DOAÇÃO DE DINHEIRO]
        if (tipoItem === "Dinheiro") {
            const regexQuantidade = /^\d{1,8}([.,]\d{1,2})?$/;

            if (regexQuantidade.test(quantidade)) {
                let bodyRequestDoacao: any = {
                    idDoador,
                    idOng: ong.idOng,
                    tipoItem,
                    quantidade: parseFloat(quantidade.replace(',', '.')),
                    descricao: "Doação em dinheiro",
                    status: "Pendente"
                };

                try {
                    const response = await api.post('/Doacao', bodyRequestDoacao);

                    if (response.status === 201) {
                        handleClose();
                        mostrarModalFeedback("Doação realizada com sucesso!", 'success');
                        //Alert.alert("Sucesso", "Doação realizada com sucesso!");
                        return;
                    }
                } catch (error: any) {
                    console.warn("Erro ao cadastrar doação: ", error);

                    let msg = "Erro ao realizar cadastro de doação!";

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
            } else {
                mostrarModalFeedback("Por favor, insira um valor válido com até 8 dígitos inteiros e 2 casas decimais.", "error");
                return;
            }
        }

        if (tipoItem && tipoItem !== "Dinheiro") {
            if (!metodoEnvio) {
                mostrarModalFeedback("Selecione um método de envio!", 'error');
                return;
            }

            const regexQuantidade = /^\d{1,8}([.,]\d{1,2})?$/;
            if (regexQuantidade.test(quantidade) && descricao) {
                let bodyRequestDoacao: any = {
                    idDoador,
                    idOng: ong.idOng,
                    tipoItem,
                    quantidade: parseFloat(quantidade.replace(',', '.')),
                    descricao,
                    status: "Andamento"
                };

                try {
                    const response = await api.post('/Doacao', bodyRequestDoacao);

                    if (response.status === 201) {
                        handleClose();
                        mostrarModalFeedback("Doação realizada com sucesso!", 'success');
                        return;
                    }
                } catch (error: any) {
                    console.warn("Erro ao cadastrar doação: ", error);

                    let msg = "Erro ao realizar cadastro de doação!";

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
            } else if (!regexQuantidade.test(quantidade) || !descricao) {
                mostrarModalFeedback("Preencha todos os campos!", 'error');
                return;
            }

            if (metodoEnvio === "Coleta" && (!regexQuantidade.test(quantidade) || !descricao || !dataColeta || !horaColeta)) {
                mostrarModalFeedback("Preencha todos os campos!", 'error');
                return;
            } else if (metodoEnvio === "Coleta" && (regexQuantidade.test(quantidade) && descricao && dataColeta && horaColeta)) {
                let bodyRequestDoacao: any = {
                    idDoador,
                    idOng: ong.idOng,
                    tipoItem,
                    quantidade: parseFloat(quantidade.replace(',', '.')),
                    descricao,
                    status: "Pendente",
                    dataColeta,
                    horaColeta
                };

                try {
                    const response = await api.post('/Doacao', bodyRequestDoacao);

                    if (response.status === 201) {
                        handleClose();
                        mostrarModalFeedback("Doação realizada com sucesso!", 'success');
                        return;
                    }
                } catch (error: any) {
                    console.warn("Erro ao cadastrar doação:", error);

                    let msg = "Erro ao realizar cadastro de doação!";

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
            }
        }
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
            animationType="slide"
        >
            <View style={styles.ModalDoar}>
                <View style={styles.Header}>
                    <Text style={styles.Title}>Cadastrar Doação</Text>
                </View>

                <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
                    <View style={styles.WrapperInputs}>
                        <View style={styles.InputNormal}>
                            <Text style={styles.Label}>Tipo Doação</Text>
                            <Dropdown
                                data={getTipoDoacaoOptions()}
                                buttonStyle={{ backgroundColor: Colors.INPUT_GRAY }}
                                optionsStyle={{ backgroundColor: Colors.INPUT_GRAY, borderWidth: 1, borderColor: Colors.GRAY }}
                                onChange={(item) => setTipoItem(item.value)}
                                placeholder="Selecione..."
                            />
                        </View>

                        {(tipoItem !== "Dinheiro" && tipoItem !== "") && (
                            <View style={styles.InputNormal}>
                                <Text style={styles.Label}>Método Envio</Text>
                                <Dropdown
                                    data={[
                                        { value: "Coleta", label: "Coleta" },
                                        { value: "Entrega", label: "Entrega" }
                                    ]}
                                    buttonStyle={{ backgroundColor: Colors.INPUT_GRAY }}
                                    optionsStyle={{ backgroundColor: Colors.INPUT_GRAY, borderWidth: 1, borderColor: Colors.GRAY }}
                                    onChange={(item) => setMetodoEnvio(item.value)}
                                    placeholder="Selecione..."
                                />
                            </View>
                        )}

                        {tipoItem === "Dinheiro" && (
                            <View style={styles.InputNormal}>
                                <Text style={styles.Label}>Valor em Reais</Text>
                                <TextInput
                                    placeholder="0.00"
                                    maxLength={10}
                                    style={styles.Input}
                                    keyboardType="decimal-pad"
                                    value={quantidade}
                                    onChangeText={setQuantidade}
                                />
                            </View>
                        )}

                        {(tipoItem !== "Dinheiro" && tipoItem !== "") && (
                            <View style={styles.InputNormal}>
                                <Text style={styles.Label}>Quantidade</Text>
                                <TextInput
                                    placeholder="0"
                                    maxLength={10}
                                    style={styles.Input}
                                    keyboardType="decimal-pad"
                                    value={quantidade}
                                    onChangeText={setQuantidade}
                                />
                            </View>
                        )}

                        {(tipoItem !== "Dinheiro" && tipoItem !== "") && (
                            <View style={styles.InputNormal}>
                                <Text style={styles.Label}>Descrição</Text>
                                <TextInput
                                    placeholder="Ex: 10Kg arroz, 5kg feijão"
                                    maxLength={255}
                                    style={styles.Input}
                                    value={descricao}
                                    onChangeText={setDescricao}
                                />
                            </View>
                        )}

                        {(tipoItem !== "" && metodoEnvio === "Entrega") && (
                            <View style={styles.InputNormal}>
                                <Text style={styles.Label}>Endereço da ONG</Text>
                                <TextInput
                                    placeholder="Endereço"
                                    maxLength={255}
                                    style={styles.Input}
                                    value={endereco}
                                    onChangeText={setEndereco}
                                    editable={false}
                                    multiline={true}
                                />
                            </View>
                        )}

                        {metodoEnvio === "Coleta" && (
                            <View style={styles.InputDuplo}>
                                <View style={styles.WrapperInputMini}>
                                    <Text style={styles.Label}>Data Coleta</Text>
                                    <TextInput
                                        placeholder="00/00/0000"
                                        maxLength={8}
                                        keyboardType="number-pad"
                                        style={styles.Input}
                                        value={dataColeta}
                                        onChangeText={setDataColeta}
                                    />
                                </View>
                                <View style={styles.WrapperInputMini}>
                                    <Text style={styles.Label}>Hora Coleta</Text>
                                    <TextInput
                                        placeholder="00:00"
                                        maxLength={4}
                                        keyboardType="number-pad"
                                        style={styles.Input}
                                        value={horaColeta}
                                        onChangeText={setHoraColeta}
                                    />
                                </View>
                            </View>
                        )}

                    </View>
                </ScrollView>

                <View style={styles.WrapperButtons}>
                    <Pressable style={styles.BtnFechar} onPress={handleClose}>
                        <Text style={styles.TextBtnfechar}>Fechar</Text>
                    </Pressable>

                    <TouchableOpacity style={styles.BtnDoar} activeOpacity={0.8} onPress={cadastrarDoacao}>
                        <Text style={styles.TextBtnDoar}>Doar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    ModalDoar: {
        backgroundColor: Colors.WHITE,
        width: "100%",
        height: "71%",
        position: "absolute",
        bottom: 0,
        zIndex: 9999,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 40,
        paddingHorizontal: 40,
        paddingBottom: 10
    },
    Header: {
        //backgroundColor: "#f00",
        width: "100%",
        alignItems: "center"
    },
    Title: {
        textAlign: "center",
        fontFamily: "Montserrat-Bold",
        fontSize: 20,
        color: Colors.ORANGE
    },
    WrapperInputs: {
        //backgroundColor: "#ff0",
        width: "100%",
        height: "100%",
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    WrapperInputMini: {
        width: "47.5%"
    },
    Label: {
        fontFamily: "Montserrat"
    },
    InputNormal: {
        //backgroundColor: "#0f0",
        width: "100%",
        marginBottom: 20
    },
    InputDuplo: {
        width: "100%",
        flexDirection: "row",
        gap: "5%",
        fontFamily: "Montserrat"
    },
    Input: {
        backgroundColor: Colors.INPUT_GRAY,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 4,
        paddingHorizontal: 15,
        fontFamily: "Montserrat"
    },
    WrapperButtons: {
        //backgroundColor: "#f00",
        width: "100%",
        height: "12%",
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        paddingBottom: 10
    },
    BtnFechar: {
        backgroundColor: Colors.WHITE,
        width: 120,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4
    },
    TextBtnfechar: {
        color: Colors.BLACK,
        fontFamily: "Montserrat"
    },
    BtnDoar: {
        backgroundColor: Colors.ORANGE,
        width: 120,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4
    },
    TextBtnDoar: {
        color: Colors.WHITE,
        fontFamily: "Montserrat"
    }
});