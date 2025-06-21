// components/PasswordInput.tsx

import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInputProps, TouchableOpacity, View } from 'react-native';
import Colors from './Colors';
import CustomInput from './CustomInput'; // Importa nosso CustomInput

interface PasswordInputProps {
    label: string;
    isPasswordVisible: boolean;
    onToggleVisibility: () => void;
    inputProps?: TextInputProps;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ label, isPasswordVisible, onToggleVisibility, inputProps }) => {
    return (
        <View style={styles.passwordContainer}>
            <CustomInput
                label={label}
                inputProps={{
                    ...inputProps,
                    secureTextEntry: !isPasswordVisible,
                    style: { paddingRight: 50 } // Adiciona espaço para o ícone não sobrepor o texto
                }}
            />
            <TouchableOpacity onPress={onToggleVisibility} style={styles.eyeButton}>
                <Entypo
                    name={isPasswordVisible ? "eye-with-line" : "eye"}
                    size={20}
                    color={isPasswordVisible ? Colors.GRAY : Colors.ORANGE}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    passwordContainer: {
        position: 'relative',
        width: '100%',
    },
    eyeButton: {
        position: 'absolute',
        right: 15,
        top: 38, // Ajuste fino para alinhar verticalmente com o input
        height: 30,
        justifyContent: 'center',
    },
});

export default PasswordInput;