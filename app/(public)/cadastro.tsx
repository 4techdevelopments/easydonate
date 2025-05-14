import EasyDonateSvg from "@/components/easyDonateSvg";
import RadioSelector from "@/components/radioGroup";
import { Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Cadastro() {
    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf")
    });

    const [senhasVisiveis, setSenhasVisiveis] = useState<boolean[]>([false, false, false, false]);

    const alternarVisibilidadeSenha = (index: number) => {
        setSenhasVisiveis(prev => {
            const novas = [...prev];
            novas[index] = !novas[index];
            return novas;
        });
    };

    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<string>('Doador(a)');

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

                <Image source={require("../../assets/images/bg-tela-cadastro.png")}
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
                        <View style={styles.WrapperCadastro}>
                            <Text style={styles.H1}>Vamos começar!</Text>
                            <Text style={styles.P}>Escolha uma opção:</Text>

                            <RadioSelector
                                options={['Doador(a)', 'ONG']}
                                selectedOption={selectedOption}
                                onSelect={setSelectedOption}
                            />

                            <View style={styles.DivCadastroAll}>
                                {selectedOption === "Doador(a)" && (
                                    <ScrollView horizontal={false} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>

                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Nome Completo*</Text>
                                            <TextInput
                                                placeholder="Nome completo"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Nome Social</Text>
                                            <TextInput
                                                placeholder="Nome social"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <Text style={styles.Labels}>CPF*</Text>
                                        <View style={styles.DivCadastro}>
                                            <TextInput
                                                placeholder="000.000.000-00"
                                                maxLength={11}
                                                keyboardType="number-pad"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>CEP*</Text>
                                            <TextInput
                                                placeholder="00000-000"
                                                maxLength={8}
                                                keyboardType="number-pad"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Endereço*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Endereço"
                                                    maxLength={255}
                                                    keyboardType="default"
                                                    textContentType="streetAddressLine1"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="Nº"
                                                    maxLength={10}
                                                    keyboardType="number-pad"
                                                    style={styles.InputMini}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Complemento</Text>
                                            <TextInput
                                                placeholder="Complemento"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="streetAddressLine2"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Bairro*</Text>
                                            <TextInput
                                                placeholder="Bairro"
                                                maxLength={255}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Cidade* / Estado*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Cidade"
                                                    maxLength={255}
                                                    keyboardType="default"
                                                    textContentType="addressCity"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="UF"
                                                    maxLength={2}
                                                    keyboardType="default"
                                                    textContentType="addressState"
                                                    style={styles.InputMini}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>DDD* / Telefone*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="DDD"
                                                    maxLength={2}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputDdd}
                                                />
                                                <TextInput
                                                    placeholder="000000000"
                                                    maxLength={9}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputTel}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Email*</Text>
                                            <TextInput
                                                placeholder="Email"
                                                maxLength={255}
                                                keyboardType="email-address"
                                                textContentType="emailAddress"
                                                autoComplete="email"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.WrapperCadastroSenha}>
                                            <Text style={styles.Labels}>Senha*</Text>
                                            <TextInput
                                                placeholder="Digite sua senha"
                                                maxLength={128}
                                                keyboardType="default"
                                                textContentType="password"
                                                secureTextEntry={!senhasVisiveis[0]}
                                                style={styles.InputSenha}
                                            />
                                            <TouchableOpacity onPress={() => alternarVisibilidadeSenha(0)} style={styles.MostrarSenha}>
                                                <Entypo
                                                    name={senhasVisiveis[0] ? "eye-with-line" : "eye"}
                                                    style={styles.IconEye}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.WrapperCadastroSenha}>
                                            <Text style={styles.Labels}>Repita a Senha*</Text>
                                            <TextInput
                                                placeholder="Repita sua senha"
                                                maxLength={128}
                                                keyboardType="default"
                                                textContentType="password"
                                                secureTextEntry={!senhasVisiveis[1]}
                                                style={styles.InputSenha}
                                            />
                                            <TouchableOpacity onPress={() => alternarVisibilidadeSenha(1)} style={styles.MostrarSenha}>
                                                <Entypo
                                                    name={senhasVisiveis[1] ? "eye-with-line" : "eye"}
                                                    style={styles.IconEye}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                )}

                                {selectedOption == "ONG" && (
                                    <ScrollView horizontal={false} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>

                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>ONG*</Text>
                                            <TextInput
                                                placeholder="Nome da organização"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>CNPJ*</Text>
                                            <TextInput
                                                placeholder="00.000.000/0000-00"
                                                maxLength={14}
                                                keyboardType="number-pad"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Atividade*</Text>
                                            <TextInput
                                                placeholder="Tipo de atividade"
                                                maxLength={255}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Missão</Text>
                                            <TextInput
                                                placeholder="Descrição da missão"
                                                maxLength={255}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>CEP*</Text>
                                            <TextInput
                                                placeholder="00000-000"
                                                maxLength={8}
                                                keyboardType="number-pad"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Endereço*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Endereço"
                                                    maxLength={255}
                                                    keyboardType="default"
                                                    textContentType="streetAddressLine1"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="Nº"
                                                    maxLength={10}
                                                    keyboardType="number-pad"
                                                    style={styles.InputMini}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Complemento</Text>
                                            <TextInput
                                                placeholder="Complemento"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="streetAddressLine2"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Bairro*</Text>
                                            <TextInput
                                                placeholder="Bairro"
                                                maxLength={255}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Cidade* / Estado*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Cidade"
                                                    maxLength={255}
                                                    keyboardType="default"
                                                    textContentType="addressCity"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="UF"
                                                    maxLength={2}
                                                    keyboardType="default"
                                                    textContentType="addressState"
                                                    style={styles.InputMini}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>DDD* / Telefone*</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="DDD"
                                                    maxLength={2}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputDdd}
                                                />
                                                <TextInput
                                                    placeholder="000000000"
                                                    maxLength={9}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputTel}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Email*</Text>
                                            <TextInput
                                                placeholder="Email"
                                                maxLength={255}
                                                keyboardType="email-address"
                                                textContentType="emailAddress"
                                                autoComplete="email"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Responsável*</Text>
                                            <TextInput
                                                placeholder="Nome completo do responsável"
                                                maxLength={255}
                                                keyboardType="default"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Comprovante de Registro*</Text>
                                            <TextInput
                                                placeholder="Comprovante de registro"
                                                maxLength={255}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.WrapperCadastroSenha}>
                                            <Text style={styles.Labels}>Senha*</Text>
                                            <TextInput
                                                placeholder="Digite sua senha"
                                                maxLength={128}
                                                keyboardType="default"
                                                textContentType="password"
                                                secureTextEntry={!senhasVisiveis[3]}
                                                style={styles.InputSenha}
                                            />
                                            <TouchableOpacity onPress={() => alternarVisibilidadeSenha(3)} style={styles.MostrarSenha}>
                                                <Entypo
                                                    name={senhasVisiveis[3] ? "eye-with-line" : "eye"}
                                                    style={styles.IconEye}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.WrapperCadastroSenha}>
                                            <Text style={styles.Labels}>Repita a Senha*</Text>
                                            <TextInput
                                                placeholder="Repita sua senha"
                                                maxLength={128}
                                                keyboardType="default"
                                                textContentType="password"
                                                secureTextEntry={!senhasVisiveis[4]}
                                                style={styles.InputSenha}
                                            />
                                            <TouchableOpacity onPress={() => alternarVisibilidadeSenha(4)} style={styles.MostrarSenha}>
                                                <Entypo
                                                    name={senhasVisiveis[4] ? "eye-with-line" : "eye"}
                                                    style={styles.IconEye}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </ScrollView>
                                )}
                            </View>

                            <TouchableOpacity style={styles.BtnCadastrar}>
                                <Text style={styles.BtnTextCadastrar}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.Footer}>
                        <View style={styles.WrapperLogin}>
                            <Image source={require("../../assets/images/mao.png")} style={styles.Mao} />
                            <Text style={styles.Label}>Já tem uma conta?</Text>
                            <TouchableOpacity onPress={() => router.navigate('/(public)/login')}>
                                <Text style={styles.Label2}>Faça seu login!</Text>
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
        backgroundColor: "#00000050"
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
        //backgroundColor: "#ff0",
        width: "100%",
        height: "70%",
    },
    WrapperCadastro: {
        //backgroundColor: "#cecece",
        width: "100%",
        height: "90%",
        display: "flex",
        alignItems: "center"
    },
    H1: {
        fontSize: 30,
        color: Colors.ORANGE,
        fontFamily: "Montserrat-Bold"
    },
    P: {
        fontSize: 17,
        color: Colors.WHITE,
        marginBottom: 10,
        textAlign: "center",
        fontFamily: "Montserrat"
    },
    DivCadastroAll: {
        //backgroundColor: "#f0f",
        width: "100%",
        height: 220,
        marginBottom: 10
    },
    Labels: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 14
    },
    DivCadastro: {
        width: "100%",
        marginBottom: 15
    },
    WrapperCadastroSenha: {
        //backgroundColor: "#f0f",
        width: "100%",
        paddingBottom: 15
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
        top: 17
    },
    IconEye: {
        fontSize: 20,
        color: Colors.GRAY
    },
    DivCadastroDoisInputs: {
        width: "100%",
        marginBottom: 15
    },
    WrapperDoisInputs: {
        display: "flex",
        flexDirection: "row"
    },
    InputMedio: {
        width: "75%",
        backgroundColor: Colors.WHITE,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14,
        marginRight: "5%"
    },
    InputMini: {
        width: "20%",
        backgroundColor: Colors.WHITE,
        textAlign: "center",
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14
    },
    InputDdd: {
        width: "25%",
        backgroundColor: Colors.WHITE,
        paddingLeft: 18,
        paddingRight: 18,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14,
        marginRight: "5%",
        textAlign: "center"
    },
    InputTel: {
        width: "70%",
        backgroundColor: Colors.WHITE,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14
    },
    Input: {
        width: "100%",
        backgroundColor: Colors.WHITE,
        paddingLeft: 15,
        paddingRight: 0,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14
    },
    BtnCadastrar: {
        width: "100%",
        padding: 12,
        backgroundColor: Colors.ORANGE,
        borderRadius: 5,
        marginTop: 10
    },
    BtnTextCadastrar: {
        textAlign: "center",
        color: Colors.WHITE,
        fontFamily: "Montserrat-Medium",
        fontSize: 17
    },
    Footer: {
        //backgroundColor: "#f00",
        width: "100%",
        height: "15%",
        display: "flex",
        justifyContent: "flex-end"
    },
    WrapperLogin: {
        //backgroundColor: "#12121225",
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