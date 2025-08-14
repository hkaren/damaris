import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import styles from './styles';
import ImagesPath from '../../utils/ImagesPath';
import { MD5 } from "crypto-js";
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDeviceId, getPlatform, toast } from '../../utils/StaticMethods';
import { MOBILE_API_PATH_REST, MOBILE_API_PATH_REST_AUTH_LOGIN, MOBILE_API_PATH_REST_MESSAGE_RECEIVERS_LIST, MOBILE_API_PATH_REST_SEND_MESSAGE, MOBILE_APP_VERSION, MOBILE_DEFAULT_LANG_KEY, NAVIGATOR_STACK_SCREEN_HOME, NAVIGATOR_STACK_SCREEN_WELCOME, RESPONSE_CODE_SUCCESS } from '../../utils/AppConstants';
import axiosInstance from '../../networking/api';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components';
import { InputOutlined } from '../../components/core/InputOutlined';
import { Styles } from '../../core/Styles';
import { Button } from '../../components/Button';
import { UsersListModal } from '../../components/modals/usersListModal';
import { RouteProp } from '@react-navigation/native';
import { Loading } from '../../components/loading/Loading';

interface User {
  userID: string;
  firstName: string;
  lastName: string;
}

interface MessagesNewProps {
  navigation: any;
}

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

interface MessagesNewProps {
  route: RouteProp<Record<string, any>, string>;
  navigation: any;
}

const MessagesNew = (props: MessagesNewProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((store: any) => store.userInfo);
  const config = useSelector((store: any) => store.config);

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [usersModalVisible, setUsersModalVisible] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [filterData, setFilterData] = useState<any>({});
  const [selectedNames, setSelectedNames] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setUsersModalVisible(false);
    setUsersList([]);
    setFilterData({});
    setSelectedNames(t('send_to'));
    setLoading(false);
  }, [props.route.params]);
  
  const openUsersModal = async () => {
    const url: string | null = await getUrl();

    const data = {
      uniqueKey: userInfo.uniqueKey,
    };
    const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_MESSAGE_RECEIVERS_LIST, data);
    
    setUsersList(response?.data?.users);
    setUsersModalVisible(true);
  };

  const onChangeDataCallback = (type:string, key: string, value: string) => {
      if(filterData[key]?.length && type == 'multi'){
          let insertData = filterData;
          let arr = insertData[key];
          let findIndex = arr.findIndex((item: string) => item === value);
          if(findIndex !== -1){
              insertData[key].splice(findIndex, 1);
          }else{
              insertData[key].push(value);
          }
          setFilterData({...filterData, ...insertData});

          const selectedNames = usersList
          .filter((item: any) => insertData['users']?.includes(item.userID))
          .map((item: any) => item.firstName + ' ' + item.lastName)
          .join('; '); // or use ' ' for space only

          setSelectedNames(selectedNames ? selectedNames : t('send_to'));
      } else {
          setFilterData({...filterData, ...{[key]: [value]}});
          
          const item = usersList.find((item: any) => item.userID === value);
          setSelectedNames(item?.firstName + ' ' + item?.lastName);
      }  
  };

  const sendMessage = async () => {
    const url: string | null = await getUrl();
    let lang: string | null = await getLang();
    console.log(' ///////////// ', filterData);
    if(subject == '' || body == '' || filterData == null || filterData['users'] == null || filterData['users'].length == 0){
      toast('error', 'top', 'ERROR!', t('all_fields_are_required'));
    } else {
      try {
          setLoading(true);
          let receivers = "";
          for (const receiver of filterData['users']) {
            if (receivers === "") {
              receivers = receiver;
            } else {
              receivers += "-" + receiver;
            }
          }

          const data = {
            uniqueKey: userInfo.uniqueKey,
            lang: lang,
            toUsers: receivers,
            subject: subject,
            body: body,
            location: {
              imei: await getDeviceId(),
              latitude: location?.latitude,
              longitude: location?.longitude,
            }
          };
          await axiosInstance.post(url + MOBILE_API_PATH_REST_SEND_MESSAGE, data);

          setSubject('');
          setBody('');
          setFilterData({});
          setSelectedNames(t('send_to'));
          setLoading(false);
      } catch (e) {
          console.log(e);
          setLoading(false)
      }
    }
  };

  return (
    <>
      <Header title="Messages" navigation={props.navigation} />
      <View style={styles.container}>
        

        {/* <View style={styles.sendToBox}>
          <Text style={localstylesStyles.sendToText}>Send to</Text>
        </View> */}
        <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
          <View style={Styles.mb_20}>
              <Button 
                variant="general"
                title={selectedNames}
                buttonCssClass={[{textAlign: 'left', justifyContent: 'flex-start'}]} 
                textCssClass={[Styles.fw_n, Styles.fs_14]}
                onClickHandler={() => openUsersModal()} />
          </View>

          <View style={Styles.mb_10}>
              <InputOutlined
                label={t('subject')}
                value={subject}
                onChange={(value) => {
                  setSubject(value);
                }} />
          </View>

          <View style={Styles.mb_20}>
              <InputOutlined
                  label="Comment *"
                  value={body}
                  multiline
                  fieldCss={[styles.comment]}
                  onChange={(value) => {
                      setBody(value)
                  }} />
          </View>
          <View style={Styles.mb_20}>
              <Button variant="general" title={t('send')} onClickHandler={() => sendMessage()} />
          </View>

          {/* <TouchableOpacity style={styles.fab}>
            <Text style={styles.fabPlus}>+</Text>
          </TouchableOpacity> */}
        </ScrollView>

        {usersModalVisible ?
            <UsersListModal
                onClose={() => {
                    setUsersModalVisible(false)
                }}
                visible={usersModalVisible}
                usersList={usersList}
                filterData={filterData}
                onChangeData={(type: string, key: string, value: string) => {
                  onChangeDataCallback(type, key, value);
                }}
            />
            :
            null
        }
        <Loading visible={loading} />
      </View>
    </>
  );
};

export default MessagesNew;