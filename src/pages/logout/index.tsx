import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import styles from './styles';
import ImagesPath from '../../utils/ImagesPath';
import { MD5 } from "crypto-js";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId, getPlatform } from '../../utils/StaticMethods';
import { MOBILE_API_PATH_REST, MOBILE_API_PATH_REST_AUTH_LOGIN, MOBILE_APP_VERSION, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_HOME, NAVIGATOR_STACK_SCREEN_WELCOME, RESPONSE_CODE_SUCCESS } from '../../utils/AppConstants';
import axiosInstance from '../../networking/api';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

const getEmail = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("email");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getPassword = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("password");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getUrl = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("url");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getLang = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("lang");
  } catch (error) {
      console.log(error);
      return null;  
  }
};

interface LogoutProps {
  navigation: any;
}

const setDataToStorage = async (email: string, password: string, url: string, lang: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("email", email);
      await AsyncStorage.setItem("password", password);
      await AsyncStorage.setItem("url", url);
      await AsyncStorage.setItem("lang", lang);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};

const Logout = ({navigation}: LogoutProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((store: any) => store.userInfo);
  const config = useSelector((store: any) => store.config);
  
  useEffect(() => {
    (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permission to access location was denied');
          return;
        }
        
        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        setLocation({ latitude, longitude });
    })();
  }, []);

  const handleAuth = async () => {
    try {
        const email: string | null = await getEmail();
        const password: string | null = await getPassword();
        const url: string | null = await getUrl();
        let lang: string | null = await getLang();
        if(!lang){
          lang = MOBILE_DEFAULT_LANG_KEY;
        }
        
        if (email && password && url) {
            const dataToSend = {
                pnToken: "",
                callerName: getPlatform(),
                callerVersion: MOBILE_APP_VERSION,
                depId: "",
                lang: lang,
                login: email,
                password: MD5(password).toString(),
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_AUTH_LOGIN, dataToSend);
            const result = response?.data?.result;
            
            if(result?.code == RESPONSE_CODE_SUCCESS){
                await setDataToStorage(email, password, url, lang);
                dispatch({
                    type: 'SET_CUSTOMER',
                    payload:{
                        isLogin: true,
                        account: response?.data?.userInfo,
                        departments: response?.data?.departments,
                        permissions: response?.data?.permissions,
                        uniqueDBKey: response?.data?.uniqueDBKey,
                        uniqueKey: response?.data?.uniqueKey,
                        userDefaultHomePage: response?.data?.userDefaultHomePage,
                    }
                })
                navigation.navigate(NAVIGATOR_STACK_SCREEN_HOME);
            } else {
                navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
            }
        } else {
            navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
        }
    } catch (e) {
        navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Logo */}
      <Image
        source={ImagesPath.logoIntro} // Replace with your actual logo path
        style={styles.logo}
      />

      {/* damaris mobile text */}
      {/* <Text style={styles.appName}>
        <Text style={styles.appNameMain}>damaris</Text>
        <Text style={styles.appNameSub}>mobile</Text>
      </Text> */}

      {/* My account box */}
      <View style={styles.accountBox}>
        <Text style={styles.accountTitle}>{t('menu_item_myAccount')}</Text>
        <Text style={styles.accountField}>
          {t('URL')}:
          <Text style={styles.accountValue}>{getUrl()}</Text>
        </Text>
        <Text style={[styles.accountField, styles.accountFieldMargin]}>
          {t('login')}:
          <Text style={styles.accountValue}> {userInfo?.account?.login}</Text>
        </Text>
        <Text style={[styles.accountField, styles.accountFieldMargin]}>
          {t('username')}:
          <Text style={styles.accountValue}> {userInfo?.account?.firstName} {userInfo?.account?.lastName}</Text>
        </Text>
      </View>

      {/* Vendor ID */}
      <Text style={styles.vendorLabel}>{t('providerId')}</Text>
      <Text style={styles.vendorValue}>{getDeviceId()}</Text>

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={() => handleAuth()}>
        <Text style={styles.loginButtonText}>{t('login')}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Logout;