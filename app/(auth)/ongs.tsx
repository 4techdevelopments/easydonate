import BottomNavigation from '@/components/bottomNavigation';
import Colors from '@/components/Colors';
import EasyDonateSvg from '@/components/easyDonateSvg';
import { ModalOngs } from '@/components/modalOngs';
import { ongs } from '@/locations/ongs';
import PrivateRoute from '@/routes/PrivateRoute';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useFonts } from 'expo-font';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

const REGIAO_INICIAL = {
    latitude: -23.3197,
    longitude: -51.1661,
    latitudeDelta: 0.07,
    longitudeDelta: 0.07,
};

export default function Ongs() {
    const [visibleModal, setVisibleModal] = useState(false);
    const [mapRegion, setMapRegion] = useState(REGIAO_INICIAL);

    const [fontsLoaded] = useFonts({
        "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
        "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
        "Montserrat-BoldItalic": require("../../assets/fonts/Montserrat-BoldItalic.ttf")
    });

    if (!fontsLoaded) {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.BG }}>
                <EasyDonateSvg />
            </View>
        )
    }

    const goToOng = (latitude: number, longitude: number) => {
        setMapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
        });
    };

    return (
        <PrivateRoute>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={StyleSheet.absoluteFill}
                        region={mapRegion}
                        onRegionChangeComplete={(region) => setMapRegion(region)}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                    >
                        {ongs.map((ong) => (
                            <Marker
                                key={ong.id}
                                coordinate={{
                                    latitude: ong.latitude,
                                    longitude: ong.longitude
                                }}
                                title={ong.nome}
                                description={ong.endereco}
                                pinColor="red"
                            />
                        ))}
                    </MapView>
                </View>

                <View style={styles.WrapperDrop}>
                    <Pressable style={styles.BtnOngs} onPress={() => setVisibleModal(true)}>
                        <View>
                            <FontAwesome6 name="caret-down" size={24} color={Colors.ORANGE} />
                        </View>
                    </Pressable>
                </View>

                <Modal
                    visible={visibleModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setVisibleModal(false)}
                >
                    <ModalOngs
                        handleClose={() => setVisibleModal(false)}
                        goToOng={goToOng}
                    />
                </Modal>

                <View style={styles.Footer}>
                    <View style={styles.WrapperNav}>
                        <BottomNavigation />
                    </View>
                </View>
            </SafeAreaView>
        </PrivateRoute>
    );
}

const styles = StyleSheet.create({
    Footer: {
        width: "100%",
        height: "8%",
        display: "flex",
        justifyContent: "flex-end",
        backgroundColor: Colors.BG
    },
    WrapperDrop: {
        //backgroundColor: "#f00",
        width: "100%",
        height: "9%",
        position: "absolute",
        left: 0,
        top: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        paddingLeft: "5%",
        paddingRight: "5%"
    },
    BtnOngs: {
        backgroundColor: "#fff",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 100,
        display: "flex",
        borderWidth: 1,
        borderColor: Colors.ORANGE,
        zIndex: 15
    },
    WrapperNav: {
        marginLeft: "10%",
        marginRight: "10%"
    }
})