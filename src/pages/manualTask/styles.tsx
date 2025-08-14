import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#fff',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      backgroundColor: '#fff',
      height: 48,
    },
    searchInput: {
      flex: 1,
      fontSize: 18,
      paddingVertical: 10,
      backgroundColor: 'transparent',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#bbb',
      paddingHorizontal: 12
    },
    searchButton: {
      backgroundColor: '#F3F8FA',
      borderRadius: 12,
      padding: 6,
      marginLeft: 8,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
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
      paddingVertical: 8,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderColor: '#F3F8FA',
    },
    tableCell: {
      flex: 1,
      fontSize: 16,
      textAlign: 'center',
    },
    tableCellText: {
      fontSize: 16,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    openTaskContainer: {
      padding: 16,
      marginTop: 20
    },
    openTaskTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    openTaskText: {
      fontSize: 16,
      fontWeight: 'normal',
    }
  });
  
  export default styles;
