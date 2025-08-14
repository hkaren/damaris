import React, {FC, useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import { MainTabActivityScreenProps} from '../../Interface';
import {
  Header,
} from '../../components';
import {useSelector} from "react-redux";
import { ActivityIndicator, FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import axiosInstance from '../../networking/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MANUAL_TASK_STATE_IDLE, MANUAL_TASK_STATE_IN_PROGRESS, MANUAL_TASK_STATE_PAUSE, MOBILE_API_PATH_REST_MANUAL_TASK, MOBILE_API_PATH_REST_TASK_CHANGE_STATE, PAGINATION_COUNT_20 } from '../../utils/AppConstants';
import { getDeviceId } from '../../utils/StaticMethods';
import * as Location from 'expo-location';
import { Button } from '../../components/Button';
import { Styles } from '../../core/Styles';
import { Loading } from '../../components/loading/Loading';
import { ManualTaskModal } from '../../components/modals/manualTaskModal';
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

const ManualTask: FC<MainTabActivityScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const userInfo = useSelector((store: any) => store.userInfo);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
    const [dataList, setDataList] = useState<any[]>([]);
    const [endScrollFlag, setEndScrollFlag] = useState<boolean>(true);
    const [scrollCounter, setScrollCounter] = useState<number>(1);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [originalDataList, setOriginalDataList] = useState<any[]>([]);
    const [selectedTask, setSelectedTask] = useState<any>({});
    const [openTask, setOpenTask] = useState<boolean>(false);
    const [manualTaskModalVisible, setManualTaskModalVisible] = useState<boolean>(false);

    useEffect(() => {
      setSearchText('');
      setLoading(false);
      setAllowServerCall(true);
      setDataList([]);
      setScrollCounter(1);
      setEndScrollFlag(false);
      setSelectedTask({});
      setOpenTask(false);
      setManualTaskModalVisible(false);
      initData(1, true);
    }, [route.params]);
    
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
          const lang = await getLang();
      })();
    }, []);

    const initData = async (scrollCounter: number, refresh: boolean) => {
      if (allowServerCall) {
        setAllowServerCall(false);
        setLoading(true);
        const url: string | null = await getUrl();
        const lang: string | null = await getLang();

        try {
            const data = {
              uniqueKey: userInfo.uniqueKey,
              lang: lang,
              pagination: {
                pageNumber: scrollCounter,
                pageSize: PAGINATION_COUNT_20
              },
              location: {
                imei: await getDeviceId(),
                latitude: location?.latitude,
                longitude: location?.longitude,
              }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_MANUAL_TASK, data);
            const resultData = response.data.tasks;
            
            if (resultData) {
                if (scrollCounter == 1) {
                    setDataList(resultData);
                    setOriginalDataList(resultData); // Save original data
                } else {
                    setDataList([...dataList, ...resultData]);
                    setOriginalDataList([...originalDataList, ...resultData]); // Save original data
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

    const _renderPage = ({item, index}: { item: any, index: number }) => {    
      return (
        <View style={styles.tableRow}>
          <TouchableOpacity style={styles.tableCell} onPress={() => chooseItem(item)}>
            <Text style={styles.tableCellText}>{item.manualTaskName}</Text>
          </TouchableOpacity>
          <Text style={styles.tableCell}>{item.bsProjectCode}</Text>
          <Text style={styles.tableCell}>{item.status}</Text>
        </View>
      )
    };
    
    const chooseItem = (item: any) => {
      console.log(item, ' // item');
      setSelectedTask(item);
      setOpenTask(true);
    };

    const doSearch = () => {
      if (!searchText) {
        setDataList(originalDataList); // Reset to original data if search is cleared
        return;
      }
      const filtered = originalDataList.filter(item =>
        (item.manualTaskName && item.manualTaskName.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.bsProjectCode && item.bsProjectCode.toLowerCase().includes(searchText.toLowerCase())) ||
        (item.status && item.status.toLowerCase().includes(searchText.toLowerCase()))
      );
      setDataList(filtered);
    };

    const changeStatus = async (status: number) => {
      console.log('changeStatus', status);
      if(status == 2){
        setManualTaskModalVisible(true);
      } else {
        if (allowServerCall) {
          setAllowServerCall(false);
          setLoading(true);
          const url: string | null = await getUrl();
          const lang: string | null = await getLang();

          try {
            const data = {
              uniqueKey: userInfo.uniqueKey,
              lang: lang,
              manualTaskID: selectedTask.manualTaskID,
              state: status,
              unit: 0,
              comment: '',
              location: {
                imei: await getDeviceId(),
                latitude: location?.latitude,
                longitude: location?.longitude,
              }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_TASK_CHANGE_STATE, data);
            setSelectedTask(response.data.tasks[0]);
            
            setAllowServerCall(true);
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
      }
    };

    const _renderOpenTask = () => {
      console.log(selectedTask.state, ' // selectedTask');

      let startBtn: boolean = false;
      let finishBtn: boolean = false;
      let pauseBtn: boolean = false;
      let resumeBtn: boolean = false;
      let resetBtn: boolean = false;

      if (selectedTask.state == MANUAL_TASK_STATE_IDLE && selectedTask.canUseTask && selectedTask.canStartTask) {
        startBtn = true;
      } else if (selectedTask.state == MANUAL_TASK_STATE_IN_PROGRESS) {
        if (selectedTask.canUseTask && selectedTask.canStopTask) {
          finishBtn = true;
        }
        if (selectedTask.canUseTask2 && selectedTask.canPauseTask) {
          pauseBtn = true;
        }
        if (selectedTask.canResetTask) {
          resetBtn = true;
        }
      } else if (selectedTask.state == MANUAL_TASK_STATE_PAUSE) {
        if(selectedTask.canUseTask && selectedTask.canStopTask){
          finishBtn = true;
        }
        if(selectedTask.canUseTask2 && selectedTask.canRestartTask){
          resumeBtn = true;
        }
        if(selectedTask.canResetTask){
          resetBtn = true;
        }
      }

      return (
        <View style={styles.openTaskContainer}>
          <Text style={styles.openTaskText}><Text style={styles.openTaskTitle}>{t('label_name')}: </Text> {selectedTask.manualTaskName}</Text>
          <Text style={styles.openTaskText}><Text style={styles.openTaskTitle}>{t('label_code')}: </Text> {selectedTask.bsProjectCode}</Text>
          <Text style={styles.openTaskText}><Text style={styles.openTaskTitle}>{t('label_status')}: </Text> {selectedTask.status}</Text>

          <View style={{flexDirection: 'column', marginTop: 50, gap: 10}}>
            { startBtn ?
              <View style={{flexDirection: 'row'}}>
                <Button variant="general" title={t('label_start')} onClickHandler={() => changeStatus(1)} />
              </View>
              : null
            }
            { finishBtn ?
              <View style={{flexDirection: 'row'}}>
                <Button variant="general" title={t('label_finish')} onClickHandler={() => changeStatus(2)} />
              </View>
              : null
            }
            { pauseBtn ?
              <View style={{flexDirection: 'row'}}>
                <Button variant="general" title={t('label_pause')} onClickHandler={() => changeStatus(3)} />
              </View>
              : null
            }
            { resumeBtn ?
              <View style={{flexDirection: 'row'}}>
                <Button variant="general" title={t('label_resume')} onClickHandler={() => changeStatus(4)} />
              </View>
              : null
            }
            { resetBtn ?
              <View style={{flexDirection: 'row'}}>
                <Button variant="general" title={t('label_reset')} onClickHandler={() => changeStatus(5)} />
              </View>
              : null
            }
          </View>
        </View>
      )
    };
    
    return (
      <View style={styles.container}>
        <Header title={t('menu_item_manual_task')} navigation={navigation} hideMoreIcon={openTask} />
        { openTask ?
          _renderOpenTask()
          :
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={t('advanced_search_field_btn_search')}
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity style={styles.searchButton} onPress={() => doSearch()}>
                <Ionicons name="search" size={24} color="#6B7A8F" />
              </TouchableOpacity>
            </View>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>{t('label_name')}</Text>
              <Text style={styles.tableHeaderText}>{t('label_code')}</Text>
              <Text style={styles.tableHeaderText}>{t('label_status')}</Text>
            </View>

            {/* Table Row */}
            {dataList?.length > 0 &&
                <FlatList refreshControl={<RefreshControl colors={["#9Bd35A", "#689F38"]} refreshing={refreshing}
                                            onRefresh={() => {
                                                reInitPages();
                                            }}/>}
                        data={dataList}
                        renderItem={_renderPage}
                        keyExtractor={(item) => item?.manualTaskID}
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
          </>
        }
        <ManualTaskModal
          isVisible={manualTaskModalVisible}
          showHideInfo={() => setManualTaskModalVisible(false)}
          manualTaskID={selectedTask.manualTaskID}
          finishCallback={(taskItem: any) => {
            setManualTaskModalVisible(false);
            setSelectedTask(taskItem);
          }}
        />
        
        <Fab navigation={navigation} />
        <Loading visible={loading} />
      </View>
    );
  };
  
  export default ManualTask;