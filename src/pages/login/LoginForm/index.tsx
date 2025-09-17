import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';
import '../../../configs/i18n';
import { useTranslation } from 'react-i18next';
import axiosInstance from "../../../networking/api";
import {FormData} from '../../../Interface';
import {
    MOBILE_API_PATH_REST_AUTH_LOGIN,
    MOBILE_APP_VERSION_ANDROID,
    MOBILE_APP_VERSION_IOS,
    MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_DRAWER,
    RESPONSE_CODE_ERROR_NOT_COMPATIBLE_VERSION,
    RESPONSE_CODE_ERROR_UNKNOWN_MOBILE_DEVICE,
    RESPONSE_CODE_SUCCESS
} from '../../../utils/AppConstants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceId, getPlatform, toast } from '../../../utils/StaticMethods';
import { Loading } from '../../../components/loading/Loading';
import MD5 from 'crypto-js/md5';
import * as Location from 'expo-location';

const getEmail = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem("email");
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
  Home: undefined;
  DrawerNavigation: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const LoginForm = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>('');
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<FormData>({
        login: '',
        password: '',
        passwordFake: ''
    });

    useEffect(() => {
        setLoading(false);

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
            const id = await getDeviceId();
            setDeviceId(id);
        })();
        
        initDefaultLoginData();
    }, []);

    const initDefaultLoginData = async () => {
        const url: string | null = await getUrl();
        const email: string | null = await getEmail();
        console.log(url, email, ' /// url, email');
        
        setUrl(url ? url : '');
        data['login'] = email ? email : '';
        setData({...data});
    };

    const doLogin = async () => {
        console.log('doLogin start');

        try {
            if(data.login == '' || data.password == '' || url == ''){
                toast('error', 'top', 'ERROR!', t('all_fields_are_required'));
            } else {
                const password = MD5(data.password.trim()).toString();
                //Alert.alert('pass: ', data.password+" // "+password);
                setLoading(true);
                const dataToSend = {
                    pnToken: "",
                    callerName: getPlatform(),
                    callerVersion: Platform.OS === 'android' ? MOBILE_APP_VERSION_ANDROID : MOBILE_APP_VERSION_IOS,
                    depId: "",
                    lang: MOBILE_DEFAULT_LANG_KEY,
                    login: data.login.trim(),
                    password: password,
                    location: {
                        imei: await getDeviceId(),
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                    }
                };
                console.log(dataToSend, data, ' // dataToSend');
                
                
                //let url_ = "http://10.27.41.84:8888/dgs3g_web";
                let url_ = url.trim();
                if(!url_.endsWith('/')){
                    url_ += '/';
                }
console.log('Login form URL: ', url_ + MOBILE_API_PATH_REST_AUTH_LOGIN);

                const response = await axiosInstance.post(url_ + MOBILE_API_PATH_REST_AUTH_LOGIN, dataToSend);
                //const response = await axiosInstance.post('https://qa01.damaris.pro/DamarisRM_mysql/rest/services/auth/login', dataToSend);
                console.log(response.data, ' // response');
                //Alert.alert('response', JSON.stringify(response.data));

                
                const result = response?.data?.result;

                let message: string = '';
                if(result?.code === RESPONSE_CODE_ERROR_NOT_COMPATIBLE_VERSION){
                    message = t('incompatible_version1');
                } else if(result?.code === RESPONSE_CODE_ERROR_UNKNOWN_MOBILE_DEVICE){
                    message = t('unknown_device_login');
                } else if(result?.code !== RESPONSE_CODE_SUCCESS){
                    message = t('incorrect_user_details');
                }
                setLoading(false);

                if(message){
                    toast('error', 'top', 'ERROR!', result?.message);
                } else {
                    await setDataToStorage(data.login.trim(), password, url_, MOBILE_DEFAULT_LANG_KEY);
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
                    navigation.reset({
                        index: 0,
                        routes: [{ name: NAVIGATOR_STACK_SCREEN_DRAWER }],
                    });
                }
            }
        } catch (e) {
            console.log(e);
            setLoading(false)
        }
    };

    let onChangeData = (e: string, name: string) => {
        data[name] = e;
        setData({...data});
    };

    // const DismissKeyboardView = ({ children }: { children: React.ReactNode }) => (
    //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //         {children}
    //     </TouchableWithoutFeedback>
    // );

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView 
                contentContainerStyle={styles.container} 
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Image
                    source={require('../../../../assets/logo_v2.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={t('login')}
                        autoCapitalize="none"
                        value={data.login}
                        onChangeText={e => onChangeData(e, 'login')}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder={t('password')}
                        placeholderTextColor="#999"
                        value={data.password}
                        textContentType="oneTimeCode"
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={e => {
                            onChangeData(e, 'password')
                        }}
                    />

                    <Text style={styles.label}>{t('urlDamarisRM')}</Text>
                    <TextInput
                        style={styles.input}
                        value={url}
                        // onChangeText={setUrl}
                        onChangeText={e => setUrl(e)}
                        autoCapitalize="none"
                    />

                     <TouchableOpacity style={styles.button} onPress={doLogin}>
                        <Text style={styles.buttonText}>{t('connection')}</Text>
                    </TouchableOpacity>


                    <View style={styles.idContainer}>
                        <Text style={styles.idLabel}>{t('providerId')}</Text>
                        <Text style={styles.idValue}>{deviceId}</Text>

                    </View>
                </View>
                <Loading visible={loading} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};
