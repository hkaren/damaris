import React, {FC, useEffect, useState} from 'react';
import { MainTabActivityScreenProps} from '../../../Interface';
import { Header } from '../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import { Button } from '../../../components/Button';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../../core/Styles';
import { Select } from '../../../components/core/Select';
import { InputOutlined } from '../../../components/core/InputOutlined';
import { DateTimePicker } from '../../../components/core/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../networking/api';
import { MOBILE_API_PATH_REST_ARCHIVE_TYPES_LIST, MOBILE_API_PATH_REST_BOX_TYPE_LIST, MOBILE_API_PATH_REST_COMPANY_LIST, MOBILE_API_PATH_REST_DEPARTMENT_LIST_BY_PREFIX, MOBILE_API_PATH_REST_DOC_TYPE_LIST, MOBILE_API_PATH_REST_GET_DOC_TYPE_INDEXES_LIST, MOBILE_API_PATH_REST_GET_FINAL_STATES, MOBILE_API_PATH_REST_GET_PARENT_BOX_CODES, MOBILE_API_PATH_REST_STORAGE_LIST_BY_PREFIX, RESPONSE_CODE_SUCCESS } from '../../../utils/AppConstants';
import { getDeviceId, toast } from '../../../utils/StaticMethods';
import { IndexesComponent } from '../../general/components/IndexesComponent';
import Base64 from 'react-native-base64';

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

