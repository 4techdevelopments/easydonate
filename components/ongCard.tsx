import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ong } from '../types/Ong';
import Colors from './Colors';

type Props = {
    ong: Ong;
};

const OngCard = ({ ong }: Props) => {
    const router = useRouter();

    const handlePress = () => {
        router.push({
            pathname: '/(auth)/ongDetalhes',
            params: { idOng: String(ong.idOng) }
        });
    };

    return (
        <Pressable style={styles.DivOng} onPress={handlePress}>
            <View style={styles.WrapperInfoOng}>
                <View style={styles.WrapperHeart}>
                    <MaterialIcons name="verified" size={30} color={Colors.ORANGE} />
                </View>

                <View style={styles.WrapperImgOng}>
                    {ong.logo ? (
                        <Image
                            source={{ uri: ong.logo }}
                            style={styles.OngImage}
                            resizeMode="center"
                        />
                    ) : null}
                </View>

                <View style={styles.WrapperOng}>
                    <Text style={styles.NomeOng}>{ong.nome}</Text>
                    <Text style={styles.LocalOng}>{ong.cidade}-{ong.estado}</Text>
                </View>

                <View style={styles.WrapperCategoria}>
                    <Text style={styles.NomeCategoria}>Categoria: </Text>
                    <Text style={styles.NomeCategoriaBold}>{ong.tipoAtividade}</Text>
                </View>
            </View>
        </Pressable>
    );
};

export default OngCard;

const styles = StyleSheet.create({
    DivOng: {
        width: "100%",
        backgroundColor: Colors.INPUT_GRAY,
        height: 300,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        marginBottom: 35
    },
    WrapperInfoOng: {
        //backgroundColor: "#0000ff25",
        padding: 25,
        width: "100%",
        height: "100%"
    },
    WrapperHeart: {
        //backgroundColor: "#f00",
        width: "100%"
    },
    WrapperOng: {
        //backgroundColor: "#ff0",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    NomeOng: {
        fontFamily: "Montserrat-Bold",
        fontSize: 18
    },
    LocalOng: {
        fontFamily: "Montserrat",
        fontSize: 14
    },
    WrapperImgOng: {
        //backgroundColor: "#0f0",
        width: "100%",
        height: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 10
    },
    OngImage: {
        width: "90%",
        height: "90%"
    },
    WrapperCategoria: {
        //backgroundColor: "#0ff",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        paddingTop: 20
    },
    NomeCategoria: {
        fontFamily: "Montserrat"
    },
    NomeCategoriaBold: {
        fontFamily: "Montserrat-Bold"
    },
});
