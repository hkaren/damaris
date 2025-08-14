import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      marginTop: 40,
      marginBottom: 40,
    },
    formContainer: {
      gap: 16,
    },
    input: {
      backgroundColor: '#F5F5F5',
      padding: 15,
      borderRadius: 10,
      fontSize: 16,
    },
    label: {
      color: '#666',
      fontSize: 16,
      marginTop: 10,
    },
    button: {
      backgroundColor: '#E8F4F6',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      fontSize: 18,
      color: '#000',
      fontWeight: '500',
    },
    idContainer: {
      marginTop: 30,
    },
    idLabel: {
      color: '#666',
      fontSize: 16,
      marginBottom: 8,
    },
    idValue: {
      fontSize: 16,
      color: '#000',
    },
  });
  
  export default styles;