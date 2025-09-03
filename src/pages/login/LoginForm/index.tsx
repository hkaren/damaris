import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';
import '../../../configs/i18n';
import { useTranslation } from 'react-i18next';
import axiosInstance from "../../../networking/api";
import {FormData} from '../../../Interface';
import {
    MOBILE_API_PATH_REST_AUTH_LOGIN,
    MOBILE_APP_VERSION, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_DRAWER,
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
    const configStore = useSelector((store: any) => store.configStore);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [deviceId, setDeviceId] = useState<string | null>('');

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
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
    }, []);

    const doLogin = async () => {
        console.log('doLogin start');

        try {
            if(data.login == '' || data.password == '' || url == ''){
                toast('error', 'top', 'ERROR!', t('all_fields_are_required'));
            } else {
                const password = MD5(data.password).toString();
                setLoading(true);
                const dataToSend = {
                    pnToken: "",
                    callerName: '', // getPlatform()
                    callerVersion: MOBILE_APP_VERSION,
                    depId: "",
                    lang: MOBILE_DEFAULT_LANG_KEY,
                    login: data.login,
                    password: password,
                    location: {
                        imei: await getDeviceId(),
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                    }
                };
                console.log(dataToSend, data, ' // dataToSend');
                
                
                //let url_ = "http://10.27.41.84:8888/dgs3g_web";
                let url_ = url;
                if(!url_.endsWith('/')){
                    url_ += '/';
                }
console.log('Login form URL: ', url_ + MOBILE_API_PATH_REST_AUTH_LOGIN);

                const response = await axiosInstance.post(url_ + MOBILE_API_PATH_REST_AUTH_LOGIN, dataToSend);
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
                    await setDataToStorage(data.login, password, url_, MOBILE_DEFAULT_LANG_KEY);
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
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
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
                    placeholderTextColor="#cdc7d4"
                    value={data.passwordFake}
                    textContentType="oneTimeCode"
                    secureTextEntry
                    autoCapitalize="none"
                    onChangeText={e => {
                        // Create fake password display with asterisks
                        let passFake = ''
                        for(let i = 0; i < e.length; i++) {
                            passFake += '*'
                        }
                        
                        // Handle password logic - detect if this is a paste operation or typing
                        let newPass = ''
                        const currentFakeLength = data.passwordFake.length
                        const newLength = e.length
                        
                        if(newLength > currentFakeLength) {
                            // Characters were added (typing or pasting)
                            if(newLength === currentFakeLength + 1) {
                                // Single character added (typing)
                                newPass = data.password + e[e.length - 1]
                            } else {
                                // Multiple characters added (pasting) - replace the entire password
                                newPass = e
                            }
                        } else if(newLength < currentFakeLength) {
                            // Characters were removed
                            newPass = data.password.slice(0, newLength)
                        } else {
                            // Length is the same, keep current password
                            newPass = data.password
                        }
                        
                        onChangeData(newPass, 'password')
                        onChangeData(passFake, 'passwordFake')
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
    );
};
