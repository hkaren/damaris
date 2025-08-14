import {StyleSheet, Dimensions} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const styles = StyleSheet.create({
    containerModal: {
        margin: 0,
        flex: 1,
        marginHorizontal: 10
    },
    container: {
        backgroundColor: '#fff',
        padding: 10,
        flex: 1,
    },
    title_area: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: "#d9d9d9",
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icon: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#555555',
        flex: 1
    },
    closeButton: {
        padding: 5,
    },
    carouselContainer: {
        flex: 1,
        marginTop: 10,
    },
    documentContainer: {
        width: screenWidth - 40,
        height: screenHeight * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    documentImage: {
        width: '100%',
        height: '100%',
    },
    pdfContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 20,
    },
    pdfPreview: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pdfText: {
        fontSize: 18,
        color: '#555555',
        marginTop: 10,
        fontWeight: '500',
    },
    pdfTitle: {
        fontSize: 14,
        color: '#888888',
        marginTop: 5,
        marginBottom: 20,
    },
    openPdfButton: {
        flexDirection: 'row',
        backgroundColor: '#368200',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
    },
    openPdfButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 8,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 20,
    },
    navButton: {
        padding: 10,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        minWidth: 50,
        alignItems: 'center',
    },
    navButtonDisabled: {
        backgroundColor: '#f8f8f8',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d9d9d9',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#368200',
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    counterText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#888888',
        marginTop: 10,
    },
    noDocumentsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDocumentsText: {
        fontSize: 16,
        color: '#888888',
        marginTop: 10,
    }
});
