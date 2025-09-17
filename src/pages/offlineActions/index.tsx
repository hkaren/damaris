import React, {FC, useEffect, useState} from 'react';
import { MainTabActivityScreenProps} from '../../Interface';
import { Header } from '../../components';
import {useSelector} from "react-redux";
import { Modal, Text, View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OFF_MODE_ACTION_STATUS_DONE, OFF_MODE_ACTION_STATUS_FAILED, OFF_MODE_ACTION_STATUS_PENDING, OFF_MODE_ACTION_STATUS_PROGRESS, OFF_MODE_ACTION_STATUS_STOPPED } from '../../utils/AppConstants';
import { Checkbox } from '../../components/core/Checkbox';
import { Fab } from '../../components/fab';

const OfflineActions: FC<MainTabActivityScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation();
    const userInfo = useSelector((store: any) => store.userInfo);
    const [offlineActionsList, setOfflineActionsList] = useState<any[]>([]);
    const [filterData, setFilterData] = useState<any>({});

    useEffect(() => {
      setFilterData({});
      setOfflineActionsList([]);
      initOfflineActions();      
    }, [route.params]);

    const initOfflineActions = async () => {
        let offlineActionsList_: any[] = [];

        let storageKey = 'offlineActions_receiveFile_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'receiveFile', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_receive_file'),
                };
                offlineActionsList_.push(data);
              }
            }
        }
    
        storageKey = 'offlineActions_receiveBox_' + userInfo.uniqueKey;
        existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'receiveBox', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_receive_box'),
                };
                offlineActionsList_.push(data);
              }
            }
        }
    
        storageKey = 'offlineActions_localizeFile_' + userInfo.uniqueKey;
        existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'localizeFile', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_localize_file'),
                };
                offlineActionsList_.push(data);
              }
            }
        }
    
        storageKey = 'offlineActions_localizeBox_' + userInfo.uniqueKey;
        existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'localizeBox', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_localize_box'),
                };
                offlineActionsList_.push(data);
              }
            }
        }
    
        storageKey = 'offlineActions_reLocalizeFile_' + userInfo.uniqueKey;
        existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'reLocalizeFile', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_reLocalize_file'),
                };
                offlineActionsList_.push(data);
              }
            }
        }
    
        storageKey = 'offlineActions_reLocalizeBox_' + userInfo.uniqueKey;
        existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
              for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    type: 'reLocalizeBox', 
                    code: action.code,
                    storageAddress: action.storageAddress,
                    action: action.action,
                    status: action.status,
                    actionTxt: t('off_mode_action_reLocalize_box'),
                };
                offlineActionsList_.push(data);
              }
            }
        }

        setOfflineActionsList(offlineActionsList_);
    };

    const onChangeData = (type:string, key: string, value: string) => {
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
      } else {
          setFilterData({...filterData, ...{[key]: [value]}});
      }  
    };
    
    const deleteCallback = async () => {
      if(filterData && filterData.receiveFile && filterData.receiveFile.length > 0){
        let storageKey = 'offlineActions_receiveFile_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.receiveFile.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      } else if(filterData && filterData.receiveBox && filterData.receiveBox.length > 0){
        let storageKey = 'offlineActions_receiveBox_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.receiveBox.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      } else if(filterData && filterData.localizeFile && filterData.localizeFile.length > 0){
        let storageKey = 'offlineActions_localizeFile_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.localizeFile.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      } else if(filterData && filterData.localizeBox && filterData.localizeBox.length > 0){
        let storageKey = 'offlineActions_localizeBox_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.localizeBox.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      } else if(filterData && filterData.reLocalizeFile && filterData.reLocalizeFile.length > 0){
        let storageKey = 'offlineActions_reLocalizeFile_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.reLocalizeFile.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      } else if(filterData && filterData.reLocalizeBox && filterData.reLocalizeBox.length > 0){
        let storageKey = 'offlineActions_reLocalizeBox_' + userInfo.uniqueKey;
        let existingData = await AsyncStorage.getItem(storageKey);
        if(existingData) {
            let offlineActions = JSON.parse(existingData);
            if(offlineActions.length > 0) {
                for(let i = 0; i < offlineActions.length; i++) {
                    const action = offlineActions[i];
                    if(filterData.reLocalizeBox.some((item_: any) => item_ == action.code)){
                        offlineActions.splice(i, 1); // Remove the action object from the array
                        i--; // Adjust index after removal
                    }
                }
                // Save updated array back to AsyncStorage
                await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
            }
        }
      }

      initOfflineActions();
    };
    
    const cleanupCallback = async () => {
        await AsyncStorage.removeItem('offlineActions_receiveFile_' + userInfo.uniqueKey);
        await AsyncStorage.removeItem('offlineActions_receiveBox_' + userInfo.uniqueKey);
        await AsyncStorage.removeItem('offlineActions_localizeFile_' + userInfo.uniqueKey);
        await AsyncStorage.removeItem('offlineActions_localizeBox_' + userInfo.uniqueKey);
        await AsyncStorage.removeItem('offlineActions_reLocalizeFile_' + userInfo.uniqueKey);
        await AsyncStorage.removeItem('offlineActions_reLocalizeBox_' + userInfo.uniqueKey);
        initOfflineActions();
    };

    const _renderRows = () => {
        return offlineActionsList.map((item, index) => {
            let statusTxt = '';
            let statusColor = '';

            if(item.status == OFF_MODE_ACTION_STATUS_PENDING) {
                statusTxt = t('pending');
                statusColor = 'black';
            } else if(item.status == OFF_MODE_ACTION_STATUS_PROGRESS) {
                statusTxt = t('in_progress');
                statusColor = 'blue';
            } else if(item.status == OFF_MODE_ACTION_STATUS_FAILED) {
                statusTxt = t('failed');
                statusColor = 'red';
            } else if(item.status == OFF_MODE_ACTION_STATUS_DONE) {
                statusTxt = t('done');
                statusColor = 'green';
            } else if(item.status == OFF_MODE_ACTION_STATUS_STOPPED) {
                statusTxt = t('stopped');
                statusColor = 'red';
            }

            return (
              <View key={index} style={styles.tableRow}>
                <Checkbox
                    key={index+'_'}
                    label={''}
                    selected={filterData[item.type]?.some((item_: any) => item_ == item.code)}
                    onSelect={() => onChangeData('multi', item.type, item.code)}
                    containerStyle={[]}
                    touchableStyle={[{width: 35, height: 25, alignItems: 'flex-start'}]}
                />
                <Text style={styles.tableRowText}>{item.code}</Text>
                <Text style={styles.tableRowText}>{item.actionTxt}</Text>
                <Text style={[styles.tableRowText, {color: statusColor}]}>{statusTxt}</Text>
              </View>
            );
        });
    };
    
    return (
      <View style={styles.container}>
        <Header 
          title={t('menu_item_offline_actions')} 
          navigation={navigation} 
          type='offline_actions' 
          callBackFunction={(e: any) => {
            if(e == 'delete'){
                deleteCallback();
            } else if(e == 'cleanup'){
                cleanupCallback();
            }
          }}
        />
        
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={{width: 20}}></Text>
          <Text style={styles.tableHeaderText}>{t('label_box_file')}</Text>
          <Text style={styles.tableHeaderText}>{t('label_action')}</Text>
          <Text style={styles.tableHeaderText}>{t('label_status')}</Text>
        </View>

        {/* Table Row */}
        { _renderRows() }

        {/* Floating button */}
        <Fab navigation={navigation} />
      </View>
    );
};
  
export default OfflineActions;