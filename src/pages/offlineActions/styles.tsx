import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#fff',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#F3F8FA',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderColor: '#E0E0E0',
    },
    tableHeaderText: {
      flex: 1,
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'center',
    },
    tableRow: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderTopWidth: 1,
      borderColor: '#E0E0E0',
    },
    tableRowText: {
      flex: 1,
      fontSize: 16,
      textAlign: 'center',
    },
    
  });
  
  export default styles;
