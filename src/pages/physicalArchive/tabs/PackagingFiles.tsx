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
import { MOBILE_API_PATH_REST_BOX_TYPE_LIST, MOBILE_API_PATH_REST_PACKAGING, RESPONSE_CODE_ERROR_ARCHIVE_NOT_FOUND, RESPONSE_CODE_ERROR_BOX_TYPE_NOT_FOUND, RESPONSE_CODE_ERROR_DESTINATION_ORIGIN_STORAGE, RESPONSE_CODE_ERROR_INTERNAL_ERROR, RESPONSE_CODE_SUCCESS } from '../../../utils/AppConstants';
import * as Location from 'expo-location';
import { Select } from '../../../components/core/Select';
import { Loading } from '../../../components/loading/Loading';

interface PackagingFilesProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
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

const PackagingFiles = (props: PackagingFilesProps) => {
  const { t } = useTranslation();
  const userInfo = useSelector((store: any) => store.userInfo);
  const [code, setCode] = useState('');
  const [destinationBoxCode, setDestinationBoxCode] = useState('');
  const [boxTypeID, setBoxTypeID] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [boxTypeList, setBoxTypeList] = useState<any>([]);
  const [loading, setLoading] = useState(false);

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

    initBoxType();
  }, []);

  useEffect(() => {
    setCode('');
    setDestinationBoxCode('');
    setBoxTypeID('');
  }, [props.route.params]);

  const initBoxType = async () => {
    const url: string | null = await getUrlFromStorage();
    let lang: string | null = await getLang();

    try {
      const data = {
        uniqueKey: userInfo.uniqueKey,
        boxCode: '',
        prefix: ''
      };
      const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_BOX_TYPE_LIST, data);

      if(response?.data?.result?.code == RESPONSE_CODE_SUCCESS){
        let count: number = Number(response?.data?.count);
        if(count > 0){
          initBoxTypeList(response?.data?.boxTypes);
        } else {
          toast('error', 'top', 'ERROR!', t('fragment_packaging_box_type_error_2'));
        }
      } else {
        toast('error', 'top', 'ERROR!', t('fragment_packaging_box_type_error_1'));
      }
    } catch (e) {
        console.log(e);
    }
  };

  const initBoxTypeList = (boxTypes: any) => {
    let boxTypeList_: any = [];
    boxTypes?.map((item: any, index: number) => {
        const {boxTypeID, boxTypeName} = item;
        boxTypeList_.push({value: boxTypeID, label: boxTypeName});
    });
    setBoxTypeList(boxTypeList_);
  };

  const openScanner = () => {
    Keyboard.dismiss();
    console.log('openScanner');    
  };

  const sendAction = async () => {
    const url: string | null = await getUrlFromStorage();
    let lang: string | null = await getLang();

    try {
      setLoading(true);
      const data = {
        uniqueKey: userInfo.uniqueKey,
        lang: lang,
        box: false,
        fileOrBoxCode: code,
        destinationBoxCode: destinationBoxCode,
        boxTypeID: boxTypeID,
        location: {
            imei: await getDeviceId(),
            latitude: location?.latitude,
            longitude: location?.longitude,
        }
      };
      const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_PACKAGING, data);
      if(response?.data?.code == RESPONSE_CODE_SUCCESS){
        setCode('');
        setDestinationBoxCode('');
        setBoxTypeID('');
        toast('success', 'top', 'SUCCESS!', t('fragment_packaging_file_success'));
      } else if(response?.data?.code == RESPONSE_CODE_ERROR_BOX_TYPE_NOT_FOUND){
        toast('error', 'top', 'ERROR!', t('fragment_packaging_file_error_4'));
      } else if(response?.data?.code == RESPONSE_CODE_ERROR_DESTINATION_ORIGIN_STORAGE){
        toast('error', 'top', 'ERROR!', t('fragment_packaging_error_7'));
      } else if(response?.data?.code == RESPONSE_CODE_ERROR_ARCHIVE_NOT_FOUND){
        toast('error', 'top', 'ERROR!', t('fragment_packaging_error_8'));
      } else if(response?.data?.code == RESPONSE_CODE_ERROR_INTERNAL_ERROR){
        toast('error', 'top', 'ERROR!', t('internal_error'));
      } else {
        toast('error', 'top', 'ERROR!', t('fragment_packaging_file_error_1'));
      }
      setLoading(false);
    } catch (e) {
        console.log(e);
        setLoading(false);
    }
  };

  const chooseBoxType = async (id: string) => {
    setBoxTypeID(id);
  };

  return (
    <View style={styles.tabContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
      <View style={Styles.mb_10}>
            <InputOutlined
              label={t('hint_enter_source_file_code')}
              value={code}
              onChange={(value) => {
                setCode(value);
              }}
              rightIcon={<TextInput.Icon icon="qrcode-scan" onPress={() => openScanner()} />}
            />
        </View>
        <View style={Styles.mb_10}>
            <InputOutlined
              label={t('hint_enter_destination_box_code')}
              value={destinationBoxCode}
              onChange={(value) => {
                setDestinationBoxCode(value);
              }}
              rightIcon={<TextInput.Icon icon="qrcode-scan" onPress={() => openScanner()} />}
            />
        </View>
        <View style={Styles.mb_10}>
          <Select
              title={t('boxType')}
              defaultValue={boxTypeID}
              data={boxTypeList}
              onSelected={(value) => {
                chooseBoxType(value);
              }}
          />
        </View>
        <View>
          <Button variant="general" title={t('fragment_packaging_file_title')} onClickHandler={() => sendAction()} />
        </View>
      </ScrollView>
      <Loading visible={loading} />
    </View>
  );
};

export default PackagingFiles;