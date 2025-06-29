// app/(auth)/conta.tsx

import api from '@/api/axios';
import { AvatarUploader } from '@/components/AvatarUploader';
import Colors from '@/components/Colors';
import { ProfileDataField } from '@/components/ProfileDataField';
import { useModalFeedback } from '@/contexts/ModalFeedbackContext';
import { useAuth } from '@/routes/AuthContext';
// --- IMPORTAÇÃO ADICIONADA ---
import PrivateRoute from '@/routes/PrivateRoute';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Conta() {
    const router = useRouter();
    const { usuario, atualizarUsuario } = useAuth();
    const { mostrarModalFeedback } = useModalFeedback();

    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [senha, setSenha] = useState('');
    const [senha2, setSenha2] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!email || !senha || !senha2 || !confirmarSenha) {
            mostrarModalFeedback('Preencha todos os campos para realizar a alteração dos dados!', 'error', undefined);
            return;
        }

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email)) {
            mostrarModalFeedback("Digite um e-mail válido!", 'error', undefined);
            return;
        }

        const senhaRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!senhaRegex.test(senha)) {
            mostrarModalFeedback("A senha deve conter no mínimo 8 caracteres e incluir pelo menos uma letra maiúscula, um número e um caractere especial!", 'error', undefined);
            return;
        }

        if (!confirmarSenha) {
            mostrarModalFeedback('Confirme a senha para realizar a alteração dos dados!', 'error', undefined);
            return;
        }

        if (senha2 !== senha) {
            mostrarModalFeedback('As senhas não coincidem!', 'error', undefined);
            return;
        }

        setIsSaving(true);

        const dadosParaSalvar = {
            email,
            senha,
            confirmarSenha,
        };

        try {
            const response = await api.put(`/Usuario/${usuario.id}`, dadosParaSalvar);

            if (response.status === 200) {
                atualizarUsuario(dadosParaSalvar);
                mostrarModalFeedback('Dados salvos com sucesso!', 'success', undefined);
            }

        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            mostrarModalFeedback('Erro ao salvar os dados. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        // --- PrivateRoute adicionado aqui ---
        <PrivateRoute>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Feather name="arrow-left" size={24} color={Colors.BLACK} />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <Feather name="user" size={20} color={Colors.BLACK} />
                            <Text style={styles.headerTitle}>Minha conta</Text>
                            <View style={{ width: 25 }} /> 
                        </View>
                    </View>
                    
                    <View style={styles.contentWrapper}>
                        <ScrollView showsVerticalScrollIndicator={false} >
                            <View style={styles.profileSection}>
                                <AvatarUploader size={150} />
                                
                                <View style={styles.nameContainer}>
                                    <Text style={styles.profileName}>{nome || "Nome do Usuário"}</Text>
                                    <MaterialIcons name="verified" size={20} color={Colors.ORANGE} />
                                </View>
                                
                                <Text style={styles.profileEmail}>{email}</Text>
                            </View>

                            <View style={styles.dataSection}>
                                <View style={styles.fieldContainer}>
                                    <Text style={styles.label}>Nome</Text>
                                    <Text style={styles.valueText}>{usuario?.nome || 'Não informado'}</Text>
                                </View>

                                <ProfileDataField label="Email" value={email} onChangeText={setEmail} />
                                <ProfileDataField label="Senha" value={senha} onChangeText={setSenha} />
                                <ProfileDataField label="Repita a Senha" value={senha2} onChangeText={setSenha2} />
                                <ProfileDataField label="Confirme a Senha" value={confirmarSenha} onChangeText={setConfirmarSenha} />
                            </View>
                        </ScrollView>

                        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
                            {isSaving ? (
                                <ActivityIndicator color={Colors.WHITE} />
                            ) : (
                                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </PrivateRoute>
    );
}


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BG,
    },
    container: {
        flex: 1,
        paddingHorizontal: 35
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitleContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1, 
        justifyContent: 'center', 
        gap: 10
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Montserrat",
        color: Colors.BLACK,
    },
    contentWrapper: {
        flex: 1,
        // Removido o justifyContent para permitir que o ScrollView cresça
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 25,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 15,
    },
    profileName: {
        fontSize: 22,
        fontFamily: "Montserrat-Bold",
        color: Colors.BLACK,
    },
    profileEmail: {
        fontSize: 15,
        fontFamily: "Montserrat",
        color: Colors.TEXT_LIGHT,
        marginTop: 4,
    },
    dataSection: {
        marginBottom: 10,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 13,
        fontFamily: 'Montserrat',
        color: Colors.TEXT_LIGHT,
        marginBottom: 6,
    },
    valueText: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 13,
        fontSize: 15,
        fontFamily: 'Montserrat',
        color: Colors.BLACK,
        overflow: 'hidden',
    },
    saveButton: {
        backgroundColor: Colors.ORANGE,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    saveButtonText: {
        color: Colors.WHITE,
        fontSize: 16,
        fontFamily: 'Montserrat',
    },
});
