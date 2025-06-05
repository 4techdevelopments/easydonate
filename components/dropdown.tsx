import { AntDesign } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";

type OptionItem = {
    value: string;
    label: string;
}

interface DropdownProps {
    data: OptionItem[];
    onChange: (item: OptionItem) => void;
    placeholder: string;
    buttonStyle?: object;
    optionsStyle?: object;
}

export default function Dropdown({ data, onChange, placeholder, buttonStyle, optionsStyle }: DropdownProps) {
    const [expanded, setExpanded] = useState(false);
    const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded])
    const [value, setValue] = useState('');

    const onSelect = useCallback((item: OptionItem) => {
        onChange(item)
        setValue(item.value);
        setExpanded(false);
    }, []);

    return (
        <View>
            <Pressable style={[styles.Button, buttonStyle]} onPress={toggleExpanded}>
                <Text style={styles.TextDrop}>{value || placeholder}</Text>
                <AntDesign name={expanded ? "caretup" : "caretdown"} />
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
        top: 53,
        width: "100%",
        padding: 15,
        zIndex: 10,
        borderRadius: 5,
        maxHeight: 250
    },
    OptionsItem: {
        justifyContent: "center",
        height: 30
    },
    TextItem: {
        fontFamily: "Montserrat"
    },
    Separator: {
        height: 10
    }
})