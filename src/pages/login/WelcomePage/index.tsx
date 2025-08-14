import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAVIGATOR_STACK_SCREEN_PRE_LOGIN_FORM } from '../../../utils/AppConstants';
import styles from './styles';
import { useSelector } from 'react-redux';

type RootStackParamList = {
  Login: undefined;
  PreLoginForm: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomePage = () => {
  const navigation = useNavigation<NavigationProp>();
  const config = useSelector((store: any) => store.config);
  console.log(config, ' // config');
  

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../../assets/logo_intro.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>Bienvenue dans Damaris Mobile.</Text>
        <Text style={styles.subtitle}>Veuillez cliquer pour continuer.</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate(NAVIGATOR_STACK_SCREEN_PRE_LOGIN_FORM)}
      >
        <Text style={styles.buttonText}>Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomePage;