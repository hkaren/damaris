import React, {FC, useEffect, useState} from 'react';
import { MainTabActivityScreenProps} from '../../Interface';
import {
  Header,
} from '../../components';
import {useDispatch, useSelector} from "react-redux";
import { Text, View, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { InputOutlined } from '../../components/core/InputOutlined';
import { Select } from '../../components/core/Select';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../core/Styles';
import axiosInstance from '../../networking/api';
import { LANGUAGE_DE, LANGUAGE_EN, LANGUAGE_FR, LANGUAGE_RO, MOBILE_API_PATH_REST_AUTH_LOGIN, MOBILE_API_PATH_REST_DEPARTMENT, MOBILE_APP_VERSION_ANDROID, MOBILE_APP_VERSION_IOS, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_DRAWER, NAVIGATOR_STACK_SCREEN_WELCOME, RESPONSE_CODE_ERROR_NOT_COMPATIBLE_VERSION, RESPONSE_CODE_ERROR_UNKNOWN_MOBILE_DEVICE, RESPONSE_CODE_SUCCESS, SCALE_1280x720, SCALE_1440x1080, SCALE_1600x1200, SCALE_2048x1536, SCALE_2592x1944, SCALE_3200x1800, SCALE_3200x2400, SCALE_320x240, SCALE_3264x1836, SCALE_640x480 } from '../../utils/AppConstants';
import { getDeviceId, getPlatform, parseYyyyMMddHHmm, readQrFromFirstPage, toast } from '../../utils/StaticMethods';
import * as Location from 'expo-location';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from '../../components/loading/Loading';
import { MD5 } from 'crypto-js';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import i18n from '../../configs/i18n';
import styles from './styles';
import * as DocumentPicker from 'expo-document-picker';
import QRScanner from '../general/components/QRScanner';

const getLang = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("lang");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getUrlFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("url");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getLangFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("lang");
  } catch (error) {
      console.log(error);
      return null;
  }
};

const setLanguageToStorage = async (lang: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("lang", lang);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};

const setScaleToStorage = async (scale: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("scale", scale);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getScaleFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("scale");
  } catch (error) {
      console.log(error);
      return null;
  }
};

