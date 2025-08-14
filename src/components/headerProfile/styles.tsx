import {StyleSheet, Dimensions} from "react-native";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

export const styles = StyleSheet.create({
    container: {
        width,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    header_item: {
        width: width/7,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    under_line: {
       borderBottomWidth: 1,
        borderBottomColor: '#4B0082'
    }
});
