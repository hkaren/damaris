import {useEffect, useState} from "react";
import {Image, View, Dimensions} from 'react-native';
import {useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles";
import { MOBILE_API_PATH_REST, MOBILE_API_PATH_REST_AUTH_LOGIN, MOBILE_APP_VERSION, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_DRAWER, NAVIGATOR_STACK_SCREEN_WELCOME, RESPONSE_CODE_SUCCESS } from "../../../utils/AppConstants";
import { getDeviceId, getPlatform } from "../../../utils/StaticMethods";
import { MD5 } from "crypto-js";
import * as Location from 'expo-location';
import axiosInstance from "../../../networking/api";
import i18n from "../../../configs/i18n";

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

interface SplashScreenProps {
    navigation: any;
}
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SplashScreen = ({navigation}: SplashScreenProps) => {
    const dispatch = useDispatch();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);


    useEffect(() => {
        const time = setTimeout(() => {
            handleAuth();
        }, 1000)
        return () => clearTimeout(time)
    });

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
            await i18n.changeLanguage(lang);
            
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
                    navigation.replace(NAVIGATOR_STACK_SCREEN_DRAWER);
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
            <Image
                source={require('../../../../assets/logo_v2.png')}
                style={styles.logo}
                resizeMode="contain"
            />
         </View>
    )
}
