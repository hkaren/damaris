import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 40,
  },
  timeBadge: {
    position: 'absolute',
    top: 16,
    left: 24,
    backgroundColor: '#2ecc40',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 2,
    zIndex: 2,
  },
  timeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logo: {
    width: 200,
    height: 250,
    resizeMode: 'contain',
    marginTop: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 12,
  },
  appNameMain: {
    color: '#222',
  },
  appNameSub: {
    color: '#bbb',
    fontWeight: '400',
  },
  accountBox: {
    width: '88%',
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 20,
    marginTop: 36,
    padding: 16,
  },
  accountTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  accountField: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  accountValue: {
    fontWeight: '400',
  },
  accountFieldMargin: {
    marginTop: 4,
  },
  vendorLabel: {
    color: '#bbb',
    fontSize: 18,
    marginTop: 32,
    width: '100%',
    textAlign: 'left',
    marginLeft: 40,
  },
  vendorValue: {
    color: '#bbb',
    fontSize: 18,
    marginTop: 4,
    marginBottom: 32,
  },
  loginButton: {
    width: '90%',
    backgroundColor: '#eaf6f5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
});
export default styles;