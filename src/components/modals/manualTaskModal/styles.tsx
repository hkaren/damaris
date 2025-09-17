import {Dimensions, Platform, StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    containerModal: {
        margin: 0,
        flex: 1
    },
    container: {
        width: '100%',
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 30 : 0,
        borderRadius: 15,
        height: 300,
        padding: 10
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
        fontSize: 20,
        fontWeight: '600',
        color: '#555555',
        marginTop: 3
    },
    comment: {
      height: 100
    },
});
