import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  moreOptionsText: {
    color: '#999999',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  switchContainer: {
    backgroundColor: '#ededed',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  comment: {
    height: 150
  },
});
export default styles;