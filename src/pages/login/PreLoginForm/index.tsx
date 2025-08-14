import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NAVIGATOR_STACK_SCREEN_LOGIN_FORM } from '../../../utils/AppConstants';
import styles from './styles';

type RootStackParamList = {
  LoginForm: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PreLoginForm = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue</Text>
      
      <Text style={styles.subtitle}>
        Scannez le QR Code fourni par votre Organisation.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Naviguer...</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate(NAVIGATOR_STACK_SCREEN_LOGIN_FORM)}
        >
          <Text style={styles.buttonText}>Config. manuel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

