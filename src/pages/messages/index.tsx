import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {  MOBILE_API_PATH_REST_GET_MESSAGES, MOBILE_API_PATH_REST_READ_MESSAGE, PAGINATION_COUNT_20 } from '../../utils/AppConstants';
import axiosInstance from '../../networking/api';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components';
import { Loading } from '../../components/loading/Loading';
import { NoDataFoundPage } from '../../components/core/NoDataFoundPage';
import { RouteProp } from '@react-navigation/native';
import HTML from 'react-native-render-html';
import { Styles } from '../../core/Styles';
import { getDeviceId } from '../../utils/StaticMethods';
import * as Location from 'expo-location';
import { Fab } from '../../components/fab';

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

interface MessagesProps {
  route: RouteProp<Record<string, any>, string>;
  navigation: any;
}

const Messages = (props: MessagesProps) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const dispatch = useDispatch();
  const userInfo = useSelector((store: any) => store.userInfo);
  const config = useSelector((store: any) => store.config);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [messagesListData, setMessagesListData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [endScrollFlag, setEndScrollFlag] = useState<boolean>(true);
  const [scrollCounter, setScrollCounter] = useState<number>(1);
  const [noDataFoundPage, setNoDataFoundPage] = useState(false);
  const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
  const [loadingTryAgain, setLoadingTryAgain] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  
  useEffect(() => {
    setLoading(true);
    setEndScrollFlag(false);
    setNoDataFoundPage(false);
    setAllowServerCall(true);
    setLoadingTryAgain(false);
    setMessagesListData([]);
    setScrollCounter(1);
    setSelectedMessage(null);
    initMessages(1, true);
  }, [props.route.params]);

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

  const reInitPages = () => {
      setRefreshing(true)
      setScrollCounter(1);
      setAllowServerCall(true);
      setLoadingTryAgain(true);
      initMessages(1, true);
  };

  const nextPagePages = () => {
    if(endScrollFlag && allowServerCall){
      initMessages(scrollCounter, false);
    }
  };

  const initMessages = async (scrollCounter: number, refresh: boolean) => {
    if (allowServerCall) {
      setAllowServerCall(false);
      const url: string | null = await getUrl();
      const lang: string | null = await getLang();
      try {
          const data = {
            uniqueKey: userInfo.uniqueKey,
            lang: lang,
            allMessages: props?.route?.params?.actionType == 'all-messages' ? true : false,
            pagination: {
              pageNumber: scrollCounter,
              pageSize: PAGINATION_COUNT_20
            }
          };
          console.log(url);
          
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_MESSAGES, data);
          const messages = response.data.messages;

          if (messages) {
              if (scrollCounter == 1) {
                  setNoDataFoundPage(false);
                  setMessagesListData(messages);
              } else {
                  setNoDataFoundPage(false);
                  setMessagesListData([...messagesListData, ...messages]);
              }

              if (messages.length == 0) {
                  setNoDataFoundPage(true);
              }
          } else {
              setNoDataFoundPage(true);
          }

          setScrollCounter(scrollCounter+1);
          setLoadingTryAgain(false);
          setAllowServerCall(true);
          setRefreshing(false)

          if(messages?.length == PAGINATION_COUNT_20){
              setEndScrollFlag(true);
          } else {
              setEndScrollFlag(false);
          }

          setTimeout(() => {
              setLoading(false);
          }, 500);
      } catch (e) {
          console.log(e);
          setLoading(false);
          setLoadingTryAgain(false);
          setEndScrollFlag(false);
          setAllowServerCall(true);
          setRefreshing(false)
          setNoDataFoundPage(true);
      }
    }
  };

  const chooseMessage = async (item: any) => {
    setSelectedMessage(item);
    
    const url: string | null = await getUrl();
    const lang: string | null = await getLang();
    
    const data = {
      uniqueKey: userInfo.uniqueKey,
      lang: lang,
      messageIDs: item.msgID,
      location: {
          imei: await getDeviceId(),
          latitude: location?.latitude,
          longitude: location?.longitude,
      }
    };
    const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_READ_MESSAGE, data);
  };

  const _renderPage = ({item, index}: { item: any, index: number }) => {    
    return (
        <TouchableOpacity activeOpacity={1} style={[styles.messageContainer]} onPress={() => chooseMessage(item)}>
          <Text style={[styles.title, item.isRead === 'true' ? Styles.fw_n : Styles.fw_b]}>{item.subject}</Text>
          <HTML 
              html={item.msgBody}
              containerStyle={styles.desc_cont}
              baseFontStyle={styles.desc_text}
              tagsStyles={{
                b: {
                  fontWeight: 'normal'
                },
                strong: {
                  fontWeight: 'normal'
                }
              }}
            />
          <View style={styles.divider}/>
        </TouchableOpacity>
    )
  };

  return (
    <View style={styles.container}>
      <Header title={t('fragment_about_us_title')} navigation={props.navigation} />
      { selectedMessage ?
        <View style={Styles.pd_20}>
          <Text style={[styles.title, Styles.fw_b]}>{selectedMessage.subject}</Text>
          <HTML 
              html={selectedMessage.msgBody}
              baseFontStyle={styles.desc_text}
              tagsStyles={{
                b: {
                  fontWeight: 'normal'
                },
                strong: {
                  fontWeight: 'normal'
                }
              }}
            />
        </View>
      :
      <>
        {messagesListData?.length > 0 &&
            <FlatList refreshControl={<RefreshControl colors={["#9Bd35A", "#689F38"]} refreshing={refreshing}
                                        onRefresh={() => {
                                            reInitPages();
                                        }}/>}
                    data={messagesListData}
                    renderItem={_renderPage}
                    keyExtractor={(item) => item?.msgID}
                    showsVerticalScrollIndicator={false}
                    onEndReachedThreshold={0.2}
                    onEndReached={() => nextPagePages()}
                    ItemSeparatorComponent={() => null}
                    ListFooterComponent={endScrollFlag ? <View><ActivityIndicator
                    style={{paddingBottom: 15, backgroundColor: 'white'}}
                    size={'large'}
                    color={'#000000'}
                    /></View> : null}
                />
        }
        { noDataFoundPage ?
            <NoDataFoundPage reInitHandler={() => reInitPages()} state={loadingTryAgain} />
            : null
        }
      </>
      }

      <Fab navigation={props.navigation} />
      <Loading visible={loading} transparent={false}/>
    </View>
  );
};

export default Messages;