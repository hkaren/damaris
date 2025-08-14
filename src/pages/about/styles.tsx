import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginLeft: 16,
    },
    menuIcon: {
      fontSize: 28,
      marginRight: 16,
      marginTop: 8,
    },
    headerText: {
      fontSize: 24,
      fontWeight: '500',
      marginTop: 8,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: 32,
    },
    logo: {
      width: 200,
      height: 250,
    },
    brand: {
      fontSize: 32,
      marginTop: 16,
    },
    description: {
      textAlign: 'center',
      marginHorizontal: 16,
      marginTop: 32,
      fontSize: 16,
      color: '#222',
    },
    vendorContainer: {
      marginTop: 100,
      marginLeft: 16,
    },
    vendorLabel: {
      color: '#aaa',
      fontSize: 18,
    },
    vendorValue: {
      color: '#aaa',
      fontSize: 16,
      marginTop: 8,
    },
    copyright: {
      position: 'absolute',
      bottom: 32,
      width: '100%',
      textAlign: 'center',
      color: '#222',
      fontSize: 15,
    },
    fab: {
      position: 'absolute',
      right: 24,
      bottom: 70,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#2196f3',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    fabText: {
      color: '#fff',
      fontSize: 36,
      lineHeight: 40,
    },
  });
  
  export default styles;
