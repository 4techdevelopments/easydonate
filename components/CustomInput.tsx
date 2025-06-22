// components/CustomInput.tsx

import React from 'react';
// 1. Não precisamos mais do ViewStyle aqui diretamente na interface
import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import Colors from './Colors';

// 2. A interface NÃO vai mais estender TextInputProps diretamente.
//    Isso evita o conflito da propriedade 'style'.
interface CustomInputProps {
  label?: string;
  // Criamos uma prop específica para o estilo do container
  containerStyle?: StyleProp<ViewStyle>;
  // O componente aceitará todas as props de um TextInput, que serão passadas adiante
  inputProps?: TextInputProps;
}

// 3. Recebemos 'label', 'containerStyle' e 'inputProps'
const CustomInput: React.FC<CustomInputProps> = ({ label, containerStyle, inputProps = {} }) => {
    // 1. Desestruturamos 'style' para fora do inputProps.
    //    'otherInputProps' conterá todo o resto (value, onChangeText, etc.)
    const { style: inputStyle, ...otherInputProps } = inputProps;

    return (
        <View style={[styles.inputContainer, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                // 2. A prop 'style' agora mescla o estilo base com o 'inputStyle' que separamos.
                style={[styles.input, inputStyle]}
                placeholderTextColor="#999"
                // 3. Fazemos o spread apenas das 'outras' props, que agora NÃO contêm mais a chave 'style'.
                {...otherInputProps}
            />
        </View>
    );
};

// Seus estilos permanecem os mesmos
const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 15,
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
        color: Colors.BLACK,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderRadius: 5,
        fontFamily: "Montserrat",
        fontSize: 14,
        borderWidth: 1,
        borderColor: Colors.GRAY,
      },
});

export default CustomInput;