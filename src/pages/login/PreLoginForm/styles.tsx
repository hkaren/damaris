import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
    },
    container_inner: {
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 40,
    },
    subtitle: {
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 60,
      lineHeight: 28,
    },
    buttonContainer: {
      gap: 16,
    },
    button: {
      backgroundColor: '#E8F4F6',
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 18,
      color: '#000',
      fontWeight: '500',
    },
  });
  
  export default styles;