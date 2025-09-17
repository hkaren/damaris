import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../networking/api';
import { getDeviceId, toast } from '../../../utils/StaticMethods';
import * as Location from 'expo-location';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Loading } from '../../../components/loading/Loading';
import { Select } from '../../../components/core/Select';
import { Styles } from '../../../core/Styles';
import { DateTimePicker } from '../../../components/core/DateTimePicker';
import { InputOutlined } from '../../../components/core/InputOutlined';
import { Button } from '../../../components/Button';
import { 
    ARCHIVE_TYPE_ELECTRONIC,
    MOBILE_API_PATH_REST_BOX_TYPE_LIST,
    MOBILE_API_PATH_REST_DO_DECLARATION,
    MOBILE_API_PATH_REST_DOC_TYPE_LIST,
    MOBILE_API_PATH_REST_GET_BATCHES,
    MOBILE_API_PATH_REST_GET_DOC_TYPE_INDEXES_LIST,
    MOBILE_API_PATH_REST_GET_FINAL_STATES,
    MOBILE_API_PATH_REST_GET_PARENT_BOX_CODES,
    RESPONSE_CODE_SUCCESS
} from '../../../utils/AppConstants';
import { useHeaderHeight } from '@react-navigation/elements';
import { IndexesComponent } from '../../general/components/IndexesComponent';

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

interface DeclarationComponentProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
  scannedBarcode: string;
  isBox: boolean;
}

