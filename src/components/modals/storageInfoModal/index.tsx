import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import {styles} from "./styles";
import { SvgComponent } from "../../../core/SvgComponent";
import { useDispatch, useSelector } from "react-redux";
import * as Location from 'expo-location';
import { getPostalCode } from "../../../pages/general/getPostalCode";
import { GOOGLE_API_KEY, RESPONSE_CODE_ERROR_STORAGE_INFO_NO_PERMISSION, RESPONSE_CODE_ERROR_STORAGE_INFO_NO_STORAGE_FOUND, RESPONSE_CODE_ERROR_STORAGE_INFO_NOT_IN_STORAGE, RESPONSE_CODE_SUCCESS, URL_STORAGE_INFO } from "../../../utils/AppConstants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../../networking/api";
import { getDeviceId } from "../../../utils/StaticMethods";
import { useTranslation } from "react-i18next";

const getUrlFromStorage = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem("url");
    } catch (error) {
        console.log(error);
        return null;
    }
};

interface FieldInfoModalProps {
    isVisible: boolean;
    showHideInfo: () => void;
    fieldInfoData: any
}

export const StorageInfoModal: React.FC<FieldInfoModalProps> = ({
                                                isVisible,
                                                showHideInfo,
                                                fieldInfoData
                                            }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [currentStatus, setCurrentStatus] = useState<Number>(0);
    const [htmlData, setHtmlData] = useState<string>('');

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

        setCurrentStatus(0);
    }, []);
    console.log(location, ' /// location');

    useEffect(() => {
        initStorageInfo();
    }, [location]);

    const initStorageInfo = async () => {
        try {
            if (!location) return;
            const postal = await getPostalCode(location.latitude, location.longitude, GOOGLE_API_KEY);
            console.log('postal code:', postal); // e.g., "0010" or null if not available

            const url: string | null = await getUrlFromStorage();
            const data = {
                uniqueKey: userInfo.uniqueKey,
                postalCode: postal,
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            console.log(url);
            
            const response = await axiosInstance.post(url + URL_STORAGE_INFO, data);
            console.log(response.data, ' //// response.data');

            if(response?.data?.result?.code == RESPONSE_CODE_SUCCESS) {
                setCurrentStatus(1);

                const storageNames = response?.data?.storageNames;
                const requestCount = response?.data?.requestCount;
                const receiptionCount = response?.data?.receiptionCount;
                const localizationCount = response?.data?.localizationCount;

                setHtmlData(t('storage_title') + ': ' + storageNames);
            } else if(response?.data?.result?.code == RESPONSE_CODE_ERROR_STORAGE_INFO_NO_PERMISSION) {
                setCurrentStatus(-2);
                setHtmlData(t('storage_no_permission'));
            } else if(response?.data?.result?.code == RESPONSE_CODE_ERROR_STORAGE_INFO_NO_STORAGE_FOUND ||
                response?.data?.result?.code == RESPONSE_CODE_ERROR_STORAGE_INFO_NOT_IN_STORAGE
            ) {
                setCurrentStatus(-3); 
                setHtmlData(t('storage_no_info'));
            } else {
                setCurrentStatus(-1);
                setHtmlData(t('storage_no_info'));
            }
            
        } catch (e) {
            console.warn('reverse geocode error:', (e as Error).message);
        }
    };
    
    const closeStorageInfoModal = () => {
        dispatch({
            type: 'SET_CONFIG',
            payload: {storageInfoModal: false}
        });
    };

    const _renderMoreIndexes = () => {
        return (
            <View style={{flexDirection: 'column'}}>
                <View 
                    style={styles.header}>
                    <Text style={styles.title}>{t('storage_info')}</Text>
                    <Text style={{textAlign: 'right' }}>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => closeStorageInfoModal()}>
                            <SvgComponent name="close" />
                        </TouchableOpacity>
                    </Text>
                </View>
                <View>
                    <Text style={styles.htmlData}>{htmlData}</Text>
                </View>
            </View>
        );
    };

    return (
        <Modal
            testID={"modal"}
            isVisible={isVisible}
            swipeDirection={['down', 'up']}
            onSwipeComplete={showHideInfo}
            onBackdropPress={showHideInfo}
            style={styles.containerModal}
            statusBarTranslucent>
                <View style={styles.container}>
                    {_renderMoreIndexes()}
                </View>
        </Modal>
    );
};