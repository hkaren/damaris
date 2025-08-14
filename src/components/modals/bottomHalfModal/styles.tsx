import { Dimensions, Platform, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    containerModal: {
        justifyContent: 'flex-end',
        margin: 0,
        flex: 1,
    },
    container: {
        width: width,
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 30 : 0,
        borderRadius: 15
    },
})