import React, {FC, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import styles from './styles';
import { Header } from '../../components';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../components/loading/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { PAGINATION_COUNT_20 } from '../../utils/AppConstants';
import { auth, db, database } from '../../configs/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { isValidEmail } from '../../utils/StaticMethods';
import { MD5 } from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ref, get } from 'firebase/database';

const getPassword = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("password");
  } catch (error) {
      console.log(error);
      return null;
  }
};

interface User {
  id: string;
  name: string;
  surname: string;
  image: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

type ChatProps = {
    navigation: any;
    route: RouteProp<Record<string, any>, string>;
};

export const Chat: FC<ChatProps> = (props: ChatProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userInfo = useSelector((store: any) => store.userInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
    const [reloadKey, setReloadKey] = useState(0);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [endScrollFlag, setEndScrollFlag] = useState<boolean>(true);
    const [scrollCounter, setScrollCounter] = useState<number>(1);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [dataList, setDataList] = useState<any[]>([]);

    useEffect(() => {
      setLoading(false);
      setScrollCounter(1);
      setAllowServerCall(true);
      setDataList([]);
      setScrollCounter(1);
      setEndScrollFlag(false);
      initData(1, true);
    }, [props.route.params?.randomKey, reloadKey]);

    const getEmail = (username: string, uniqueDbKey: string, email: string) => {
      if(isValidEmail(username)){
          return uniqueDbKey+"__"+username;
      } else {
          return username+"__"+uniqueDbKey+"__"+email;
      }
    }

    const initData = async (scrollCounter: number, refresh: boolean) => {
      if (allowServerCall) {
          setAllowServerCall(false);
          setLoading(true);
          
        try {
            const email = getEmail(userInfo.account.login, userInfo.uniqueDBKey, userInfo.account.email);
          const password: string | null = await getPassword();
          console.log(email, password, ' // email');
          
          const userCred = await signInWithEmailAndPassword(auth, email, MD5(password || '').toString());
          console.log('Signed in:', userCred.user.uid);
          // Store the user's UID in userInfo for chat functionality
          dispatch({
            type: 'SET_CUSTOMER',
            payload: {
              ...userInfo,
              firebase_uid: userCred.user.uid
            }
          });

          const user = auth.currentUser;
          if (!user) {
            console.warn('User not logged in');
            return;
          }

          const usersRef = ref(database, `chat__${userInfo.uniqueDBKey}/users/companies/${userInfo.account.companyName}`);
          const snapshot = await get(usersRef);

          let resultData: any[] = [];
          if (snapshot.exists()) {
            const usersData = snapshot.val();
            resultData = Object.keys(usersData).map(key => ({
              id: key,
              ...usersData[key],
            }));
            
          } else {
            console.log('No users found');
          }
          
            
          if (resultData) {
              if (scrollCounter == 1) {
                  setDataList(resultData);
              } else {
                  setDataList([...dataList, ...resultData]);
              }
          }
  
          setScrollCounter(scrollCounter+1);
          setAllowServerCall(true);
          setRefreshing(false)
          setLoading(false);

          if(resultData?.length == PAGINATION_COUNT_20){
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
            setEndScrollFlag(false);
            setAllowServerCall(true);
            setRefreshing(false);
        }
      }
    };

    const reInitPages = () => {
        setRefreshing(true)
        setScrollCounter(1);
        setAllowServerCall(true);
        initData(1, true);
    };

    const nextPagePages = () => {
      if(endScrollFlag && allowServerCall){
        initData(scrollCounter, false);
      }
    };

    const handleUserPress = (user: User) => {
        // Navigate to chat room with selected user
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            profileDrawerActiveTitle: user.name
          }
        });
        props.navigation.navigate('Room', {data: user});
    };
    const _renderUserItem = ({item, index}: { item: any, index: number }) => {    
      // Skip rendering if this is the current user's account
      if (item.id === userInfo.firebase_uid) {
        return null;
      }
      return (
        <TouchableOpacity 
            style={styles.userItem} 
            onPress={() => handleUserPress(item)}
        >
            <Text style={styles.userName}>{item.name} {item.surname}</Text>
        </TouchableOpacity>
      )
    };

    return (
      <>
        <Header title={t('word_chat')} navigation={props.navigation} hideMoreIcon={true} />
        <View style={styles.container}>
            <FlatList refreshControl={<RefreshControl colors={["#9Bd35A", "#689F38"]} refreshing={refreshing}
                                            onRefresh={() => {
                                                reInitPages();
                                            }}/>}
                data={dataList}
                renderItem={_renderUserItem}
                keyExtractor={(item) => item.id}
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
            <Loading visible={loading} />
        </View>
      </>
    );
};