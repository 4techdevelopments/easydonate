// app/(auth)/conta.tsx

import api from '@/api/axios';
import { AvatarUploader } from '@/components/AvatarUploader';
import Colors from '@/components/Colors';
import { ProfileDataField } from '@/components/ProfileDataField';
import { useModalFeedback } from '@/contexts/ModalFeedbackContext';
import { useAuth } from '@/routes/AuthContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ContaScreen() {
    const router = useRouter();
    const { usuario, atualizarUsuario } = useAuth();
    const { mostrarModalFeedback } = useModalFeedback();

    const [nome, setNome] = useState(usuario?.nome || '');
    const [email, setEmail] = useState(usuario?.email || '');
    const [nomeSocial, setNomeSocial] = useState(usuario?.nomeSocial || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const dadosParaSalvar = {
            ...usuario,
            nome,
            email,
            nomeSocial,
        };

        try {
            // No seu backend, a rota de DoadorController espera um objeto com idDoador
            await api.put(`/Doador`, { ...dadosParaSalvar, idDoador: usuario.idDoador });
            atualizarUsuario(dadosParaSalvar);
            mostrarModalFeedback('Dados salvos com sucesso!', 'success');
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
            mostrarModalFeedback('Erro ao salvar os dados. Tente novamente.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={Colors.BLACK} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 10 }}>
                        <Feather name="user" size={20} color={Colors.BLACK} />
                        <Text style={styles.headerTitle}>Minha conta</Text>
                        <View style={{ width: 25 }} />
                    </View>
                </View>

                {/* Envolve o conteúdo principal para centralizar e adicionar espaçamento */}
                <View style={styles.contentWrapper}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        <View style={styles.profileSection}>
                            <AvatarUploader size={150} />
                            <Text style={styles.profileName}>{nome || "Nome do Usuário"}</Text>
                            {/* <Text style={styles.profileEmail}>{email}</Text> */}
                        </View>

                        <View style={styles.dataSection}>
                            {/* <Text style={styles.sectionTitle}>Meus dados:</Text> */}

                            <ProfileDataField label="Nome Completo" value={nome} onChangeText={setNome} />
                            <ProfileDataField label="Email" value={email} onChangeText={setEmail} />
                            <ProfileDataField label="Nome Social" value={nomeSocial} onChangeText={setNomeSocial} />

                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
                            <View style={styles.fieldContainer}>
                                <Text style={styles.label}>CPF</Text>
                                <Text style={styles.valueText}>{usuario?.cpf || 'Não informado'}</Text>
                            </View>
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
    );
}

// --- ESTILOS OTIMIZADOS PARA LAYOUT CLEAN ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.BG,
    },
    container: {
        flex: 1,
        paddingHorizontal: 35 // Padding horizontal um pouco menor
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 15, // Espaçamento do topo controlado aqui
        paddingBottom: 10,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Montserrat",
        color: Colors.BLACK,
    },
    // Novo container para centralizar o conteúdo da ScrollView
    contentWrapper: {
        flex: 1,
        justifyContent: 'center', // Centraliza o conteúdo verticalmente
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 10, // Espaço menor acima do avatar
        paddingBottom: 25, // Espaço menor abaixo do email
    },
    profileName: {
        fontSize: 22,
        fontFamily: "Montserrat-Bold",
        marginTop: 15,
        color: Colors.BLACK,
    },
    profileEmail: {
        fontSize: 15,
        fontFamily: "Montserrat",
        color: Colors.TEXT_LIGHT,
        marginTop: 4,
    },
    dataSection: {
        marginBottom: 10, // Espaço menor antes do botão
    },
    sectionTitle: {
        fontSize: 18, // Título da seção um pouco menor
        fontFamily: 'Montserrat-Bold',
        color: Colors.BLACK,
        marginBottom: 15,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 13, // Label um pouco menor
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