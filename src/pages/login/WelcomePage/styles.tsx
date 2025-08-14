import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
      paddingVertical: '20%',
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      width: 200,
      height: 200,
    },
    textContainer: {
      alignItems: 'center',
      marginVertical: 40,
    },
    subtitle: {
      fontSize: 20,
      textAlign: 'center',
      color: '#000',
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
  });

export default styles;