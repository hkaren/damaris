import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import styles from '../styles';
import { Styles } from '../../../core/Styles';
import { InputOutlined } from '../../../components/core/InputOutlined';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { TextInput } from 'react-native-paper';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../networking/api';
import { getDeviceId, toast } from '../../../utils/StaticMethods';
import { MOBILE_API_PATH_REST_LOCALIZE, OFF_MODE_ACTION_STATUS_PENDING, RESPONSE_CODE_ERROR_FILE_BOX_CODE_NOT_FOUND, RESPONSE_CODE_ERROR_INCORRECT_STORAGE_FORMAT, RESPONSE_CODE_ERROR_INTERNAL_ERROR, RESPONSE_CODE_ERROR_NOT_ENOUGH_SPACE_IN_STORAGE, RESPONSE_CODE_ERROR_STORAGE_NOT_FOUND, RESPONSE_CODE_SUCCESS } from '../../../utils/AppConstants';
import * as Location from 'expo-location';
import { Loading } from '../../../components/loading/Loading';
import NetInfo from '@react-native-community/netinfo';

interface LocalizeBoxProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
  openScanner: (e: any) => void;
  qrCode: string;
  qrCodeStorageAddress: string
}

const getUrlFromStorage = async (): Promise<string | null> => {
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

const setOfflineDataIntoStorage = async (key: string, data: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem(key, data);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};

const LocalizeBox = (props: LocalizeBoxProps) => {
  const { t } = useTranslation();
  const userInfo = useSelector((store: any) => store.userInfo);
  const [code, setCode] = useState('');
  const [storageAddress, setStorageAddress] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

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

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setCode(props.qrCode);
    setStorageAddress(props.qrCodeStorageAddress);
  }, [props.route.params]);

  const sendAction = async () => {
    if (isConnected) {
      const url: string | null = await getUrlFromStorage();
      let lang: string | null = await getLang();

      try {
        setLoading(true);
        const data = {
          uniqueKey: userInfo.uniqueKey,
          lang: lang,
          box: true,
          fileOrBoxCode: code,
          storageCodeAddress: storageAddress,
          location: {
              imei: await getDeviceId(),
              latitude: location?.latitude,
              longitude: location?.longitude,
          }
        };
        const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_LOCALIZE, data);
        
        if(response?.data?.code == RESPONSE_CODE_SUCCESS){
          setCode('');
          setStorageAddress('');
          toast('success', 'top', 'SUCCESS!', t('fragment_localize_box_success'));
        } else if(response?.data?.code == RESPONSE_CODE_ERROR_FILE_BOX_CODE_NOT_FOUND){
          toast('error', 'top', 'ERROR!', t('fragment_localize_box_error_2'));
        } else if(response?.data?.code == RESPONSE_CODE_ERROR_INCORRECT_STORAGE_FORMAT || response?.data?.code == RESPONSE_CODE_ERROR_STORAGE_NOT_FOUND){
          toast('error', 'top', 'ERROR!', t('fragment_localize_box_error_3'));
        } else if(response?.data?.code == RESPONSE_CODE_ERROR_NOT_ENOUGH_SPACE_IN_STORAGE){
          toast('error', 'top', 'ERROR!', t('fragment_localize_box_error_5'));
        } else if(response?.data?.code == RESPONSE_CODE_ERROR_INTERNAL_ERROR){
          toast('error', 'top', 'ERROR!', t('internal_error'));
        } else {
          toast('error', 'top', 'ERROR!', t('fragment_localize_box_error_1'));
        }
        setLoading(false);
      } catch (e) {
          console.log(e);
          setLoading(false);
      }
    } else {
      // Get existing offline data or initialize empty array
      const existingData = await AsyncStorage.getItem('offlineActions_localizeBox_'+userInfo.uniqueKey);
      const offlineActions = existingData ? JSON.parse(existingData) : [];
      
      const offlineData = {
        code: code,
        status: OFF_MODE_ACTION_STATUS_PENDING,
        storageAddress: storageAddress,
        timestamp: new Date().toISOString(),
        // Add any other data you need to store
      };
      
      // Add new action to the array
      offlineActions.push(offlineData);
      
      // Save updated array back to storage
      await setOfflineDataIntoStorage('offlineActions_localizeBox_'+userInfo.uniqueKey, JSON.stringify(offlineActions));
      toast('info', 'top', 'SUCCESS!', t('fragment_localize_box_success'));
    }
  };

  return (
    <View style={styles.tabContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
      <View style={Styles.mb_10}>
            <InputOutlined
              label={t('hint_enter_box_code')}
              value={code}
              onChange={(value) => {
                setCode(value);
              }}
              rightIcon={<TextInput.Icon icon="qrcode-scan" onPress={() => props.openScanner('lb')} />}
            />
        </View>
        <View style={Styles.mb_10}>
            <InputOutlined
              label={t('hint_enter_storage_address')}
              value={storageAddress}
              onChange={(value) => {
                setStorageAddress(value);
              }}
              rightIcon={<TextInput.Icon icon="qrcode-scan" onPress={() => props.openScanner('lb_sa')} />}
            />
        </View>
        <View>
          <Button variant="general" title={t('fragment_localize_box_title')} onClickHandler={() => sendAction()} buttonCssClass={[{width: '100%'}]} />
        </View>
      </ScrollView>
      <Loading visible={loading} />
    </View>
  );
};

export default LocalizeBox;