import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 2,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '500',
    color: '#222',
    flex: 1,
    textAlign: 'center',
  },
  messageContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    color: '#222',
    marginTop: 10
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee'
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#3ca4d8',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  desc_cont: {
    maxHeight: 45,
  },
  desc_text: {
      color: 'black',
      fontSize: 14,
      marginBottom: 10,
      letterSpacing: 0.5
  },
});
export default styles;