import React, {FC, useCallback, useEffect, useState} from 'react';

import { MainTabActivityScreenProps} from '../../Interface';

import {
  Header,
} from '../../components';
import {useSelector} from "react-redux";
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../core/Styles';
import { InputOutlined } from '../../components/core/InputOutlined';
import { ScrollView } from 'react-native-gesture-handler';
import axiosInstance from '../../networking/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOBILE_API_PATH_REST_GENERATE_SECURITY_TOKEN, RESPONSE_CODE_ERROR_INTERNAL_ERROR, RESPONSE_CODE_SUCCESS } from '../../utils/AppConstants';
import { toast } from '../../utils/StaticMethods';
import { useFocusEffect } from '@react-navigation/native';
import { Fab } from '../../components/fab';

const getUrlFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("url");
  } catch (error) {
      console.log(error);
      return null;
  }
};

const GenerateToken: FC<MainTabActivityScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const userInfo = useSelector((store: any) => store.userInfo);
    const [token, setToken] = useState('');
    const [tokenGenerated, setTokenGenerated] = useState<boolean>(false);

    useEffect(() => {
      setToken('')
      setTokenGenerated(false);
    }, [route.params]);
    
    const generateToken = async () => {
      const url: string | null = await getUrlFromStorage();
      try {
        const data = {
            uniqueKey: userInfo.uniqueKey,
            securityPhrase: token
        };
        const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GENERATE_SECURITY_TOKEN, data);
        console.log(response.data.result.code, ' // response');
        if (response?.data?.result?.code === RESPONSE_CODE_SUCCESS) {
          setTokenGenerated(true);
          setToken(response?.data?.token);
        } else if (response?.data?.result?.code === RESPONSE_CODE_ERROR_INTERNAL_ERROR  ) {
          toast('error', 'top', 'ERROR!', t('internal_error'));
        } else {
          toast('error', 'top', 'ERROR!', t('error_occurred_process'));
        }
      } catch (e) {
          console.log(e);
      }
    };

    return (
      <View style={styles.container}>
        <Header title={t('fragment_about_us_title')} navigation={navigation} />
        <ScrollView automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
          {!tokenGenerated ? (
            <View style={Styles.pd_20}>
              <View style={Styles.mb_10}>
                  <InputOutlined
                  label={t('input_phrase')}
                  value={token}
                  onChange={(value) => {
                    setToken(value);
                  }} />
              </View>
              <TouchableOpacity style={Styles.button} onPress={generateToken}>
                    <Text style={Styles.buttonText}>{t('menu_item_generate_token')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={Styles.pd_20}>
              <Text style={styles.text_description}>{t('generate_token_res_title')}</Text>
              <Text style={styles.text_code}>{token}</Text>
            </View>
          )}
        </ScrollView>
        
        <Fab navigation={navigation} />
      </View>
    );
  };
  
  export default GenerateToken;