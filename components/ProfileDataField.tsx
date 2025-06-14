// components/ProfileDataField.tsx

import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from './Colors';

interface ProfileDataFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    // Adicionaremos mais props aqui depois (ex: keyboardType)
}

export function ProfileDataField({ label, value, onChangeText }: ProfileDataFieldProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.fieldContainer}>
                {isEditing ? (
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus={true} // Foca no campo de texto ao entrar no modo de edição
                        onBlur={() => setIsEditing(false)} // Opcional: sai do modo de edição ao perder o foco
                    />
                ) : (
                    <Text style={styles.valueText}>{value}</Text>
                )}

                <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(!isEditing)}>
                    <Feather name={isEditing ? "check-circle" : "edit-3"} size={20} color={Colors.ORANGE} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        color: Colors.TEXT_LIGHT,
        marginBottom: 5,
    },
    fieldContainer: {
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 50,
    },
    valueText: {
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: Colors.BLACK,
        flex: 1, // Garante que o texto ocupe o espaço disponível
    },
    input: {
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: Colors.BLACK,
        flex: 1, // Garante que o campo de texto ocupe o espaço
        paddingVertical: 0, // Remove padding vertical extra do TextInput
    },
    editButton: {
        paddingLeft: 10,
    },
});