// components/Dropdown.tsx

import { AntDesign } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";

type OptionItem = {
    value: string;
    label: string;
}

interface DropdownProps {
    label?: string; // <-- 1. Adicionada a prop label (opcional)
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
    buttonStyle?: object;
    optionsStyle?: object;
}

export default function Dropdown({ label, data, onChange, placeholder, buttonStyle, optionsStyle }: DropdownProps) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded])
    const [value, setValue] = useState('');

    const onSelect = useCallback((item: OptionItem) => {
        onChange(item)
        setValue(item.label); // Alterado para mostrar o label ao invés do value
        setExpanded(false);
    }, [onChange]);

    return (
        // O container View agora tem um estilo próprio para o espaçamento
        <View style={styles.container}>
            {/* 2. Adicionado o Text para renderizar o label, se ele existir */}
            {label && <Text style={styles.label}>{label}</Text>}
            
            <Pressable style={[styles.Button, buttonStyle]} onPress={toggleExpanded}>
                <Text style={styles.TextDrop}>{value || placeholder}</Text>
                <AntDesign name={expanded ? "caretup" : "caretdown"} color="#333" />
            </Pressable>
            {
                expanded && (
                    <View style={[styles.Options, optionsStyle]}>
                        {data.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                activeOpacity={0.8}
                                style={styles.OptionsItem}
                                onPress={() => onSelect(item)}
                            >
                                <Text style={styles.TextItem}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    // 3. Adicionados os estilos para o container e para o label
    container: {
        width: '100%',
        marginBottom: 15,

    },
    label: {
        color: Colors.WHITE,
        fontFamily: "Montserrat",
        fontSize: 14,
        marginBottom: 8,
    },
    Button: {
        backgroundColor: Colors.WHITE,
        width: "100%",
        height: 45,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.GRAY
    },
    TextDrop: {
        fontFamily: "Montserrat",
        fontSize: 14
    },
    Options: {
        backgroundColor: Colors.WHITE,
        position: "absolute",
        top: 80, // Ajustado para a nova posição por causa do label
        width: "100%",
        padding: 15,
        zIndex: 10,
        borderRadius: 5,
        maxHeight: 200,
        // Adicionando uma sombra para melhor visualização
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    OptionsItem: {
        justifyContent: "center",
        height: 35
    },
    TextItem: {
        fontFamily: "Montserrat"
    },
    Separator: {
        height: 10
    }
})