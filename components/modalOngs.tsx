import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "./Colors";

type ModalOngsProps = {
    handleClose: () => void;
};

export function ModalOngs({ handleClose }: ModalOngsProps) {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.WrapperModal}>
                <TouchableOpacity style={styles.TouchArea} onPress={handleClose}></TouchableOpacity>
                <View style={styles.Modal}>
                    <Text style={styles.TextLoc}>Localização das ONGs</Text>

                    <View style={styles.WrapperLocs}>
                        <TouchableOpacity style={styles.OptionsLoc}>
                            <View style={styles.WrapperIcon}>
                                <Ionicons name="location-sharp" size={40} color={Colors.ORANGE} />
                            </View>
                            <View style={styles.Descricao}>
                                <Text style={styles.NomeOng}>ONG Viver - Crianças e Adolescentes com Câncer</Text>
                                <Text style={styles.InformacaoOng}>R. Bernardo Sayão, 319</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    WrapperModal: {
        width: "100%",
        height: "92%"
    },
    TouchArea: {
        width: "100%",
        height: "100%",
        backgroundColor: "#00000025",
        zIndex: 9,
    },
    Modal: {
        backgroundColor: Colors.BG,
        width: "100%",
        height: "60%",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        zIndex: 10,
        position: "absolute",
        bottom: 0,
        padding: 40
    },
    TextLoc: {
        textAlign: "center",
        fontFamily: "Montserrat-Bold",
        fontSize: 18,
        color: Colors.ORANGE,
        marginBottom: 40
    },
    WrapperLocs: {
        //backgroundColor: "#f00",
        flex: 1
    },
    OptionsLoc: {
        //backgroundColor: "#cecece",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15
    },
    WrapperIcon: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },
    Descricao: {
        //backgroundColor: "#f00",
        marginRight: 50
    },
    NomeOng: {
        fontFamily: "Montserrat-Medium",
        fontSize: 15,
        color: Colors.BLACK,
        paddingBottom: 5
    },
    InformacaoOng: {
        fontFamily: "Montserrat",
        fontSize: 13,
        color: Colors.GRAY
    }
})