const setExportPDFToStorage = async (exportPDF: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("exportPDF", exportPDF);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getExportPDFFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("exportPDF");
  } catch (error) {
      console.log(error);
      return null;
  }
};
const setAllowFingerprintToStorage = async (allowFingerprint: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("allowFingerprint", allowFingerprint);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};
const getAllowFingerprintFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("allowFingerprint");
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
  DrawerNavigation: { screen?: string } | undefined;
  WelcomePage: undefined;
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Settings: FC<MainTabActivityScreenProps> = (props) => {
    const userInfo = useSelector((store: any) => store.userInfo);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();

    const [language, setLanguage] = useState<any>('');
    const [username, setUsername] = useState<any>('');
    const [password, setPassword] = useState<any>('');
    const [url, setUrl] = useState<any>('');
    const [department, setDepartment] = useState<any>('');
    const [departmentList, setDepartmentList] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const [allowFingerprint, setAllowFingerprint] = useState(false);
    const [exportPDF, setExportPDF] = useState(false);
    const [scale, setScale] = useState('');
    const [showQrScanner, setShowQrScanner] = useState(false);

    useFocusEffect(
      useCallback(() => {
        setPassword('');
        setDepartment('');
        setLoading(false);
        initData();
      }, [])
    );

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
      setShowQrScanner(false);
    }, []);

    const initData = async () => {
      const url: string | null = await getUrlFromStorage();
      const lang: string | null = await getLangFromStorage();
      const scale: string | null = await getScaleFromStorage();
      const exportPDF: string | null = await getExportPDFFromStorage();
      const allowFingerprint: string | null = await getAllowFingerprintFromStorage();

      if (allowFingerprint) {
        setAllowFingerprint(allowFingerprint === 'true');
      } else {
        setAllowFingerprint(false);
      }

      if (exportPDF) {
        setExportPDF(exportPDF === 'true');
      } else {
        setExportPDF(false);
      }

      if (scale) {
        setScale(scale);
      } else {
        setScale(SCALE_1280x720);
      }

      setUrl(url);
      setLanguage(lang);
      setUsername(userInfo?.account?.login);

      try {
          const data = {
              uniqueKey: userInfo.uniqueKey,
              lang: lang,
              location: {
                imei: await getDeviceId(),
                latitude: location?.latitude,
                longitude: location?.longitude,
            }
          };
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_DEPARTMENT, data);
          initDepartmentList(response?.data?.departments);
      } catch (e) {
          console.log(e);
      }
    };

    const initDepartmentList = (data :any) => {
        let departmentList_: any = [];
        data?.map((item: any, index: number) => {
            const {departmentID, departmentName} = item;
            departmentList_.push({value: departmentID, label: departmentName});
        });
        setDepartmentList(departmentList_);
    };

    const doLogin = async () => {
        console.log('doLogin start');

        try {
            if(username == '' || password == '' || url == ''){
                toast('error', 'top', 'ERROR!', t('all_fields_are_required'));
            } else {
                setLoading(true);
                const dataToSend = {
                    pnToken: "",
                    callerName: getPlatform(),
                    callerVersion: Platform.OS === 'android' ? MOBILE_APP_VERSION_ANDROID : MOBILE_APP_VERSION_IOS,
                    depId: department,
                    lang: MOBILE_DEFAULT_LANG_KEY,
                    login: username,
                    password: MD5(password).toString(),
                    location: {
                        imei: await getDeviceId(),
                        latitude: location?.latitude,
                        longitude: location?.longitude,
                    }
                };

                //let url_ = "http://10.27.41.84:8888/dgs3g_web";
                let url_ = url;
                if(!url_.endsWith('/')){
                    url_ += '/';
                }

                const response = await axiosInstance.post(url_ + MOBILE_API_PATH_REST_AUTH_LOGIN, dataToSend);
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
                    await setDataToStorage(username, password, url_, MOBILE_DEFAULT_LANG_KEY);
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

    const chooseLanguage = async (lang: string) => {
      setLanguage(lang);
      await setLanguageToStorage(lang);
      console.log(lang, ' // lang');

      await i18n.changeLanguage(lang);

      navigation.replace(NAVIGATOR_STACK_SCREEN_DRAWER, {screen: 'Settings'});
    };

    const chooseScale = async (scale: string) => {
      setScale(scale);
      await setScaleToStorage(scale);
      if (!scale) {
        const time = setTimeout(async () => {
          setScale(SCALE_1280x720);
          await setScaleToStorage(SCALE_1280x720);
          toast('error', 'top', 'ERROR!', t('scale_required'));
        }, 300);
        return () => clearTimeout(time);
      }
    };

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
      <>
        <Header title="Settings" navigation={props.navigation} />
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
            <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
              <View>
                <Select
                    title={t('menu_item_language')}
                    defaultValue={language}
                    data={[
                      {label: t('language_english'), value: 'en'},
                      {label: t('language_french'), value: 'fr'},
                      {label: t('language_german'), value: 'de'},
                      {label: t('language_romanian'), value: 'ro'},
                    ]}
                    onSelected={(value) => {
                      chooseLanguage(value);
                    }}
                />
              </View>
              <View style={[Styles.devider, {marginHorizontal: 16}]}></View>
              <View style={Styles.mb_10}>
                  <InputOutlined
                    label={t('username')}
                    value={username}
                    onChange={(value) => {
                      setUsername(value);
                    }} />
              </View>
              <View style={Styles.mb_10}>
                  <InputOutlined
                    label={t('password')}
                    value={password}
                    secureTextEntry
                    onChange={(value) => {
                      setPassword(value);
                    }} />
              </View>
              <View style={Styles.mb_10}>
                  <InputOutlined
                    label={t('URL')}
                    value={url}
                    onChange={(value) => {
                      setUrl(value);
                    }} />
              </View>
              <View style={Styles.mb_10}>
                <Select
                    title={t('department')}
                    defaultValue={department}
                    data={departmentList}
                    onSelected={(value) => {
                      setDepartment(value);
                    }}
                />
              </View>

              <TouchableOpacity style={styles.button} onPress={doLogin}>
                    <Text style={styles.buttonText}>{t('connection')}</Text>
              </TouchableOpacity>
              <View style={styles.rowButtons}>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => scanQrCode()}>
                  <Text style={styles.secondaryButtonText}>{t('v2_scan')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => browsePdf()}>
                  <Text style={styles.secondaryButtonText}>{t('button_browse')}</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 30, marginTop: 30 }}>
                <View style={{ backgroundColor: '#ededed', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, color: '#222' }}>{t('fingerprint_on_off')}</Text>
                  <Switch
                    value={allowFingerprint}
                    onValueChange={(value) => {
                      setAllowFingerprint(value);
                      setAllowFingerprintToStorage(value ? 'true' : 'false');
                    }}
                    trackColor={{ false: '#d3e3e8', true: '#b3d6e3' }}
                    thumbColor={allowFingerprint ? '#379ec3' : '#b3d6e3'}
                  />
                </View>
                <View style={[Styles.devider, {marginHorizontal: 16}]}></View>
                <View style={{ backgroundColor: '#ededed', borderRadius: 20, padding: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ fontSize: 16, color: '#222' }}>{t('archive_only_as_pdf')}</Text>
                  <Switch
                    value={exportPDF}
                    onValueChange={(value) => {
                      setExportPDF(value);
                      setExportPDFToStorage(value ? 'true' : 'false');
                    }}
                    trackColor={{ false: '#d3e3e8', true: '#b3d6e3' }}
                    thumbColor={exportPDF ? '#379ec3' : '#b3d6e3'}
                  />
                </View>
                <View style={{ marginTop: 10 }}>
                  <Select
                    title={t('scale')}
                    defaultValue={scale}
                    data={[
                      { label: SCALE_3200x2400, value: SCALE_3200x2400 },
                      { label: SCALE_3264x1836, value: SCALE_3264x1836 },
                      { label: SCALE_3200x1800, value: SCALE_3200x1800 },
                      { label: SCALE_2592x1944, value: SCALE_2592x1944 },
                      { label: SCALE_2048x1536, value: SCALE_2048x1536 },
                      { label: SCALE_1600x1200, value: SCALE_1600x1200 },
                      { label: SCALE_1440x1080, value: SCALE_1440x1080 },
                      { label: SCALE_1280x720, value: SCALE_1280x720 },
                      { label: SCALE_640x480, value: SCALE_640x480 },
                      { label: SCALE_320x240, value: SCALE_320x240 },
                    ]}
                    onSelected={(value) => {
                      chooseScale(value);
                    }}
                  />
                </View>
              </View>
              <Loading visible={loading} />
            </ScrollView>
          </View>
        }
        </View>
      </>
    );
};

export default Settings;
