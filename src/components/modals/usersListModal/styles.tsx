import {StyleSheet, Dimensions} from "react-native";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

const widthCalculate = (widthC: number) => {
    return width * widthC / 375
}

const heightCalculate = (heightC: number) => {
    return height * heightC / 812
}

export const styles = StyleSheet.create({
    containerModal: {
        margin: 0,
        flex: 1,
    },
    container: {
        backgroundColor: '#fff',
        padding: 16,
        height: 300,
        marginHorizontal: 15,
    },
    section: {
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#CDC7D4',
    },
    item_cont: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center'
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
        marginLeft: 10,
        color: '#000',
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 6,
    },
    line: {
        height: 5,
        width: 18,
        marginRight: 7,
    },
    iconItem: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    iconText: {
        marginLeft: 10,
        fontWeight: '500',
        fontSize: 12,
    },
    touchArea: {
        paddingBottom: 3,
        paddingTop: 3,
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
});
