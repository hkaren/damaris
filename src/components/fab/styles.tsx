import { StyleSheet, Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  containerModal: {
    justifyContent: 'flex-end',
    margin: 0,
    flex: 1,
  },
  containerModalContent: {
    
  },
  fabContainer: {
    position: 'absolute',
    right: 24,
    bottom: 70,
    alignItems: 'center',
  },
  fabMenuItem: {
    alignItems: 'center',
    marginBottom: 0,
  },
  fabMenuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabMenuText: {
    fontSize: 20,
    color: '#000000',
  },
  fabMenuLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 0,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196f3',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: {
    color: '#fff',
    fontSize: 36,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  transparent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(236, 236, 236, 0)'
  },
  indicator_container: {
      padding: 20,
      backgroundColor:  '#00000080',
      borderRadius: 10
  }
});
export default styles;