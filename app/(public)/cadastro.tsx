import api from "@/api/axios";
import CustomInput from "@/components/CustomInput";
import Dropdown from "@/components/dropdown";
import EasyDonateSvg from "@/components/easyDonateSvg";
import PasswordInput from "@/components/PasswordInput";
import RadioSelector from "@/components/radioGroup";
import { useModalFeedback } from "@/contexts/ModalFeedbackContext";
import { Feather, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "../../components/Colors";

export default React.memo(function Cadastro() {
    const router = useRouter();

    // --- CÉREBRO DO FLUXO ---
    const [etapa, setEtapa] = useState<'selecao' | 'formulario'>('selecao');
    const [selectedOption, setSelectedOption] = useState<string>('');
    const { mostrarModalFeedback } = useModalFeedback();

    // [DOADOR]
    const [emailDoador, setEmailDoador] = useState('');
    const [senhaDoador, setSenhaDoador] = useState('');
    const [senhaDoador2, setSenhaDoador2] = useState('');
    const [tipoPessoa, setTipoPessoa] = useState('');
    const [nomeDoador, setNomeDoador] = useState('');
    const [nomeSocial, setNomeSocial] = useState('');
    const [cpf, setCpf] = useState('');
    const [cnpjDoador, setCnpjDoador] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataNascimentoISO, setDataNascimentoISO] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
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

    // [GERAL]
    const [tipoUsuario, setTipoUsuario] = useState<string>('');
    const [senhasVisiveis, setSenhasVisiveis] = useState<boolean[]>([false, false, false, false]);

    // [DATE TIME]
    const formatDateToDisplay = (date: Date): string => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateToISO = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setDataNascimento(formatDateToDisplay(date));
            setDataNascimentoISO(formatDateToISO(date));
        }
    };

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
            mostrarModalFeedback("Selecione pelo menos um tipo de doador!", 'error', undefined, "Ops! Algo deu errado...");
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
                        mostrarModalFeedback("CEP não encontrado.", 'error', undefined, "Ops! Erro ao buscar seu CEP...");
                        return;
                    }


                    setRua(data.logradouro || '');
                    setComplemento(data.complemento || '');
                    setBairro(data.bairro || '');
                    setCidade(data.localidade || '');
                    setEstado(data.uf || '');

                } catch (error) {
                    mostrarModalFeedback("Não foi possível buscar o CEP.", 'error');
                    console.error("Erro ao buscar CEP:", error);
                }
            }

            if (cepDoador.length === 8 && selectedOption === 'Doador') {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cepDoador}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        mostrarModalFeedback("CEP não encontrado.", 'error', undefined, "Ops! Erro ao buscar seu CEP...");
                        return;
                    }

                    setRuaDoador(data.logradouro || '');
                    setComplementoDoador(data.complemento || '');
                    setBairroDoador(data.bairro || '');
                    setCidadeDoador(data.localidade || '');
                    setEstadoDoador(data.uf || '');

                } catch (error) {
                    mostrarModalFeedback("Não foi possível buscar o CEP.", 'error');
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        };

        buscarCep();

        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if (!email || !tipoUsuario || !nome || !cnpj || !tipoAtividade || !cep || !rua || !bairro || !cidade || !estado || !ddd || !numeroTel || !responsavelCadastro || !senha || !senha2) {
            mostrarModalFeedback("Preencha todos os campos obrigatórios!", 'error', undefined, "Ops! Algo deu errado...");
            return;
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            mostrarModalFeedback("Digite um e-mail válido!", 'error');
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senha)) {
            mostrarModalFeedback("A senha deve conter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!", 'error');
            return;
        }

        if (senha !== senha2) {
            mostrarModalFeedback("As senhas não coincidem!", 'error', undefined, "Ops! Você digitou a mesma senha?");
            return;
        }

        let bodyRequestOng: any = {
            email, senha, tipoUsuario, nome, cnpj, tipoAtividade, descricaoMissao, cep, rua, numero, complemento, bairro, cidade, estado, ddd, responsavelCadastro, comprovanteRegistro,
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
            mostrarModalFeedback("Informe um número de telefone/celular válido!", 'error');
            return;
        }

        try {
            const response = await api.post('/Ong', bodyRequestOng);

            if (response.status === 201) {
                mostrarModalFeedback("ONG cadastrada com sucesso!\nFinalize o preenchimento dos dados complementares da sua organização após realizar login.", 'success', 3100);
                setTimeout(() => {
                    resetCamposOng();
                    router.replace('/login');
                }, 3100);
            }

        } catch (error: any) {
            console.warn("Erro ao cadastrar:", error);

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

            mostrarModalFeedback(msg, 'error');
        }
    }

    // [CADASTRO DOADOR]
    const cadastroDoador = async () => {
        if (!emailDoador || !tipoUsuario || !nomeDoador || !tipoPessoa || !dataNascimento || !cepDoador || !ruaDoador || !bairroDoador || !cidadeDoador || !estadoDoador || !dddDoador || !numeroTelDoador || !senhaDoador || !senhaDoador2) {
            mostrarModalFeedback("Preencha todos os campos obrigatórios!", 'error', undefined, "Ops! Algo deu errado...");

            return;
        }

        if (tipoPessoa !== "PF" && tipoPessoa !== "PJ" && tipoPessoa !== "pf" && tipoPessoa !== "pj") {
            mostrarModalFeedback("Tipo de Pessoa inválido! Informe PF ou PJ.", 'error');
            return;
        }

        if (tipoPessoa === "PF") {
            const cpfRegex = /^\d{11}$/;
            if (!cpfRegex.test(cpf)) {
                mostrarModalFeedback("Digite o CPF corretamente!", 'error');
                return;
            }
        }

        if (tipoPessoa === "PJ") {
            const cnpjRegex = /^(?:\d{14}|[A-Za-z0-9]{8}\d{6})$/;
            if (!cnpjRegex.test(cnpjDoador)) {
                mostrarModalFeedback("Digite o CNPJ corretamente!", 'error');
                return;
            }
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(emailDoador)) {
            mostrarModalFeedback("Digite um e-mail válido!", 'error');
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senhaDoador)) {
            mostrarModalFeedback("A senha deve ter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!", 'error');
            return;
        }

        if (senhaDoador !== senhaDoador2) {
            mostrarModalFeedback("As senhas não coincidem!", 'error', undefined, "Você digitou a mesma senha?");
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
            cnpj: cnpjDoador,
            dataNascimento: dataNascimentoISO,
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
            mostrarModalFeedback("Informe um número de telefone/celular válido!", 'error');
            return;
        }

        try {
            const response = await api.post('/Doador', bodyRequestDoador);

            if (response.status === 201) {
                mostrarModalFeedback("Doador cadastrado com sucesso!", 'success');
                setTimeout(() => {
                    resetCamposDoador();
                    router.replace('/login');
                }, 2500);
            }

        } catch (error: any) {
            console.warn("Erro ao cadastrar:", error);

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

            mostrarModalFeedback(msg, 'error');
        }
    }

    const alternarVisibilidadeSenha = (index: number) => {
        setSenhasVisiveis(prev => {
            const novas = [...prev];
            novas[index] = !novas[index];
            return novas;
        });
    };

    // --- LÓGICA DE ANIMAÇÃO ---
    const translateY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const keyboardShowEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShowListener = Keyboard.addListener(keyboardShowEvent, () => {
            if (etapa === 'formulario') {
                Animated.timing(translateY, {
                    toValue: -75,
                    duration: 500,
                    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
                    useNativeDriver: true,
                }).start();
            }
        });

        const keyboardHideListener = Keyboard.addListener(keyboardHideEvent, () => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), 
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, [translateY, etapa]);

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    });

    // --- LÓGICA DO BOTÃO DE VOLTAR ---
    const handleBackPress = () => {
        if (etapa === 'formulario') {
            setEtapa('selecao');
        } else {
            router.back();
        }
    };

    // --- LÓGICA DO BOTÃO "PRÓXIMO" ---
    const handleNextPress = () => {
        if (!selectedOption) {
            mostrarModalFeedback("Por favor, selecione uma opção para continuar.", 'error', undefined, "Atenção!");
            return;
        }
        setEtapa('formulario');
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <EasyDonateSvg />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={require("../../assets/images/bg-tela-cadastro.png")}
                    style={styles.bgImage}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                            <Feather name="arrow-left" style={styles.backIcon} />
                        </TouchableOpacity>



                    </View>

                    <ScrollView
                        contentContainerStyle={[
                            styles.scrollViewContent,
                            { justifyContent: 'center' } // AQUI A MUDANÇA: Centraliza para ambas as etapas
                        ]}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Animated.View style={[styles.section, { transform: [{ translateY }] }]}>

                            {etapa === 'selecao' && (
                                <>

                                    <Text style={styles.h1}>Vamos começar!</Text>
                                    <Text style={styles.h2}>Selecione como você deseja participar:</Text>
                                    <RadioSelector
                                        options={['Doador', 'ONG']}
                                        selectedOption={selectedOption}
                                        onSelect={setSelectedOption}
                                    />
                                    <TouchableOpacity style={styles.actionButton} onPress={handleNextPress}>
                                        <Text style={styles.actionButtonText}>Próximo</Text>
                                        <Feather name="arrow-right" style={styles.backIcon} />
                                    </TouchableOpacity>
                                </>
                            )}

                            {etapa === 'formulario' && (

                                <View style={styles.formContainer}>
                                    {/* <Text style={styles.formTitle}>Participar como {selectedOption}</Text> */}


                                    {selectedOption === "Doador" && (
                                        <ScrollView
                                            style={styles.formScrollView}
                                            showsVerticalScrollIndicator={false}
                                            nestedScrollEnabled={true}
                                        >

                                            <View style={styles.formContent}>
                                                <Dropdown
                                                    label="Tipo Doador*"
                                                    data={[
                                                        { value: "PF", label: "Pessoa Física" },
                                                        { value: "PJ", label: "Pessoa Jurídica" }
                                                    ]}
                                                    onChange={(item) => setTipoPessoa(item.value)}
                                                    placeholder="Selecione..."
                                                />


                                                <CustomInput
                                                    label="Nome Completo*"
                                                    inputProps={{
                                                        placeholder: "Nome completo",
                                                        maxLength: 255,
                                                        value: nomeDoador,
                                                        onChangeText: setNomeDoador,
                                                        keyboardType: "default",
                                                        textContentType: "name"
                                                    }}
                                                />

                                                <CustomInput
                                                    label="Nome Social"
                                                    inputProps={{
                                                        placeholder: "Nome Social",
                                                        maxLength: 255,
                                                        value: nomeSocial,
                                                        onChangeText: setNomeSocial,
                                                        keyboardType: "default",
                                                        textContentType: "name"
                                                    }}
                                                />

                                                {tipoPessoa === "PF" && (
                                                    <CustomInput
                                                        label="CPF*"
                                                        inputProps={{
                                                            placeholder: "000.000.000-00",
                                                            maxLength: 11,
                                                            value: cpf,
                                                            onChangeText: setCpf,
                                                            keyboardType: "number-pad",
                                                            textContentType: "none"
                                                        }}
                                                    />
                                                )}

                                                {tipoPessoa === "PJ" && (
                                                    <CustomInput
                                                        label="CNPJ*"
                                                        inputProps={{
                                                            placeholder: "00.000.000/0000-00",
                                                            maxLength: 14,
                                                            value: cnpjDoador,
                                                            onChangeText: setCnpjDoador,
                                                            keyboardType: "number-pad",
                                                            textContentType: "none"
                                                        }}
                                                    />
                                                )}

                                                {/* Para o campo de Data de Nascimento, a estrutura também é atualizada */}
                                                <TouchableOpacity style={styles.dateInputContainer} onPress={() => setShowDatePicker(true)}>
                                                    <CustomInput
                                                        label="Data de nascimento*"
                                                        inputProps={{
                                                            placeholder: "00/00/0000",
                                                            maxLength: 10,
                                                            value: dataNascimento,
                                                            editable: false
                                                        }}
                                                    />
                                                    <Pressable onPress={() => setShowDatePicker(true)} style={styles.calendarButton}>
                                                        <FontAwesome name="calendar" size={22} color={Colors.ORANGE} />
                                                    </Pressable>
                                                </TouchableOpacity>

                                                {showDatePicker && (
                                                    <DateTimePicker
                                                        value={selectedDate || new Date(2000, 0, 1)}
                                                        mode="date"
                                                        display="default"
                                                        maximumDate={new Date()}
                                                        onChange={handleDateChange}
                                                    />
                                                )}

                                                <CustomInput
                                                    label="CEP*"
                                                    inputProps={{
                                                        placeholder: "00000-000",
                                                        maxLength: 8,
                                                        value: cepDoador,
                                                        onChangeText: setCepDoador,
                                                        keyboardType: "number-pad"
                                                    }}

                                                />

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="Endereço*"
                                                        // A 'prop' de estilo do container agora tem um nome específico
                                                        containerStyle={{ width: "75%" }}
                                                        // Todas as props do TextInput vão dentro de 'inputProps'
                                                        inputProps={{
                                                            placeholder: "Endereço",
                                                            maxLength: 255,
                                                            value: ruaDoador,
                                                            onChangeText: setRuaDoador,
                                                            keyboardType: "default",
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Número"
                                                        containerStyle={{ width: "20%" }}
                                                        inputProps={{
                                                            placeholder: "Nº",
                                                            maxLength: 10,
                                                            value: numeroDoador,
                                                            onChangeText: setNumeroDoador,
                                                            keyboardType: "number-pad",
                                                        }}
                                                    />
                                                </View>

                                                <CustomInput
                                                    label="Complemento"
                                                    inputProps={{
                                                        placeholder: "Complemento",
                                                        maxLength: 255,
                                                        value: complementoDoador,
                                                        onChangeText: setComplementoDoador,
                                                        keyboardType: "number-pad"
                                                    }}

                                                />
                                                <CustomInput
                                                    label="Bairro"
                                                    inputProps={{
                                                        placeholder: "Bairro",
                                                        maxLength: 255,
                                                        value: bairroDoador,
                                                        onChangeText: setBairroDoador,
                                                        keyboardType: "default"
                                                    }}

                                                />

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="Cidade*"
                                                        containerStyle={{ width: "75%" }}
                                                        inputProps={{
                                                            placeholder: "Endereço",
                                                            maxLength: 255,
                                                            value: cidadeDoador,
                                                            onChangeText: setCidadeDoador,
                                                            keyboardType: "default",
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Estado*"
                                                        containerStyle={{ width: "20%" }}
                                                        inputProps={{
                                                            placeholder: "UF",
                                                            maxLength: 2,
                                                            value: estadoDoador,
                                                            onChangeText: setEstadoDoador,
                                                            keyboardType: "default",
                                                        }}
                                                    />
                                                </View>

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="DDD*"
                                                        containerStyle={{ width: "16%" }}
                                                        inputProps={{
                                                            placeholder: "00",
                                                            maxLength: 2,
                                                            value: dddDoador,
                                                            onChangeText: setDddDoador,
                                                            keyboardType: "number-pad",
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Telefone*"
                                                        containerStyle={{ width: "79%" }}
                                                        inputProps={{
                                                            placeholder: "000000000",
                                                            maxLength: 9,
                                                            value: numeroTelDoador,
                                                            onChangeText: setNumeroTelDoador,
                                                            keyboardType: "number-pad",
                                                        }}
                                                    />
                                                </View>

                                                <CustomInput
                                                    label="Email*"
                                                    inputProps={{
                                                        placeholder: "nome@email.com",
                                                        maxLength: 255,
                                                        value: emailDoador,
                                                        onChangeText: setEmailDoador,
                                                        keyboardType: "email-address",
                                                        textContentType: "emailAddress",
                                                        autoComplete: "email",
                                                        autoCapitalize: "none",
                                                    }}
                                                />

                                                <PasswordInput
                                                    label="Senha*"
                                                    isPasswordVisible={senhasVisiveis[0]}
                                                    onToggleVisibility={() => alternarVisibilidadeSenha(0)}
                                                    inputProps={{
                                                        placeholder: "Crie sua senha de acesso",
                                                        value: senhaDoador,
                                                        onChangeText: setSenhaDoador,
                                                        textContentType: "password"
                                                    }}
                                                />

                                                <PasswordInput
                                                    label="Confirmar Senha*"
                                                    isPasswordVisible={senhasVisiveis[1]}
                                                    onToggleVisibility={() => alternarVisibilidadeSenha(1)}
                                                    inputProps={{
                                                        placeholder: "Repita a senha criada",
                                                        value: senhaDoador2,
                                                        onChangeText: setSenhaDoador2,
                                                        textContentType: "newPassword"
                                                    }}
                                                />

                                            </View>
                                        </ScrollView>
                                    )}

                                    {selectedOption === "ONG" && (
                                        <ScrollView
                                            style={styles.formScrollView}
                                            showsVerticalScrollIndicator={false}
                                            nestedScrollEnabled={true}
                                        >
                                            <View style={styles.formContent}>
                                                <CustomInput
                                                    label="Nome da ONG*"
                                                    inputProps={{
                                                        placeholder: "Nome da organização",
                                                        maxLength: 255,
                                                        value: nome,
                                                        onChangeText: setNome,
                                                        keyboardType: "default",
                                                        textContentType: "organizationName"
                                                    }}
                                                />

                                                <CustomInput
                                                    label="CNPJ*"
                                                    inputProps={{
                                                        placeholder: "00.000.000/0000-00",
                                                        maxLength: 14,
                                                        value: cnpj,
                                                        onChangeText: setCnpj,
                                                        keyboardType: "number-pad"
                                                    }}
                                                />

                                                <Dropdown
                                                    label="Principal tipo de doação que busca*"
                                                    data={[
                                                        { value: "Roupas", label: "Roupas" },
                                                        { value: "Dinheiro", label: "Dinheiro" },
                                                        { value: "Alimentos", label: "Alimentos / Ração" },
                                                        { value: "Geral", label: "Abrange qualquer tipo" }
                                                    ]}
                                                    onChange={(item) => setTipoAtividade(item.value)}
                                                    placeholder="Selecione..."
                                                />

                                                <CustomInput
                                                    label="CEP*"
                                                    inputProps={{
                                                        placeholder: "00000-000",
                                                        maxLength: 8,
                                                        value: cep,
                                                        onChangeText: setCep,
                                                        keyboardType: "number-pad"
                                                    }}
                                                />

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="Endereço*"
                                                        containerStyle={{ width: "75%" }}
                                                        inputProps={{
                                                            placeholder: "Rua, Av...",
                                                            value: rua,
                                                            onChangeText: setRua,
                                                            keyboardType: "default"
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Número"
                                                        containerStyle={{ width: "20%" }}
                                                        inputProps={{
                                                            placeholder: "Nº",
                                                            value: numero,
                                                            onChangeText: setNumero,
                                                            keyboardType: "number-pad"
                                                        }}
                                                    />
                                                </View>

                                                <CustomInput
                                                    label="Complemento"
                                                    inputProps={{
                                                        placeholder: "Apto, bloco, etc.",
                                                        value: complemento,
                                                        onChangeText: setComplemento,
                                                        keyboardType: "default"
                                                    }}
                                                />

                                                <CustomInput
                                                    label="Bairro*"
                                                    inputProps={{
                                                        placeholder: "Seu bairro",
                                                        value: bairro,
                                                        onChangeText: setBairro,
                                                        keyboardType: "default"
                                                    }}
                                                />

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="Cidade*"
                                                        containerStyle={{ width: "75%" }}
                                                        inputProps={{
                                                            placeholder: "Sua cidade",
                                                            value: cidade,
                                                            onChangeText: setCidade,
                                                            keyboardType: "default"
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Estado*"
                                                        containerStyle={{ width: "20%" }}
                                                        inputProps={{
                                                            placeholder: "UF",
                                                            value: estado,
                                                            onChangeText: setEstado,
                                                            autoCapitalize: "characters",
                                                            maxLength: 2
                                                        }}
                                                    />
                                                </View>

                                                <View style={styles.rowInputs}>
                                                    <CustomInput
                                                        label="DDD*"
                                                        containerStyle={{ width: "16%" }}
                                                        inputProps={{
                                                            placeholder: "00",
                                                            value: ddd,
                                                            onChangeText: setDdd,
                                                            keyboardType: "number-pad",
                                                            maxLength: 2
                                                        }}
                                                    />
                                                    <CustomInput
                                                        label="Telefone*"
                                                        containerStyle={{ width: "79%" }}
                                                        inputProps={{
                                                            placeholder: "00000-0000",
                                                            value: numeroTel,
                                                            onChangeText: setNumeroTel,
                                                            keyboardType: "number-pad",
                                                            maxLength: 9
                                                        }}
                                                    />
                                                </View>

                                                <CustomInput
                                                    label="Email de Contato*"
                                                    inputProps={{
                                                        placeholder: "contato@suaong.com",
                                                        value: email,
                                                        onChangeText: setEmail,
                                                        keyboardType: "email-address",
                                                        autoCapitalize: "none",
                                                        autoComplete: "email",
                                                        textContentType: "emailAddress"
                                                    }}
                                                />

                                                <CustomInput
                                                    label="Responsável pelo Cadastro*"
                                                    inputProps={{
                                                        placeholder: "Nome completo",
                                                        value: responsavelCadastro,
                                                        onChangeText: setResponsavelCadastro,
                                                        keyboardType: "default",
                                                        textContentType: "name"
                                                    }}
                                                />

                                                {/* <CustomInput
                                                    label="Comprovante de Registro (Opcional)"
                                                    inputProps={{
                                                        placeholder: "Link para o comprovante",
                                                        value: comprovanteRegistro,
                                                        onChangeText: setComprovanteRegistro,
                                                        keyboardType: "url"
                                                    }}
                                                /> */}

                                                <PasswordInput
                                                    label="Senha*"
                                                    isPasswordVisible={senhasVisiveis[3]}
                                                    onToggleVisibility={() => alternarVisibilidadeSenha(3)}
                                                    inputProps={{
                                                        placeholder: "Crie sua senha de acesso",
                                                        value: senha,
                                                        onChangeText: setSenha,
                                                        textContentType: "newPassword"
                                                    }}
                                                />

                                                <PasswordInput
                                                    label="Confirme sua Senha*"
                                                    isPasswordVisible={senhasVisiveis[4]}
                                                    onToggleVisibility={() => alternarVisibilidadeSenha(4)}
                                                    inputProps={{
                                                        placeholder: "Repita a senha criada",
                                                        value: senha2,
                                                        onChangeText: setSenha2,
                                                        textContentType: "newPassword"
                                                    }}
                                                />

                                            </View>
                                        </ScrollView>
                                    )}

                                    <TouchableOpacity style={styles.actionButton} onPress={handleCadastro}>
                                        <Text style={styles.actionButtonText}>Cadastrar {selectedOption}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        </Animated.View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Image source={require("../../assets/images/mao.png")} style={styles.handImage} />
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Já tem uma conta?</Text>
                            <TouchableOpacity onPress={() => router.replace('/(public)/login')}>
                                <Text style={styles.signupLink}>Faça seu login!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </SafeAreaView>
    );
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BG,
    },
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: 'rgba(12, 12, 12, 0.65)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.BG,
    },
    bgImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        zIndex: -1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },

    header: {
        paddingTop: 30,
        paddingHorizontal: '8%',
    },
    backButton: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: 'rgba(116, 116, 116, 0.22)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        color: Colors.WHITE,
        fontSize: 20,
    },
    section: {
        alignItems: 'center',
        paddingHorizontal: '8%',
        paddingVertical: 20,
    },
    h1: {
        color: Colors.ORANGE,
        fontSize: 30,
        fontFamily: "Montserrat-Bold",
        textAlign: 'center',
    },
    h2: {
        color: Colors.WHITE,
        fontSize: 14,
        textAlign: "center",
        fontFamily: "Montserrat",
        marginTop: 8,
        marginBottom: 30,
        lineHeight: 25,
        opacity: 0.8,
    },
    actionButton: {
        width: "100%",
        backgroundColor: Colors.ORANGE,
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        gap: 8,
    },
    actionButtonText: {
        textAlign: "center",
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: "Montserrat-Medium"
    },
    footer: {
        alignItems: 'center',
        paddingBottom: 30,
        paddingHorizontal: '8%',
    },
    handImage: {
        width: 50,
        height: 43,
        marginBottom: 15,
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 15,
        marginRight: 5,
    },
    signupLink: {
        color: Colors.ORANGE,
        fontFamily: "Montserrat-Bold",
        fontSize: 15,
    },
    formTitle: {
        color: Colors.WHITE,
        fontSize: 18,
        fontFamily: 'Montserrat',
        textAlign: 'center',
        marginBottom: 20,
    },
    formContainer: {
        width: '100%',
    },
    formContent: {
        width: '100%',
    },
    formScrollView: {
        maxHeight: 350, // Altura que mostra aproximadamente 5 campos de input
        width: '100%',
    },
    label: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 14,
        marginBottom: 8,
    },
    input: {
        width: "100%",
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14,
        borderWidth: 1,
        borderColor: Colors.GRAY,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputMedium: {
        width: '75%',
    },
    inputSmall: {
        width: '20%',
        textAlign: 'center',
    },
    inputDdd: {
        width: '25%',
        textAlign: 'center',
    },
    inputTel: {
        width: '70%',
    },
    dateInputContainer: {
        position: 'relative',
    },
    calendarButton: {
        position: "absolute",
        bottom: 28,
        right: 15,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        width: "100%",
        backgroundColor: Colors.WHITE,
        paddingHorizontal: 15,
        paddingRight: 50,
        paddingVertical: 12,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14,
        borderWidth: 1,
        borderColor: Colors.GRAY,
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
    },
    eyeIcon: {
        fontSize: 20,
        color: Colors.GRAY,
    },
});