import api from "@/api/axios";
import EasyDonateSvg from "@/components/easyDonateSvg";
import RadioSelector from "@/components/radioGroup";
import { Entypo } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default function Cadastro() {
    const router = useRouter();

    // [MODAL]
    const [modalErrorVisible, setModalErrorVisible] = useState(false);
    const [modalSucessoVisible, setModalSucessoVisible] = useState(false);
    const [modalMensagem, setModalMensagem] = useState('');
    const [modalSucesso, setModalSucesso] = useState(false);

    const mostrarModalErro = (mensagem: string) => {
        setModalMensagem(mensagem);
        setModalErrorVisible(true);
    };
    const mostrarModalSucesso = (mensagem: string, sucesso: boolean = false) => {
        setModalMensagem(mensagem);
        setModalSucesso(sucesso);
        setModalSucessoVisible(true);

        setTimeout(() => {
            setModalSucessoVisible(false);
            router.replace('/login');
        }, 2500); // espera 2,5 segundos
    };


    // [DOADOR]
    const [emailDoador, setEmailDoador] = useState('');
    const [senhaDoador, setSenhaDoador] = useState('');
    const [senhaDoador2, setSenhaDoador2] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [nomeDoador, setNomeDoador] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [cpf, setCpf] = useState('');
    const [cepDoador, setCepDoador] = useState('');
    const [ruaDoador, setRuaDoador] = useState('');
    const [numeroDoador, setNumeroDoador] = useState('');
    const [complementoDoador, setComplementoDoador] = useState('');
    const [bairroDoador, setBairroDoador] = useState('');
    const [cidadeDoador, setCidadeDoador] = useState('');
    const [estadoDoador, setEstadoDoador] = useState('');
    const [dddDoador, setDddDoador] = useState('');
    const [numeroTelDoador, setNumeroTelDoador] = useState('');
    // [ONG]
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [tipoAtividade, setTipoAtividade] = useState('');
    const [descricaoMissao, setDescricaoMissao] = useState('');
    const [cep, setCep] = useState('');
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [ddd, setDdd] = useState('');
    const [numeroTel, setNumeroTel] = useState('');
    const [responsavelCadastro, setResponsavelCadastro] = useState('');
    const [comprovanteRegistro, setComprovanteRegistro] = useState('');
    // [ONG / DOADOR]
    const [tipoUsuario, setTipoUsuario] = useState<string>('');
    // [OPCAO SELECIONADA]
    const [selectedOption, setSelectedOption] = useState<string>('');

    // [TIPO USUARIO]
    useEffect(() => {
        if (selectedOption === 'ONG') {
            setTipoUsuario('Ong');
        } else if (selectedOption === 'Doador') {
            setTipoUsuario('Doador');
        } else {
            setTipoUsuario('');
        }
    }, [selectedOption]);


    // [CADASTRO]
    function handleCadastro() {
        if (selectedOption === 'ONG') {
            cadastroOng();
        } else if (selectedOption === 'Doador') {
            cadastroDoador();
        } else {
            mostrarModalErro("Selecione pelo menos um tipo de doador!");
        }
    };

    // [BUSCAR CEP]
    useEffect(() => {
        const buscarCep = async () => {
            if (cep.length === 8 && selectedOption === 'ONG') {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        mostrarModalErro("CEP não encontrado.");
                        return;
                    }

                    setRua(data.logradouro || '');
                    setComplemento(data.complemento || '');
                    setBairro(data.bairro || '');
                    setCidade(data.localidade || '');
                    setEstado(data.uf || '');

                } catch (error) {
                    mostrarModalErro("Não foi possível buscar o CEP.");
                    console.error("Erro ao buscar CEP:", error);
                }
            }

            if (cepDoador.length === 8 && selectedOption === 'Doador') {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepDoador}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        mostrarModalErro("CEP não encontrado.");
                        return;
                    }

                    setRuaDoador(data.logradouro || '');
                    setComplementoDoador(data.complemento || '');
                    setBairroDoador(data.bairro || '');
                    setCidadeDoador(data.localidade || '');
                    setEstadoDoador(data.uf || '');

                } catch (error) {
                    mostrarModalErro("Não foi possível buscar o CEP.");
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        };

        buscarCep();
    }, [cep, cepDoador, selectedOption]);

    const resetCamposDoador = () => {
        setEmailDoador('');
        setSenhaDoador('');
        setSenhaDoador2('');
        setTipoUsuario('');
        setTipoPessoa('');
        setNomeDoador('');
        setNomeSocial('');
        setCpf('');
        setCepDoador('');
        setRuaDoador('');
        setNumeroDoador('');
        setComplementoDoador('');
        setBairroDoador('');
        setCidadeDoador('');
        setEstadoDoador('');
        setDddDoador('');
        setNumeroTelDoador('');
    };

    const resetCamposOng = () => {
        setEmail('');
        setSenha('');
        setSenha2('');
        setTipoUsuario('');
        setNome('');
        setCnpj('');
        setTipoAtividade('');
        setDescricaoMissao('');
        setCep('');
        setRua('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setEstado('');
        setDdd('');
        setNumeroTel('');
        setResponsavelCadastro('');
        setComprovanteRegistro('');
    };

    // [CADASTRO ONG]
    const cadastroOng = async () => {
        if (!email || !tipoUsuario || !nome || !cnpj || !tipoAtividade || !cep || !rua || !bairro || !cidade || !estado || !ddd || !numeroTel || !responsavelCadastro || !comprovanteRegistro || !senha || !senha2) {
            // Alert.alert("Erro", "Preencha todos os campos obrigatórios!");  
            mostrarModalErro("Preencha todos os campos obrigatórios!");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            mostrarModalErro("Digite um e-mail válido!");
            // Alert.alert("Erro", "Digite um e-mail válido!");
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senha)) {
            mostrarModalErro("A senha deve conter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!");
            // Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!");
            return;
        }

        if (senha !== senha2) {
            mostrarModalErro("As senhas não coincidem!");
            // Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        let bodyRequestOng: any = {
            email,
            senha,
            tipoUsuario,
            nome,
            cnpj,
            tipoAtividade,
            descricaoMissao,
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            ddd,
            responsavelCadastro,
            comprovanteRegistro,
        };

        const telefoneRegex = /^\d{8}$/;
        const telefoneCelularRegex = /^\d{9}$/;
        if (numeroTel.length <= 9 && numeroTel.length >= 8) {
            if (telefoneCelularRegex.test(numeroTel)) {
                bodyRequestOng.telefoneCelular = numeroTel;
            } else if (telefoneRegex.test(numeroTel)) {
                bodyRequestOng.telefone = numeroTel;
            }
        } else {
            mostrarModalErro("Informe um número de telefone/celular válido!");
            // Alert.alert("Erro", "Informe um número de telefone/celular válido!");
            return;
        }

        try {
            const response = await api.post('/Ong', bodyRequestOng);

            if (response.status === 201) {
                mostrarModalSucesso("ONG cadastrada com sucesso!");
                setTimeout(() => {
                    resetCamposOng();
                    setModalSucessoVisible(false); // fecha o modal se quiser
                    router.replace('/login');
                }, 2500);
            }

        } catch (error: any) {
            console.log("Erro ao cadastrar:", error);

            let msg = "Erro ao realizar cadastro!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            mostrarModalErro(msg);
        }
    }

    // [CADASTRO DOADOR]
    const cadastroDoador = async () => {
        if (!emailDoador || !tipoUsuario || !nomeDoador || !tipoPessoa || !cpf || !cepDoador || !ruaDoador || !bairroDoador || !cidadeDoador || !estadoDoador || !dddDoador || !numeroTelDoador || !senhaDoador || !senhaDoador2) {
            // Alert.alert("Erro", "Preencha todos os campos obrigatórios!");
            mostrarModalErro("Preencha todos os campos obrigatórios!");
            return;
        }

        if (tipoPessoa !== "PF" && tipoPessoa !== "PJ" && tipoPessoa !== "pf" && tipoPessoa !== "pj") {
            mostrarModalErro("Tipo de Pessoa inválido! Informe PF ou PJ.");
            // Alert.alert("Erro", "Tipo de Pessoa Inválido!");
            return;
        }

        const cpfRegex = /^\d{11}$/;
        if (!cpfRegex.test(cpf)) {
            mostrarModalErro("Cpf Inválido!");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailDoador)) {
            mostrarModalErro("Digite um e-mail válido!");
            // Alert.alert("Erro", "Digite um e-mail válido!");
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senhaDoador)) {
            mostrarModalErro("A senha deve ter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!");
            // Alert.alert("Erro", "A senha deve ter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!");
            return;
        }

        if (senhaDoador !== senhaDoador2) {
            mostrarModalErro("As senhas não coincidem!");
            // Alert.alert("Erro", "As senhas não coincidem!");
            return;
        }

        let bodyRequestDoador: any = {
            email: emailDoador.trim(),
            senha: senhaDoador,
            tipoUsuario,
            tipoPessoa,
            nome: nomeDoador,
            nomeSocial,
            cpf,
            cep: cepDoador,
            rua: ruaDoador,
            numero: numeroDoador.trim(),
            complemento: complementoDoador,
            bairro: bairroDoador,
            cidade: cidadeDoador,
            estado: estadoDoador,
            ddd: dddDoador,
        };

        const telefoneRegex = /^\d{8}$/;
        const telefoneCelularRegex = /^\d{9}$/;
        if (numeroTelDoador.length <= 9 && numeroTelDoador.length >= 8) {
            if (telefoneCelularRegex.test(numeroTelDoador)) {
                bodyRequestDoador.telefoneCelular = numeroTelDoador;
            } else if (telefoneRegex.test(numeroTelDoador)) {
                bodyRequestDoador.telefone = numeroTelDoador;
            }
        } else {
            // Alert.alert("Erro", "Informe um número de telefone/celular válido!");
            mostrarModalErro("Informe um número de telefone/celular válido!");
            return;
        }

        try {
            const response = await api.post('/Doador', bodyRequestDoador);

            if (response.status === 201) {
                mostrarModalSucesso("Doador cadastrado com sucesso!", true);
                setTimeout(() => {
                    resetCamposDoador();
                    setModalSucessoVisible(false); // fecha o modal se quiser
                    router.replace('/login');
                }, 2500); // espera 2,5 segundos
            }

        } catch (error: any) {
            console.log("Erro ao cadastrar:", error);

            let msg = "Erro ao realizar cadastro!";

            if (error?.response) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data?.message) {
                    msg = error.response.data.message;
                }
            } else if (error?.message) {
                msg = error.message;
            }

            mostrarModalErro(msg);
        }

    }

    // [CARREGAR FONTS]
    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf")
    });

    // [SENHA VISIVEL]
    const [senhasVisiveis, setSenhasVisiveis] = useState<boolean[]>([false, false, false, false]);

    const alternarVisibilidadeSenha = (index: number) => {
        setSenhasVisiveis(prev => {
            const novas = [...prev];
            novas[index] = !novas[index];
            return novas;
        });
    };

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
                                options={['Doador', 'ONG']}
                                selectedOption={selectedOption}
                                onSelect={setSelectedOption}
                            />

                            <View style={styles.DivCadastroAll}>
                                {selectedOption === "Doador" && (
                                    <ScrollView horizontal={false} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>

                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Tipo Doador*</Text>
                                            <TextInput
                                                placeholder="Tipo Pessoa: PF ou PJ"
                                                maxLength={2}
                                                value={tipoPessoa}
                                                onChangeText={setTipoPessoa}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>

                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Nome Completo*</Text>
                                            <TextInput
                                                placeholder="Nome completo"
                                                maxLength={255}
                                                value={nomeDoador}
                                                onChangeText={setNomeDoador}
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
                                                value={nomeSocial}
                                                onChangeText={setNomeSocial}
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
                                                value={cpf}
                                                onChangeText={setCpf}
                                                keyboardType="number-pad"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>CEP*</Text>
                                            <TextInput
                                                placeholder="00000-000"
                                                maxLength={8}
                                                value={cepDoador}
                                                onChangeText={setCepDoador}
                                                keyboardType="number-pad"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Endereço* / Numero</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Endereço"
                                                    maxLength={255}
                                                    value={ruaDoador}
                                                    onChangeText={setRuaDoador}
                                                    keyboardType="default"
                                                    textContentType="streetAddressLine1"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="Nº"
                                                    maxLength={10}
                                                    value={numeroDoador}
                                                    onChangeText={setNumeroDoador}
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
                                                value={complementoDoador}
                                                onChangeText={setComplementoDoador}
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
                                                value={bairroDoador}
                                                onChangeText={setBairroDoador}
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
                                                    value={cidadeDoador}
                                                    onChangeText={setCidadeDoador}
                                                    keyboardType="default"
                                                    textContentType="addressCity"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="UF"
                                                    maxLength={2}
                                                    value={estadoDoador}
                                                    onChangeText={setEstadoDoador}
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
                                                    value={dddDoador}
                                                    onChangeText={setDddDoador}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputDdd}
                                                />
                                                <TextInput
                                                    placeholder="000000000"
                                                    maxLength={9}
                                                    value={numeroTelDoador}
                                                    onChangeText={setNumeroTelDoador}
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
                                                value={emailDoador}
                                                onChangeText={setEmailDoador}
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
                                                value={senhaDoador}
                                                onChangeText={setSenhaDoador}
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
                                                value={senhaDoador2}
                                                onChangeText={setSenhaDoador2}
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

                                {selectedOption === "ONG" && (
                                    <ScrollView horizontal={false} showsVerticalScrollIndicator={false} removeClippedSubviews={true}>

                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>ONG*</Text>
                                            <TextInput
                                                placeholder="Nome da organização"
                                                maxLength={255}
                                                value={nome}
                                                onChangeText={setNome}
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
                                                value={cnpj}
                                                onChangeText={setCnpj}
                                                keyboardType="number-pad"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Atividade*</Text>
                                            <TextInput
                                                placeholder="Tipo de atividade"
                                                maxLength={255}
                                                value={tipoAtividade}
                                                onChangeText={setTipoAtividade}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>Missão</Text>
                                            <TextInput
                                                placeholder="Descrição da missão"
                                                maxLength={255}
                                                value={descricaoMissao}
                                                onChangeText={setDescricaoMissao}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastro}>
                                            <Text style={styles.Labels}>CEP*</Text>
                                            <TextInput
                                                placeholder="00000-000"
                                                maxLength={8}
                                                value={cep}
                                                onChangeText={setCep}
                                                keyboardType="number-pad"
                                                textContentType="name"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.DivCadastroDoisInputs}>
                                            <Text style={styles.Labels}>Endereço* / Numero</Text>
                                            <View style={styles.WrapperDoisInputs}>
                                                <TextInput
                                                    placeholder="Endereço"
                                                    maxLength={255}
                                                    value={rua}
                                                    onChangeText={setRua}
                                                    keyboardType="default"
                                                    textContentType="streetAddressLine1"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="Nº"
                                                    maxLength={10}
                                                    value={numero}
                                                    onChangeText={setNumero}
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
                                                value={complemento}
                                                onChangeText={setComplemento}
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
                                                value={bairro}
                                                onChangeText={setBairro}
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
                                                    value={cidade}
                                                    onChangeText={setCidade}
                                                    keyboardType="default"
                                                    textContentType="addressCity"
                                                    style={styles.InputMedio}
                                                />
                                                <TextInput
                                                    placeholder="UF"
                                                    maxLength={2}
                                                    value={estado}
                                                    onChangeText={setEstado}
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
                                                    value={ddd}
                                                    onChangeText={setDdd}
                                                    keyboardType="number-pad"
                                                    textContentType="telephoneNumber"
                                                    style={styles.InputDdd}
                                                />
                                                <TextInput
                                                    placeholder="000000000"
                                                    maxLength={9}
                                                    value={numeroTel}
                                                    onChangeText={setNumeroTel}
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
                                                value={email}
                                                onChangeText={setEmail}
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
                                                value={responsavelCadastro}
                                                onChangeText={setResponsavelCadastro}
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
                                                value={comprovanteRegistro}
                                                onChangeText={setComprovanteRegistro}
                                                keyboardType="default"
                                                style={styles.Input}
                                            />
                                        </View>
                                        <View style={styles.WrapperCadastroSenha}>
                                            <Text style={styles.Labels}>Senha*</Text>
                                            <TextInput
                                                placeholder="Digite sua senha"
                                                maxLength={128}
                                                value={senha}
                                                onChangeText={setSenha}
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
                                                value={senha2}
                                                onChangeText={setSenha2}
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

                            <TouchableOpacity style={styles.BtnCadastrar} onPress={handleCadastro}>
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

            <Modal
                isVisible={modalErrorVisible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
                onBackdropPress={() => setModalErrorVisible(false)}
                onBackButtonPress={() => setModalErrorVisible(false)}
            >
                <View style={styles.modalStyle}>
                    <Image
                        source={require("../../assets/images/mao-broken-black.webp")}
                        style={styles.ImgEasyDonate}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.ORANGE, marginBottom: 10 }}>
                        Erro ao cadastrar
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 20, color: Colors.BLACK }}>
                        {modalMensagem}
                    </Text>
                    {!modalSucesso && (
                        <TouchableOpacity
                            onPress={() => setModalErrorVisible(false)}
                            style={styles.btnFechar}
                        >
                            <Text style={styles.btnFecharlText}>Fechar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            <Modal
                isVisible={modalSucessoVisible}
                animationIn="fadeIn"
                animationOut="fadeOut"
                backdropTransitionOutTiming={0}
                onBackdropPress={() => setModalSucessoVisible(false)}
                onBackButtonPress={() => setModalSucessoVisible(false)}
            >
                <View style={styles.modalStyle}>
                    <Image
                        source={require("../../assets/images/mao-black.webp")}
                        style={styles.ImgEasyDonate}
                        resizeMode="contain"
                    />
                    <Text style={{ fontSize: 16, fontWeight: "bold", color: Colors.ORANGE, marginBottom: 10 }}>
                        Sucesso ao cadastrar
                    </Text>
                    <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 20, color: Colors.BLACK }}>
                        {modalMensagem}
                    </Text>
                    
                </View>
            </Modal>


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
    modalStyle: {
        backgroundColor: Colors.WHITE,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        // borderColor: Colors.ORANGE,
        // borderWidth: 1,
        elevation: 2,
        shadowColor: "#12121275",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    btnFechar: {
        backgroundColor: Colors.ORANGE,
        padding: 10,
        borderRadius: 35,
        width: 140,
        // borderColor: Colors.BLACK,
        // borderWidth: 1,
        alignItems: "center",
    },
    btnFecharlText: {
        color: Colors.WHITE,
        // fontWeight: "bold",
    },
    ImgEasyDonate: {
        width: 150,
        height: 80,
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
        height: 245,
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