const DeclarationComponent = (props: DeclarationComponentProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const headerHeight = useHeaderHeight();

    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [batch, setBatch] = useState<string>('');
    const [barchList, setBatchList] = useState<any[]>([]);
    const [documentType, setDocumentType] = useState<string>('');
    const [documentTypeList, setDocumentTypeList] = useState<any[]>([]);
    const [boxType, setBoxType] = useState<string>('');
    const [boxTypeList, setBoxTypeList] = useState<any[]>([]);
    const [finalState, setFinalState] = useState<string>('');
    const [finalStateList, setFinalStateList] = useState<any[]>([]);
    const [parentBoxCodes, setParentBoxCodes] = useState<string>('');
    const [parentBoxCodesList, setParentBoxCodesList] = useState<any[]>([]);
    const [declarationDate, setDeclarationDate] = useState<string>('');
    const [storageYears, setStorageYears] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [indexes, setIndexes] = useState<any[]>([]);
    const [selectedIndexFormData, setSelectedIndexFormData] = useState<any[]>([]);
    const [boxCode, setBoxCode] = useState<string>('');
    const [errorFieldNames, setErrorFieldNames] = useState<string[]>([]);
    
    useFocusEffect(
        React.useCallback(() => {
            initData();
        }, [])
    );

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

        setLoading(false);
    }, []);

    const initData = async () => {
        const url: string | null = await getUrlFromStorage();
        const lang: string | null = await getLang();

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_BATCHES, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initBatchList(response.data.batches);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
                archiveType: ARCHIVE_TYPE_ELECTRONIC,
                forDocumentUploader: true,
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_DOC_TYPE_LIST, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initDocumentTypeList(response.data.docTypes);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                boxCode: '',
                prefix: ''
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_BOX_TYPE_LIST, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initBoxTypeList(response.data.boxTypes);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_FINAL_STATES, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initFinalStateList(response.data?.finalStates);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                batchID: batch,
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_PARENT_BOX_CODES, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initParentBoxCodesList(response.data?.parentBoxes);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const initBatchList = (data :any) => {
        let batchList_: any = [];
        data?.map((item: any, index: number) => {
            const {batchID, batchName} = item;
            batchList_.push({value: batchID, label: batchName});
        });
        setBatchList(batchList_);
    };

    const initDocumentTypeList = (data :any) => {
        let documentTypeList_: any = [];
        data?.map((item: any, index: number) => {
            const {docTypeID, docTypeName} = item;
            documentTypeList_.push({value: docTypeID, label: docTypeName});
        });
        setDocumentTypeList(documentTypeList_);
    };

    const initBoxTypeList = (data :any) => {
        let boxTypeList_: any = [];
        data?.map((item: any, index: number) => {
            const {boxTypeID, boxTypeName} = item;
            boxTypeList_.push({value: boxTypeID, label: boxTypeName});
        });
        setBoxTypeList(boxTypeList_);
    };

    const initFinalStateList = (data :any) => {
        let finalStateList_: any = [];
        data?.map((item: any, index: number) => {
            const {paramID, translateValue} = item;
            finalStateList_.push({value: paramID, label: translateValue});
        });
        setFinalStateList(finalStateList_);
    };

    const initParentBoxCodesList = (data :any) => {
        let parentBoxCodesList_: any = [];
        data?.map((item: any, index: number) => {
            const {boxCode, declarationID} = item;
            parentBoxCodesList_.push({value: boxCode, label: declarationID});
        });
        setParentBoxCodesList(parentBoxCodesList_);
    };

    const chooseDocumentType = async (value: string) => {
        setDocumentType(value);
        const url: string | null = await getUrlFromStorage();
        const lang: string | null = await getLang();

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
                docTypeID: value,
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_DOC_TYPE_INDEXES_LIST, data);
            
            if(response.data.result.code === "-3") {
                toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_3'));
            } else if(response.data.result.code === "-2") {
                toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_4'));
            } else if(response.data.result.code === "-1") {
                toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_5'));
            } else if(response.data.result.code === "0") {
                setIndexes([]);
            } else {
                setIndexes(response.data.indexes);
            }

            if(response?.data?.result?.storageYears) {
                setStorageYears(response?.data?.result?.storageYears);
            } else {
                setStorageYears('');
            }

            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const setIndexDataValue = (indexID: string, value: string) => {
        if(indexID !== undefined && indexID !== null && value !== undefined) {
            setSelectedIndexFormData({...selectedIndexFormData, [indexID]: value});
        }
    };
    console.log(selectedIndexFormData, ' // selectedIndexFormData');

    const doDeclare = async (forceArchive: boolean) => {
        console.log(batch, documentType, boxType, finalState, parentBoxCodes, declarationDate, storageYears, comment);
        
        if(batch === '' || batch === '0' || batch === null) {
            toast('error', 'top', 'ERROR!', t('batch_is_required'));
        } else if(documentType === '' || documentType === '0' || documentType === null) {
            toast('error', 'top', 'ERROR!', t('doc_type_is_required'));
        } else if(boxType === '' || boxType === '0' || boxType === null) {
            toast('error', 'top', 'ERROR!', t('box_type_is_required'));
        } else if(finalState === '' || finalState === '0' || finalState === null) {
            toast('error', 'top', 'ERROR!', t('final_state_is_required'));
        } else if(storageYears === '' || storageYears === '0' || storageYears === null) {    
            toast('error', 'top', 'ERROR!', t('storage_years_is_required'));
        } else {
            const url: string | null = await getUrlFromStorage();
            const lang: string | null = await getLang();

            let boxCode_ = "";
            let fileCode_ = "";
            if(props.isBox) {
                boxCode_ = props.scannedBarcode;
                fileCode_ = props.scannedBarcode + "-1";
            } else {
                boxCode_ = boxCode.trim();
                fileCode_ = props.scannedBarcode;
            }
            
            const encodedIndexes = JSON.stringify(selectedIndexFormData);
            //const encodedIndexes = Base64.encode(jsonString);

            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
                boxCode: boxCode_,
                fileCode: fileCode_,
                box: props.isBox,
                batchID: batch,
                docTypeID: documentType,
                boxTypeID: boxType,
                finalStateID: finalState,
                parentBox: parentBoxCodes,
                declarationDate: declarationDate,
                storageYears: storageYears,
                comments: comment,
                forceArchive: forceArchive,
                indexes: encodedIndexes,
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };

            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_DO_DECLARATION, data);
            console.log(response.data.result, ' // response.data');
            
            if(response.data.result.code === "-1") {
                toast('success', 'top', 'SUCCESS!', t('internal_error'));
            } else if(response.data.result.code === "-2") {
                toast('success', 'top', 'SUCCESS!', t('parent_box_small_error'));
            } else if(response.data.result.code === "-4") {
                let isThereRequired = false;
                let qcFieldIds: any[] = [];
                if(response.data.result.has("QCErrors")){
                    const qcErrors = response.data.result.getJSONObject("QCErrors");
                    //const qcErrorsArray = qcErrors.getJSONArray("QCErrors");
                    
                    if (qcErrors != null) {
                        const keys = qcErrors.keys();
                        while (keys.hasNext()) {
                            const key = keys.next();
                            const value = parseInt(qcErrors.get(key).toString());
                            if (value == 2) {
                                isThereRequired = true;
                            }
                            qcFieldIds.push(parseInt(key));
                        }
                    }

                    if (isThereRequired) {
                        toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_8'));
                    } else {
                        Alert.alert(t('warning'), t('fragment_electronic_archive_error_9'), [
                            {
                                text: 'No',
                                onPress: () => {
                                },
                            },
                            {
                                text: 'Yes',
                                onPress: () => doDeclare(true)
                            },
                        ]);
                    }
                } else if(response.data.result.has("docLevelQCErrors")){
                    const qcErrors = response.data.result.getJSONObject("docLevelQCErrors");
                    if (qcErrors != null) {
                        const keys = qcErrors.keys();
                        while (keys.hasNext()) {
                            const key = keys.next();
                            const value = parseInt(qcErrors.get(key).toString());
                            if (value == 2) {
                                isThereRequired = true;
                            }
                        }
                    }

                    if (isThereRequired) {
                        toast('error', 'top', 'ERROR!', t('document_level_qc_error'));
                    } else {
                        Alert.alert(t('warning'), t('document_level_qc_warning'), [
                            {
                                text: 'No',
                                onPress: () => {
                                },
                            },
                            {
                                text: 'Yes',
                                onPress: () => doDeclare(true)
                            },
                        ]);
                    }
                }
                setErrorFieldNames(qcFieldIds);
            } else {
                toast('success', 'top', 'SUCCESS!', t('declaration_success'));

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
            }
        }
    };

    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{props.isBox ? t('boxCode') : t('fileCode')}: {props.scannedBarcode}</Text>
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <Select
                title={t('batch')}
                defaultValue={batch}
                data={barchList}
                onSelected={(value) => {
                    setBatch(value);
                }}
            />
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <Select
                title={t('document_type_req')}
                defaultValue={documentType}
                data={documentTypeList}
                onSelected={(value) => {
                    chooseDocumentType(value);
                }}
            />
        </View>
        { indexes?.length > 0 ? 
            <View style={[Styles.mb_10, Styles.mt_10]}>
                <IndexesComponent
                    indexes={indexes}
                    errorFieldNames={errorFieldNames}
                    onSelected={(indexID, value) => {
                        setIndexDataValue(indexID, value);
                    }}
                />
            </View>
            : null
        }
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <Select
                title={t('advanced_search_field_box_type')+'*'}
                defaultValue={boxType}
                data={boxTypeList}
                onSelected={(value) => {
                    setBoxType(value);
                }}
            />
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <Select
                title={t('final_state')}
                defaultValue={finalState}
                data={finalStateList}
                onSelected={(value) => {
                    setFinalState(value);
                }}
            />
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <Select
                title={t('parent_box')}
                defaultValue={parentBoxCodes}
                data={parentBoxCodesList}
                onSelected={(value) => {
                    setParentBoxCodes(value);
                }}
            />
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <DateTimePicker
                label='Date *'
                modeDate={'datetime'}
                format='dd/mm/yyyy'
                value={declarationDate}
                confirmDate={(value: number) => {
                    setDeclarationDate(value+'');
                }}
            />
        </View>
        <View style={[Styles.mb_10, Styles.mt_10]}>
            <InputOutlined
                label="Storage Years *"
                value={storageYears}
                keyboardType="numeric"
                onChange={(value) => {
                    setStorageYears(value)
                }} />
        </View>
        <View style={Styles.mb_20}>
            <InputOutlined
                label="Comment *"
                value={comment}
                multiline
                fieldCss={[styles.comment]}
                onChange={(value) => {
                    setComment(value)
                }} />
        </View>
        <View style={Styles.mb_20}>
            <Button variant="general" title={t('declare')} onClickHandler={() => doDeclare(false)} />
        </View>
        <Loading visible={loading} />
      </View>
    );
  };
  
  export default DeclarationComponent;

  const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#fff',
      marginBottom: 10,
      marginHorizontal: 10,
    },
    textContainer: {
      padding: 5,
      marginHorizontal: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
    },
    text: {
      fontSize: 16,
      color: '#000',
    },
    titleContainer: {
      padding: 5,
      borderBottomWidth: 2,
      borderBottomColor: '#d9d9d9',
    },
    titleText: {
      fontSize: 16,
      color: '#000',
      fontWeight: '600',
    },
    comment: {
      height: 150
    },
  });