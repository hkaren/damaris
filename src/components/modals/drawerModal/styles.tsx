import {StyleSheet, Dimensions} from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export const styles = StyleSheet.create({
    drawer_item: {
        height: 44,
        alignItems: 'center',
        flexDirection: 'row'
    },
    drawer_icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    drawer_text: {
        marginLeft: 30,
        color: 'black',
        fontSize: 20,
        fontWeight: '500',
    },
    w_100: {
        width: 100
    },
    owner_name: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
    },
    owner_department: {
        fontSize: 14,
        fontWeight: '400',
        color: 'black',
        marginTop: 5,
        marginBottom: 5,
    },
    owner_mode: {
        fontSize: 14,
        fontWeight: '400',
        color: '#00FF00',
    },
    devider: {
        height: 1,
        backgroundColor: '#bbbbbb',
        marginVertical: 10,
    }
});
