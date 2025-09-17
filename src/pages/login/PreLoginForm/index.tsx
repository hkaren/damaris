import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LANGUAGE_DE, LANGUAGE_EN, LANGUAGE_FR, LANGUAGE_RO, MOBILE_API_PATH_REST_AUTH_LOGIN, MOBILE_APP_VERSION_ANDROID, MOBILE_APP_VERSION_IOS, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_DRAWER, NAVIGATOR_STACK_SCREEN_LOGIN_FORM, NAVIGATOR_STACK_SCREEN_WELCOME, RESPONSE_CODE_SUCCESS } from '../../../utils/AppConstants';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import QRScanner from '../../general/components/QRScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../../../configs/i18n';
import { getDeviceId, getPlatform, parseYyyyMMddHHmm, readQrFromFirstPage, toast } from '../../../utils/StaticMethods';
import * as Location from 'expo-location';
import axiosInstance from '../../../networking/api';
import { useDispatch } from 'react-redux';

const getLang = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("lang");
  } catch (error) {
      console.log(error);
      return null;
  }
};

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

type RootStackParamList = {
  LoginForm: undefined;
  DrawerNavigation: undefined;
  WelcomePage: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PreLoginForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    setShowQrScanner(false);
  }, []);

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

  const scanQrCode = () => {
    setShowQrScanner(true);
  };

  const loginByQrCode = async (value: string) => {
    const contentsSpl = value.split("\n");
    console.log(contentsSpl, ' /// contentsSpl');
    
    const url = contentsSpl[0];
    const email = contentsSpl[1];
    const password = contentsSpl[2];
    const departmentId = contentsSpl[3];
    let language: string | null = contentsSpl[4];
    const qrCodeLifetime = contentsSpl[5];

    if (!language) {
        // Device language
        language = await getLang();
        if(!language || language == 'null' || language == 'undefined'){
          language = MOBILE_DEFAULT_LANG_KEY;
        }
        await i18n.changeLanguage(language);
        if (!language || (language != LANGUAGE_EN && language != LANGUAGE_FR &&
                language != LANGUAGE_DE && language != LANGUAGE_RO)) {
            language = MOBILE_DEFAULT_LANG_KEY;
        }
    }

    try {
      const parsed = parseYyyyMMddHHmm(qrCodeLifetime);
      if (parsed && parsed.getTime() > Date.now()) {
        if (email && password && url) {
            const dataToSend = {
                pnToken: "",
                callerName: getPlatform(),
                callerVersion: Platform.OS === 'android' ? MOBILE_APP_VERSION_ANDROID : MOBILE_APP_VERSION_IOS,
                depId: departmentId,
                lang: language,
                login: email,
                password: password,
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            console.log(dataToSend, ' /// dataToSend');
            
            
            let url_ = url;
            if(!url_.endsWith('/')){
                url_ += '/';
            }
            
            const response = await axiosInstance.post(url_ + MOBILE_API_PATH_REST_AUTH_LOGIN, dataToSend);
            const result = response?.data?.result;
            console.log(result, ' /// result');
            
            
            if(result?.code == RESPONSE_CODE_SUCCESS){
                await setDataToStorage(email, password, url_, language? language : '');
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
                navigation.replace(NAVIGATOR_STACK_SCREEN_DRAWER);
            } else {
                await setDataToStorage(email, '', url_, language? language : '');
                navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
            }
        } else {
            navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
        }           
      } else {
        toast('error', 'top', 'ERROR!', t('login_activity_qr_code_lifetime_invalid'));
      }
    } catch (e) {
      navigation.replace(NAVIGATOR_STACK_SCREEN_WELCOME);
    }
  };

  const browsePdf = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (res.canceled) return;

    const file = res.assets[0];
    // On Android/iOS, opening a local file path in the system browser often fails.
    // If your PDF is remote (https://...), WebBrowser can open it directly.
    // For local files, consider sharing or use Option B below.

    console.log(file.uri);

    try {
      const value = await readQrFromFirstPage(file.uri);
      if(value){
        loginByQrCode(value);
      } else {
        toast('error', 'top', 'ERROR!', t('login_activity_qr_code_invalid'));
      }
    } catch (e: any) {
      console.log(e);
      toast('error', 'top', 'ERROR!', t('login_activity_qr_code_invalid'));
    }
  };

  return (
    <View style={styles.container}> 
      {showQrScanner ? 
        <QRScanner
          onCode={(value) => {
            setShowQrScanner(false);
            loginByQrCode(value);
          }}
          onBack={() => setShowQrScanner(false)}
        />
      :
        <View style={styles.container_inner}>
          <Text style={styles.title}>{t('v2_welcome_title')}</Text>
          
          <Text style={styles.subtitle}>{t('v2_welcome_text')}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => scanQrCode()}>
              <Text style={styles.buttonText}>{t('v2_scan')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => browsePdf()}>
              <Text style={styles.buttonText}>{t('button_browse')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate(NAVIGATOR_STACK_SCREEN_LOGIN_FORM)}
            >
            <Text style={styles.buttonText}>{t('v2_manual_setup')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    </View>
  );
};

