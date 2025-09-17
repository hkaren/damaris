import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    containerModal: {
        margin: 0,
        flex: 1,
        marginHorizontal: 10
    },
    container: {
        backgroundColor: '#fff',
        padding: 10,
    },
    title_area: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#d9d9d9",
        marginBottom: 10
    },
    icon: {
        marginTop: 8,
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555555'
    },
    closeBtn: {
        width: 44,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 4,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 8,
        paddingTop: 5
    },
    htmlData: {
        fontSize: 15,
        marginTop: 8
    },
});
