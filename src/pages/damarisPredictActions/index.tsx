import React, {FC, useEffect, useState, useCallback} from 'react';

import { MainTabActivityScreenProps} from '../../Interface';

import {
  Header,
} from '../../components';
import {useDispatch, useSelector} from "react-redux";
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { RouteProp } from '@react-navigation/native';
import { ACTION_CHECK_IN, ACTION_CHECK_OUT, ACTION_DECLARE_BOX, ACTION_DECLARE_FILE, ACTION_LOCALIZE_BOX, ACTION_LOCALIZE_FILE, ACTION_PACKAGING_BOX, ACTION_PACKAGING_FILE, ACTION_PUT_ON_PLACE, ACTION_RECEIVE_BOX, ACTION_RECEIVE_FILE, ACTION_RELOCALIZE_BOX, ACTION_RELOCALIZE_FILE, ACTION_SHOW_ADDRESS_CONTENT, ACTION_SHOW_ADDRESS_INFO, ACTION_SHOW_BOX_CONTENT, ACTION_VALIDATE_REQUEST, ACTION_VIEW_FILE_INFO, MOBILE_API_PATH_REST_CHANGE_REQUEST_STATUS, MOBILE_API_PATH_REST_GET_ADDRESS_INFO, RESPONSE_CODE_ERROR_INTERNAL_ERROR, RESPONSE_CODE_SUCCESS } from '../../utils/AppConstants';
import ViewFileInfoComponent from './components/showBoxContentComponent';
import ReceiveFiles from '../physicalArchive/tabs/ReceiveFiles';
import ReceiveBox from '../physicalArchive/tabs/ReceiveBox';
import LocalizeFiles from '../physicalArchive/tabs/LocalizeFiles';
import LocalizeBox from '../physicalArchive/tabs/LocalizeBox';
import ReLocalizeBox from '../physicalArchive/tabs/ReLocalizeBox';
import ReLocalizeFiles from '../physicalArchive/tabs/ReLocalizeFiles';
import PackagingBox from '../physicalArchive/tabs/PackagingBox';
import PackagingFiles from '../physicalArchive/tabs/PackagingFiles';
import ShowBoxContentComponent from './components/showBoxContentComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loading } from '../../components/loading/Loading';
import axiosInstance from '../../networking/api';
import { toast } from '../../utils/StaticMethods';
import ShowAddressContentComponent from './components/showAddressContentComponent';
import { FieldInfoModal } from '../../components/modals/fieldInfoModal';
import HTML from 'react-native-render-html';
import DeclarationComponent from './components/declarationComponent';

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

interface DamarisPredictActionsProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
}

