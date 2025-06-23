// components/Checkbox.tsx
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Colors from './Colors'; // Supondo que seu arquivo de cores está aqui

interface CheckboxProps {
  label: React.ReactNode;
  isChecked: boolean;
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked, onPress, containerStyle }) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.checkbox, isChecked && styles.checked]}>
        {isChecked && <Feather name="check" size={16} color={Colors.WHITE} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: Colors.ORANGE,
  },
  label: {
    flex: 1, // Permite que o texto quebre a linha se for muito grande
    color: Colors.WHITE,
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
});

export default Checkbox;