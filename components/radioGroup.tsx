import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from './Colors';

interface RadioSelectorProps {
    options: string[];
    selectedOption: string;
    onSelect: (option: string) => void;
}

const RadioSelector: React.FC<RadioSelectorProps> = ({
    options,
    selectedOption,
    onSelect,
}) => {
    return (
        <View style={styles.RadioGroup}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={styles.RadioOption}
                    onPress={() => onSelect(option)}
                >
                    <View style={styles.RadioCircle}>
                        {selectedOption === option && (
                            <View style={styles.RadioInnerCircle}>
                                <MaterialIcons name="check" style={styles.CheckIcon} />
                            </View>
                        )}
                    </View>
                    <Text style={styles.RadioLabel}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    RadioGroup: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        width: '100%',
        marginBottom: 10
    },
    RadioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    RadioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.WHITE,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    RadioInnerCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: Colors.ORANGE
    },
    CheckIcon: {
        fontSize: 12,
        color: Colors.WHITE,
        lineHeight: 20,
        textAlign: 'center'
    },
    RadioLabel: {
        color: Colors.WHITE,
        fontFamily: 'Montserrat',
        fontSize: 14
    }
})

export default RadioSelector;