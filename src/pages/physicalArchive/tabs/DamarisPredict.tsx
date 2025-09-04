import React, { useEffect, useState } from 'react';
import { Keyboard, ScrollView, Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import styles from '../styles';
import { Styles } from '../../../core/Styles';
import { InputOutlined } from '../../../components/core/InputOutlined';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOBILE_API_PATH_REST_PREDICT_BARCODE } from '../../../utils/AppConstants';
import axiosInstance from '../../../networking/api';
import { toast } from '../../../utils/StaticMethods';

const getUrlFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("url");
  } catch (error) {
      console.log(error);
      return null;
  }
};

interface DamarisPredictProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
  openScanner: (e: any) => void;
  qrCode: string
}

const DamarisPredict = (props: DamarisPredictProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const userInfo = useSelector((store: any) => store.userInfo);

  const [code, setCode] = useState('');
  
  useEffect(() => {
    setCode(props.qrCode);
  }, [props.route.params]);

  const sendAction = async () => {
    const url: string | null = await getUrlFromStorage();

    try {
      const data = {
        uniqueKey: userInfo.uniqueKey,
        barcode: code
      };
      const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_PREDICT_BARCODE, data);
      if (response?.data?.possibleActions) {
        let recordId: string = response?.data?.archiveID;
        let isArchive: boolean = false;

        if(recordId){
          isArchive = true;
        } else {
          recordId = response?.data?.declarationID;
        }

        props.navigation.navigate(
          'DamarisPredictActions', 
          { 
            randomKey: Math.random(), 
            actionType: 'nenu',
            data: {
              possibleActions: response?.data?.possibleActions,
              requestID: response?.data?.requestID,
              recordId: recordId,
              isArchive: isArchive,
              storAddrID: response?.data?.storAddrID,
              barcode: code
            }
          });
      } else {
        toast('error', 'top', 'ERROR!', t('no_actions_available'));
      }
    } catch (e) {
        console.log(e);
    }
  };

  return (
    <View style={styles.tabContainer}>
      <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
        <View style={Styles.mb_10}>
            <InputOutlined
              label={t('hint_enter_barcode')}
              value={code}
              onChange={(value) => {
                setCode(value);
              }}
              rightIcon={<TextInput.Icon icon="qrcode-scan" onPress={() => props.openScanner('dp')} />}
            />
        </View>
        <View>
          <Button variant="general" title={t('send_barcode')} onClickHandler={() => sendAction()} buttonCssClass={[{width: '100%'}]} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DamarisPredict;