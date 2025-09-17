import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fafafa',
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 18,
    color: '#222',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  checkbox: {
    marginTop: 6,
    marginRight: 8,
  },
  itemContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#111',
    marginBottom: 2,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 4,
  },
  more: {
    color: '#2ca6e0',
    fontSize: 16,
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  separator: {
    height: 10,
  },
  line1: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  line2: {
    fontSize: 14,
    color: '#222',
  },
});
export default styles;