const DamarisPredictActions = (props: DamarisPredictActionsProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const customer = useSelector((store: any) => store.customer);
    const [loading, setLoading] = useState<boolean>(false);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [possibleActions, setPossibleActions] = useState<string | string[]>([]);
    const [action, setAction] = useState<string>('');
    const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
    const [fieldInfoTitle, setFieldInfoTitle] = useState<string>('');
    const [fieldInfoDescription, setFieldInfoDescription] = useState<any>('');

    useEffect(() => {
      if(props?.route?.params?.data?.possibleActions) {
        setPossibleActions(props.route.params.data.possibleActions);
      }

      setAction('');
      setShowInfoModal(false);
    }, [props.route.params]);

    const _renderActions = () => {
        const actionsArray = typeof possibleActions === 'string' ? possibleActions.split(',') : possibleActions;
        return actionsArray?.map((action: string) => {
            return (
                <TouchableOpacity key={action} onPress={() => handleAction(action)} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>{getActionName(action)}</Text>
                </TouchableOpacity>
            );
        });
    };

    const handleAction = async (action: string) => {
      setAction(action);
    };

    const getActionName = (action: string) => {
      if(action === ACTION_SHOW_BOX_CONTENT) {
        return t('show_box_content');
      } else if(action === ACTION_VIEW_FILE_INFO) {
        return t('view_file_info');
      } else if(action === ACTION_VALIDATE_REQUEST) {
        return t('validate_request');
      } else if(action === ACTION_CHECK_OUT) {
        return t('check_out');
      } else if(action === ACTION_CHECK_IN) {
        return t('check_in');
      } else if(action === ACTION_PUT_ON_PLACE) {
        return t('put_on_place');
      } else if(action === ACTION_RECEIVE_BOX) {
        return t('fragment_receive_box_title');
      } else if(action === ACTION_RECEIVE_FILE) {
        return t('fragment_receive_file_title');
      } else if(action === ACTION_LOCALIZE_BOX) {
        return t('fragment_localize_box_title');
      } else if(action === ACTION_LOCALIZE_FILE) {
        return t('fragment_localize_file_title');
      } else if(action === ACTION_RELOCALIZE_BOX) {
        return t('fragment_relocalize_box_title');
      } else if(action === ACTION_RELOCALIZE_FILE) {
        return t('fragment_relocalize_file_title');
      } else if(action === ACTION_SHOW_ADDRESS_CONTENT) {
        return t('show_address_content');
      } else if(action === ACTION_SHOW_ADDRESS_INFO) {
        return t('show_address_info');
      } else if(action === ACTION_DECLARE_BOX) {
        return t('declare_box');
      } else if(action === ACTION_DECLARE_FILE) {
        return t('declare_file');
      } else if(action === ACTION_PACKAGING_BOX) {
        return t('menu_item_packagingBox');
      } else if(action == ACTION_PACKAGING_FILE) {
        return t('menu_item_packagingFile');
      }
      return t(action);
    };

    const changeRequestStatus = async (changeTo: number) => {
      const url: string | null = await getUrlFromStorage();
      setAction('');

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                requestID: props?.route?.params?.data?.requestID,
                status: changeTo
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_CHANGE_REQUEST_STATUS, data);
            console.log(response.data, ' //// response.data');
            if(response.data.code === RESPONSE_CODE_SUCCESS) {
              toast('success', 'top', 'SUCCESS!', t('request_status_changed_success'));

              dispatch({
                type: 'SET_CONFIG',
                payload: {
                  profileDrawerActiveSubId: '2.0',
                  profileDrawerActiveSubCode: 'DmarisPredict',
                  profileDrawerActiveSubTitle: t('menu_item_damarisPredict'),
                  profileDrawerActiveTitle: t('menu_item_damarisPredict')
                }
              });
              props.navigation.navigate('PhysicalArchive', { randomKey: Math.random(), actionType: 'nenu' });
            } else if(response.data.code === RESPONSE_CODE_ERROR_INTERNAL_ERROR) {
              toast('error', 'top', 'ERROR!', t('internal_error'));
            } else {
              toast('error', 'top', 'ERROR!', t('change_request_stat_error'));
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const showAddressInfo = async () => {
      setAction('');
      const url: string | null = await getUrlFromStorage();
      const lang: string | null = await getLang();

      try {
          setLoading(true);
          const data = {
              uniqueKey: userInfo.uniqueKey,
              lang: lang,
              storageAddressID: props?.route?.params?.data?.storAddrID
          };
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_ADDRESS_INFO, data);
          console.log(response.data, ' //// response.data');
          if(response.data.code === RESPONSE_CODE_SUCCESS) {
            const storAddrInfo = response.data?.storAddrInfo;
            const parts = storAddrInfo.split(";");

            const max = parts[0];
            const remaining = parts[1];

            const body = t('maximum_capacity') + ": <i>" + max + "</i>" +
                                    "<br/>" + t('remaining_size') + ": <i>" + remaining + "</i>"; 
                                    
            setFieldInfoTitle(t('storage_address_info'));
            setFieldInfoDescription(<HTML html={body} />);
            setShowInfoModal(true);
          } else {
            toast('error', 'top', 'ERROR!', t('could_not_load_address_info'));
          }
          setLoading(false);
      } catch (e) {
          console.log(e);
          setLoading(false);
      }
    };

    const _renderActionView = () => {
      console.log(action, ' action');
      
      if(action === ACTION_SHOW_BOX_CONTENT) {
        return <ShowBoxContentComponent 
                  navigation={props.navigation}
                  route={props.route}
                  requestID={props.route.params?.data?.requestID}
                  recordId={props.route.params?.data?.recordId}
                  isArchive={props.route.params?.data?.isArchive}
                  storAddrID={props.route.params?.data?.storAddrID}
                />
      } else if(action === ACTION_VIEW_FILE_INFO) {
        return <ViewFileInfoComponent 
            navigation={props.navigation}
            route={props.route}
            requestID={props.route.params?.data?.requestID}
            recordId={props.route.params?.data?.recordId}
            isArchive={props.route.params?.data?.isArchive}
            storAddrID={props.route.params?.data?.storAddrID}
          />
      } else if(action === ACTION_VALIDATE_REQUEST) {
        changeRequestStatus(4);
      } else if(action === ACTION_CHECK_OUT) {
        changeRequestStatus(5);
      } else if(action === ACTION_CHECK_IN) {
        changeRequestStatus(6);
      } else if(action === ACTION_PUT_ON_PLACE) {
        changeRequestStatus(0);
      } else if(action === ACTION_RECEIVE_BOX) {
        return <ReceiveBox navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} />
      } else if(action === ACTION_RECEIVE_FILE) {
        return <ReceiveFiles navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} />
      } else if(action === ACTION_LOCALIZE_BOX) {
        return <LocalizeBox navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else if(action === ACTION_LOCALIZE_FILE) {
        return <LocalizeFiles navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else if(action === ACTION_RELOCALIZE_BOX) {
        return <ReLocalizeBox navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else if(action === ACTION_RELOCALIZE_FILE) {
        return <ReLocalizeFiles navigation={props.navigation} route={props.route}openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else if(action === ACTION_SHOW_ADDRESS_CONTENT) {
        return <ShowAddressContentComponent
            navigation={props.navigation}
            route={props.route}
            requestID={props.route.params?.data?.requestID}
            recordId={props.route.params?.data?.recordId}
            isArchive={props.route.params?.data?.isArchive}
            storAddrID={props.route.params?.data?.storAddrID}
          />
      } else if(action === ACTION_SHOW_ADDRESS_INFO) {
        showAddressInfo();
      } else if(action === ACTION_DECLARE_BOX) {
        return <DeclarationComponent 
          navigation={props.navigation}
          route={props.route}
          scannedBarcode={props.route.params?.data?.barcode}
          isBox={true}
        />
      } else if(action === ACTION_DECLARE_FILE) {
        return <DeclarationComponent 
          navigation={props.navigation}
          route={props.route}
          scannedBarcode={props.route.params?.data?.barcode}
          isBox={false}
        />
      } else if(action === ACTION_PACKAGING_BOX) {
        return <PackagingBox navigation={props.navigation} route={props.route} openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else if(action == ACTION_PACKAGING_FILE) {
        return <PackagingFiles navigation={props.navigation} route={props.route} openScanner={e => {}} qrCode={''} qrCodeStorageAddress={''} />
      } else {
        return (
          <View>
            <Text style={styles.title}>{t('please_select_an_action')}</Text>
            { _renderActions() }
          </View>
        )
      }
      setAction('');
    };

    const handleHideInfo = useCallback(() => {
        setShowInfoModal(false);
    }, []);

    return (
      <View style={styles.container}>
        <Header title={t('fragment_about_us_title')} navigation={props.navigation} />
        <ScrollView contentContainerStyle={{flexGrow: 1}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
          { _renderActionView() }
        </ScrollView>
        <Loading visible={loading} />
        <FieldInfoModal
          isVisible={showInfoModal}
          showHideInfo={handleHideInfo}
          fieldInfoTitle={fieldInfoTitle}
          fieldInfoDescription={fieldInfoDescription}
        />
      </View>
    );
  };
  
  export default DamarisPredictActions;