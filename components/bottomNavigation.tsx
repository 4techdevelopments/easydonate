/* eslint-disable import/no-named-as-default */
import { useAuth } from '@/routes/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "./Colors";
import Mao from "./mao";

function BottomNavigation() {

    const { logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
    };

    return (
        <View style={styles.Nav}>
            <View style={styles.BtnWrapper}>
                <TouchableOpacity style={styles.Buttons} onPress={() => router.push('/(auth)/home')}>
                    <FontAwesome
                        name="home"
                        style={pathname === '/home' ? styles.IconActive : styles.Icon}
                    />
                    <Text style={pathname === '/home' ? styles.TextBtnsActive : styles.TextBtns}>Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Buttons} onPress={() => router.push('/(auth)/doacoes')}>
                    <Mao fill={pathname === '/doacoes' ? '#FC7100' : '#BEBEBE'} />
                    <Text style={pathname === '/doacoes' ? styles.TextBtnsActive : styles.TextBtns}>
                        Doações
                    </Text>
                </TouchableOpacity>


                <TouchableOpacity style={styles.Buttons} onPress={() => router.push('/(auth)/ongs')}>
                    <Ionicons
                        name="location-sharp"
                        style={pathname === '/ongs' ? styles.IconActive : styles.Icon} />
                    <Text style={pathname === '/ongs' ? styles.TextBtnsActive : styles.TextBtns}>ONGs</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.Buttons} onPress={handleLogout}>
                    <FontAwesome name="gear" style={styles.Icon} />
                    <Text style={styles.TextBtns}>Configurações</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    Nav: {
        width: "100%",
        height: "100%",
        backgroundColor: Colors.BG,
        borderTopWidth: 1,
        borderColor: "#00000010",
        display: "flex",
        alignItems: "center",
        zIndex: 9999
    },
    BtnWrapper: {
        //backgroundColor: "#f00",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    Buttons: {
        //backgroundColor: "#f00",
        height: "80%",
        width: "25%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    TextBtns: {
        fontSize: 10,
        fontFamily: "Montserrat",
        color: Colors.TEXT_LIGHT
    },
    TextBtnsActive: {
        fontSize: 10,
        fontFamily: "Montserrat",
        color: Colors.ORANGE
    },
    IconActive: {
        fontSize: 30,
        color: Colors.ORANGE
    },
    Icon: {
        fontSize: 30,
        color: Colors.GRAY
    }
})

export default BottomNavigation;