type RootStackParamList = {
  Home: undefined;
  DrawerNavigation: { screen?: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AdvancedSearch: FC<MainTabActivityScreenProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [documentType, setDocumentType] = useState<string>('');
    const [documentTypeList, setDocumentTypeList] = useState<any[]>([]);
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [company, setCompany] = useState<number>(0);
    const [departmentList, setDepartmentList] = useState<any[]>([]);
    const [department, setDepartment] = useState<number>(0);
    const [fileCode, setFileCode] = useState<string>('');
    const [boxCode, setBoxCode] = useState<string>('');
    const [archivingDateFrom, setArchivingDateFrom] = useState<string>('');
    const [archivingDateTo, setArchivingDateTo] = useState<string>('');
    const [finalizationDateFrom, setFinalizationDateFrom] = useState<string>('');
    const [finalizationDateTo, setFinalizationDateTo] = useState<string>('');
    const [moreOptions, setMoreOptions] = useState<boolean>(false);
    const [archiveType, setArchiveType] = useState<number>(0);
    const [archiveTypeList, setArchiveTypeList] = useState<any[]>([]);
    const [boxType, setBoxType] = useState<string>('');
    const [boxTypeList, setBoxTypeList] = useState<any[]>([]);
    const [parentBoxCode, setParentBoxCode] = useState<string>('');
    const [addressFrom, setAddressFrom] = useState<string>('');
    const [addressTo, setAddressTo] = useState<string>('');
    const [finalState, setFinalState] = useState<string>('');
    const [finalStateList, setFinalStateList] = useState<any[]>([]);
    const [storageYears, setStorageYears] = useState<string>('');
    const [storageType, setStorageType] = useState<string>('');
    const [storage, setStorage] = useState<number>(0);
    const [storageList, setStorageList] = useState<any[]>([]);
    const [comment, setComment] = useState<string>('');
    const [showFinalizedDocuments, setShowFinalizedDocuments] = useState<boolean>(false);
    const [boxMode, setBoxMode] = useState<boolean>(false);
    const [indexes, setIndexes] = useState<any[]>([]);
    const [errorFieldNames, setErrorFieldNames] = useState<string[]>([]);
    const [selectedIndexFormData, setSelectedIndexFormData] = useState<Record<string, string>>({});

    useEffect(() => {
      setLoading(false);
      setMoreOptions(false);
      setArchiveType(0);
      setDepartment(0);
      setStorage(0);
      setCompany(0);
      initData();
    }, []);

    const initData = async () => {
        const url: string | null = await getUrlFromStorage();
        const lang: string | null = await getLang();

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
                archiveType: archiveType,
                forDocumentUploader: false,
                prefix: '',
                companyID: company
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_DOC_TYPE_LIST, data);
            if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
                initDocumentTypeList(response.data.docTypes);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        };

        try {
          setLoading(true);
          const data = {
              uniqueKey: userInfo.uniqueKey
          };
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_COMPANY_LIST, data);
          if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
              initCompanyList(response.data.companies);
          }
          setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        };

        initDepartmentListFromDB(company);

        try {
          setLoading(true);
          const data = {
              uniqueKey: userInfo.uniqueKey,
              companyID: company
          };
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_ARCHIVE_TYPES_LIST, data);
          if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
              initArchiveTypeList(response.data.archiveTypes);
          }
          setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        };

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
      };

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
      };

      initStorageListFromDB(0);
    };

    const initDepartmentListFromDB = async (company: number) => {
      const url: string | null = await getUrlFromStorage();
      const lang: string | null = await getLang();
      
      try {
        setLoading(true);
        const data = {
            uniqueKey: userInfo.uniqueKey,
            companyID: company,
            prefix: ''
        };
        const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_DEPARTMENT_LIST_BY_PREFIX, data);
        if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
            initDepartmentList(response.data.departments);
        }
        setLoading(false);
      } catch (e) {
          console.log(e);
          setLoading(false);
      };
    };

    const initStorageListFromDB = async (storageType_: number) => {
      const url: string | null = await getUrlFromStorage();
      const lang: string | null = await getLang();

      try {
          setLoading(true);
          const data = {
              uniqueKey: userInfo.uniqueKey,
              lang: lang,
              storageType: storageType_ ? storageType_ : storageType,
              prefix: ''
          };
          const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_STORAGE_LIST_BY_PREFIX, data);
          if(response.data.result.code === RESPONSE_CODE_SUCCESS) {
              initStorageList(response.data?.storages);
          }
          setLoading(false);
      } catch (e) {
          console.log(e);
          setLoading(false);
      };
      
    };

    const initDocumentTypeList = (data :any) => {
        let documentTypeList_: any = [];
        data?.map((item: any, index: number) => {
            const {docTypeID, docTypeName} = item;
            documentTypeList_.push({value: docTypeID, label: docTypeName});
        });
        setDocumentTypeList(documentTypeList_);
    };

    const initCompanyList = (data :any) => {
        let companyList_: any = [];
        data?.map((item: any, index: number) => {
            const {companyID, companyName} = item;
            companyList_.push({value: companyID, label: companyName});
        });
        setCompanyList(companyList_);
    };

    const initDepartmentList = (data :any) => { 
        let departmentList_: any = [];
        data?.map((item: any, index: number) => {
            const {departmentID, departmentName} = item;
            departmentList_.push({value: departmentID, label: departmentName});
        });
        setDepartmentList(departmentList_);
    };

    const initStorageList = (data :any) => {
        let storageList_: any = [];
        data?.map((item: any, index: number) => {
            const {storageID, storageCodeName} = item;
            storageList_.push({value: storageID, label: storageCodeName});
        });
        setStorageList(storageList_);
    }; 

    const initFinalStateList = (data :any) => {
      //console.log(data, ' data final state');
      
        let finalStateList_: any = [];
        data?.map((item: any, index: number) => {
            const {paramID, translateValue} = item;
            finalStateList_.push({value: paramID, label: translateValue});
        });
        setFinalStateList(finalStateList_);
    };

    const initArchiveTypeList = (data :any) => {
      //console.log(data, ' data');
      
        let archiveTypeList_: any = [];
        data?.map((item: any, index: number) => {
            const {id, name} = item;
            if(name !== null && name !== undefined && name !== '') {
              archiveTypeList_.push({value: id, label: name});
            }
        });
        setArchiveTypeList(archiveTypeList_);
    };

    const initBoxTypeList = (data :any) => {
        let boxTypeList_: any = [];
        data?.map((item: any, index: number) => {
            const {boxTypeID, boxTypeName} = item;
            boxTypeList_.push({value: boxTypeID, label: boxTypeName});
        });
        setBoxTypeList(boxTypeList_);
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
          //console.log(data, ' // data');
          
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
        setSelectedIndexFormData(prev => {
          const updated = { ...prev };
          
          if (value === '') {
            // Remove the key if value is empty string
            delete updated[indexID];
          } else {
            // Set/update the key if value is not empty
            updated[indexID] = value;
          }
    
          return updated;
        });
      }
    };
    //console.log(selectedIndexFormData, ' // selectedIndexFormData');

    const doSearch = () => {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveCode: 'Search Document',
          fromPageToPage: 'AdvancedFormToSearchDocument',
  
          // profileDrawerActiveSubId: '2.0',
          profileDrawerActiveSubCode: 'SearchDocument',
          profileDrawerActiveSubTitle: 'Search Document',
          profileDrawerActiveTitle: 'Search Document'
        }
      });
      props.navigation.navigate(
        "SearchDocument", 
        { 
          randomKey: Math.random(), 
          actionType: 'nenu', 
          data: {
            docTypeID: documentType,
            depID: department,
            companyID: company,
            boxTypeID: boxType,
            archiveType: archiveType,
            finalStateID: finalState,
            storageYears: storageYears,
            fileCode: fileCode,
            boxCode: boxCode,
            parentBoxCode: parentBoxCode,
            archivingDateFrom: archivingDateFrom,
            archivingDateTo: archivingDateTo,
            finalizationDateFrom: finalizationDateFrom,
            finalizationDateTo: finalizationDateTo,
            addressFrom: addressFrom,
            addressTo: addressTo,
            storageType: storageType,
            storageID: storage,
            boxMode: boxMode,
            comment: comment,
            showFinalizedDocuments: showFinalizedDocuments,
            indexes: Base64.encode(JSON.stringify(selectedIndexFormData)),
          } 
        });
    };

    return (
      <>
        <Header title="Settings" navigation={props.navigation} />
        <View style={styles.container}>
          <ScrollView contentContainerStyle={{paddingVertical: 10}} automaticallyAdjustKeyboardInsets showsVerticalScrollIndicator={false}>
            <Button variant="general" title={t('advanced_search_field_btn_search')} onClickHandler={() => doSearch()} />
            <View style={[Styles.mb_10, Styles.mt_10]}>
              <Select
                  title={t('document_type')}
                  defaultValue={documentType}
                  data={documentTypeList}
                  onSelected={(value) => {
                      setDocumentType(value);
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
                   title={t('advanced_search_field_company')}
                   defaultValue={company}
                   data={companyList}
                   onSelected={(value) => {
                     setCompany(value);
                     setDepartment(0);
                     setDepartmentList([]);
                     initDepartmentListFromDB(value);
                   }}
               />
            </View>
            <View style={[Styles.mb_10, Styles.mt_10]}>
              <Select
                  title={t('advanced_search_field_department')}
                  defaultValue={department}
                  data={departmentList}
                  onSelected={(value) => {
                      setDepartment(value);
                  }}
              />
            </View>
            <View style={[Styles.mt_10]}>
              <InputOutlined
                  label={t('advanced_search_field_file_code')}
                  value={fileCode}
                  onChange={(value) => {
                      setFileCode(value)
                  }} />
            </View>
            <View style={[Styles.mt_10]}>
              <InputOutlined
                  label={t('advanced_search_field_box_code')}
                  value={boxCode}
                  onChange={(value) => {
                      setBoxCode(value) 
                  }} />
            </View>
            <View style={[Styles.mt_10]}>
              <DateTimePicker
                  label={t('advanced_search_field_archiving_date_from')}
                  modeDate={'datetime'}
                  format='dd/mm/yyyy'
                  value={archivingDateFrom}
                  confirmDate={(value: number) => {
                      setArchivingDateFrom(value+'');
                  }}
              />
            </View>
            <View style={[Styles.mt_10]}>
              <DateTimePicker
                  label={t('advanced_search_field_archiving_date_to')}
                  modeDate={'datetime'}
                  format='dd/mm/yyyy'
                  value={archivingDateTo}
                  confirmDate={(value: number) => {
                      setArchivingDateTo(value+'');
                  }}
              />
            </View>
            <View style={[Styles.mt_10]}>
              <DateTimePicker
                  label={t('advanced_search_field_finalization_date_from')}
                  modeDate={'datetime'}
                  format='dd/mm/yyyy'
                  value={finalizationDateFrom}
                  confirmDate={(value: number) => {
                      setFinalizationDateFrom(value+'');
                  }}
              />
            </View>
            <View style={[Styles.mt_10]}>
              <DateTimePicker
                  label={t('advanced_search_field_finalization_date_to')}
                  modeDate={'datetime'}
                  format='dd/mm/yyyy'
                  value={finalizationDateTo}
                  confirmDate={(value: number) => {
                      setFinalizationDateTo(value+'');
                  }}
              />
            </View>

            <View style={[Styles.mt_10]}>
              <TouchableOpacity onPress={() => setMoreOptions(!moreOptions)}>
                <Text style={[styles.moreOptionsText]}>{t('advanced_search_field_more_options')}</Text>
              </TouchableOpacity>
            </View>

            {moreOptions && (
              <>
                <View style={[Styles.mb_10, Styles.mt_10]}>
                  <Select
                      title={t('advanced_search_field_archive_type')}
                      defaultValue={archiveType}
                      data={archiveTypeList}
                      onSelected={(value) => {
                          setArchiveType(value);
                      }}
                  />
                </View>
                <View style={[Styles.mb_10, Styles.mt_10]}>
                  <Select
                      title={t('advanced_search_field_box_type')}
                      defaultValue={boxType}
                      data={boxTypeList}
                      onSelected={(value) => {
                          setBoxType(value);
                      }}
                  />
                </View>
                <View style={[Styles.mt_10]}>
                  <InputOutlined
                      label={t('advanced_search_field_parent_box_code')}
                      value={parentBoxCode}
                      onChange={(value) => {
                          setParentBoxCode(value) 
                      }} />
                </View>
                <View style={[Styles.mt_10]}>
                  <InputOutlined
                      label={t('advanced_search_field_address_from')}
                      value={addressFrom}
                      onChange={(value) => {
                          setAddressFrom(value) 
                      }} />
                </View>
                <View style={[Styles.mt_10]}>
                  <InputOutlined
                      label={t('advanced_search_field_address_to')}
                      value={addressTo}
                      onChange={(value) => {
                          setAddressTo(value) 
                      }} />
                </View>
                <View style={[Styles.mt_10, Styles.mb_10]}>
                  <Select
                      title={t('advanced_search_field_final_state')}
                      defaultValue={finalState}
                      data={finalStateList}
                      onSelected={(value) => {
                          setFinalState(value);
                      }}
                  />
                </View>
                <View style={[Styles.mt_10]}>
                  <InputOutlined
                      label={t('advanced_search_field_storage_years')}
                      value={storageYears}
                      keyboardType='numeric'
                      onChange={(value) => {
                          setStorageYears(value) 
                      }}
                  />
                </View>
                <View style={[Styles.mt_10, Styles.mb_10]}>
                  <Select
                      title={t('advanced_search_field_storage_type')}
                      defaultValue={storageType}
                      data={[
                        {value: 1, label: t('advanced_search_field_electronic_archive')},
                        {value: 2, label: t('advanced_search_field_physical_archive')}
                      ]}
                      onSelected={(value) => {  
                        setStorageType(value);
                        initStorageListFromDB(value);
                      }}
                  />
                </View>
                <View style={[Styles.mt_10, Styles.mb_10]}>
                  <Select
                      title={t('advanced_search_field_storage')}
                      defaultValue={storage}
                      data={storageList}
                      onSelected={(value) => {  
                          setStorage(value);
                      }}
                  />
                </View>
                <View style={[styles.switchContainer, Styles.mt_10, Styles.mb_10]}>
                  <Text style={{ fontSize: 16, color: '#222' }}>{t('advanced_search_field_show_finalized_documents')}</Text>
                  <Switch
                    value={showFinalizedDocuments}
                    onValueChange={(value) => {
                      setShowFinalizedDocuments(value);
                    }}
                    trackColor={{ false: '#d3e3e8', true: '#b3d6e3' }}
                    thumbColor={showFinalizedDocuments ? '#379ec3' : '#b3d6e3'}
                  />
                </View>
                <View style={[styles.switchContainer, Styles.mt_10, Styles.mb_10]}>
                  <Text style={{ fontSize: 16, color: '#222' }}>{t('advanced_search_field_box_mode')}</Text>
                  <Switch
                    value={boxMode}
                    onValueChange={(value) => {
                      setBoxMode(value);
                    }}
                    trackColor={{ false: '#d3e3e8', true: '#b3d6e3' }}
                    thumbColor={boxMode ? '#379ec3' : '#b3d6e3'}
                  />
                </View>
                <View style={[Styles.mt_10, Styles.mb_10]}>
                  <InputOutlined
                    label={t('advanced_search_field_comment')}
                    value={comment}
                    multiline
                    fieldCss={[styles.comment]}
                    onChange={(value) => {
                        setComment(value)
                    }} />
                </View>
              </>
            )}
            <Button variant="general" title={t('advanced_search_field_btn_search')} onClickHandler={() => doSearch()} />
          </ScrollView>
        </View>
      </>
    );
};

export default AdvancedSearch;