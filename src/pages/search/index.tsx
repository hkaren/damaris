import React, {FC, useEffect, useState} from 'react';

import {
  Header,
} from '../../components';
import {useDispatch, useSelector} from "react-redux";
import { RouteProp } from '@react-navigation/native';
import { Text, View, TextInput, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../networking/api';
import { ARCHIVE_TYPE_BOTH, ARCHIVE_TYPE_ELECTRONIC, ARCHIVE_TYPE_PHYSICAL, INDEX_TYPES_MULTI_VALUED, MOBILE_API_PATH_REST_SEARCH_DOCUMENT, MOBILE_API_PATH_REST_SEARCH_DOCUMENT_ADVANCED, PAGINATION_COUNT_20 } from '../../utils/AppConstants';
import { getDeviceId, splitIntoLines, toast } from '../../utils/StaticMethods';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { Loading } from '../../components/loading/Loading';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Styles } from '../../core/Styles';
import { Checkbox } from '../../components/core/Checkbox';
import { MoreIndexModal } from '../../components/modals/moreIndexModal';
import HTML from 'react-native-render-html';
import { ElectronicDocViewModal } from '../../components/modals/ElectronicDocViewModal';
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

type RootStackParamList = {
  Home: undefined;
  DrawerNavigation: { screen?: string };
};
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface SearchProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
}
const Search = (props: SearchProps) => {
    const config = useSelector((store: any) => store.config);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [endScrollFlag, setEndScrollFlag] = useState<boolean>(true);
    const [searchListData, setSearchListData] = useState<any[]>([]);
    const [scrollCounter, setScrollCounter] = useState<number>(1);
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
    const [language, setLanguage] = useState<string | null>(null);
    const [checked, setChecked] = useState(false); // For demonstration, ideally should come from item or parent state
    const [filterData, setFilterData] = useState<any>({});
    const [moreIndexModalVisible, setMoreIndexModalVisible] = useState<boolean>(false);
    const [moreIndexModalLine3, setMoreIndexModalLine3] = useState<string>('');
    const [isAdvancedSearchState, setIsAdvancedSearchState] = useState<boolean>(false);
    const [showElecDocModal, setShowElecDocModal] = useState<boolean>(false);

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
          setLanguage(lang);
      })();

      setLoading(false);
  }, []);

    useEffect(() => {
      setEndScrollFlag(false);
      setSearchListData([]);
      setScrollCounter(1);
      setAllowServerCall(true);
      setFilterData({});
      setMoreIndexModalVisible(false);
      setIsAdvancedSearchState(false)
      setMoreIndexModalLine3('');
      setShowElecDocModal(false);
      doSearch('', config.fromPageToPage === 'AdvancedFormToSearchDocument' ? true : false, 1);
    }, [props.route.params]);
    
    const reInitPages = () => {
      setRefreshing(true)
      setScrollCounter(1);
      setAllowServerCall(true);
      setFilterData({});
      getNextPage(1, true, isAdvancedSearchState);
    };

    const nextPagePages = () => {
      if(endScrollFlag && allowServerCall){
        getNextPage(scrollCounter, false, isAdvancedSearchState);
      }
    };

    const getSearchParamsData = async (query: string, lang: string | null, isAdvancedSearch: boolean, scrollCounter: number) => {
      //console.log(props?.route?.params?.data, ' // props.route.params');
      //console.log(isAdvancedSearch, ' // isAdvancedSearch');

      let data = {};
      //console.log(config.fromPageToPage, ' // config.fromPageToPage');
        
      if(isAdvancedSearch){
        //console.log(props?.route?.params?.data, '////////////////////////////////////');
        
        data = {
          uniqueKey: userInfo.uniqueKey,
          lang: lang,
          searchText: query,
          docTypeID: props?.route?.params?.data?.docTypeID,
          depID: props?.route?.params?.data?.depID,
          companyID: props?.route?.params?.data?.companyID,
          boxTypeID: props?.route?.params?.data?.boxTypeID,
          archiveType: props?.route?.params?.data?.archiveType,
          finalStateID: props?.route?.params?.data?.finalStateID,
          storageYears: props?.route?.params?.data?.storageYears,
          fileCode: props?.route?.params?.data?.fileCode,
          boxCode: props?.route?.params?.data?.boxCode,
          parentBoxCode: props?.route?.params?.data?.parentBoxCode,
          archivingDateFrom: props?.route?.params?.data?.archivingDateFrom,
          archivingDateTo: props?.route?.params?.data?.archivingDateTo,
          finalizationDateFrom: props?.route?.params?.data?.finalizationDateFrom,
          finalizationDateTo: props?.route?.params?.data?.finalizationDateTo,
          addressFrom: props?.route?.params?.data?.addressFrom,
          addressTo: props?.route?.params?.data?.addressTo,
          storageType: props?.route?.params?.data?.storageType,
          storageID: props?.route?.params?.data?.storageID,
          boxMode: props?.route?.params?.data?.boxMode,
          comment: props?.route?.params?.data?.comment,
          showFinalizedDocuments: props?.route?.params?.data?.showFinalizedDocuments,
          indexes: props?.route?.params?.data?.indexes,
          location: {
            imei: await getDeviceId(),
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          pagination: {
            pageNumber: scrollCounter,
            pageSize: PAGINATION_COUNT_20
          },
          sort: {
            field: 'archiveId',
            order: 'ASC'
          }
        };
      } else {
        data = {
          uniqueKey: userInfo.uniqueKey,
          lang: lang,
          searchText: query,
          location: {
            imei: await getDeviceId(),
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          pagination: {
            pageNumber: scrollCounter,
            pageSize: PAGINATION_COUNT_20
          },
          sort: {
            field: 'archiveId',
            order: 'ASC'
          }
        };
      };
      
      return data
    };

    const doSearchBtnAction = async (query: string) => {
      //console.log('doSearchBtnAction');

      dispatch({
        type: 'SET_CONFIG',
        payload: {
          fromPageToPage: ''
        }
      });

      //console.log(config.fromPageToPage, ' // config.fromPageToPage');
      doSearch(query, false, 1);
    };

    const doSearch = async (query: string, isAdvancedSearch: boolean, scrollCounter: number) => {
      if (allowServerCall) {
        //console.log('doSearch');
        
        Keyboard.dismiss();
        setLoading(true);
        setAllowServerCall(false);
        const url: string | null = await getUrl();
        const lang: string | null = await getLang();
        try {
            const data = await getSearchParamsData(query, lang, isAdvancedSearch, scrollCounter);
            const response = await axiosInstance.post(url + (isAdvancedSearch ? MOBILE_API_PATH_REST_SEARCH_DOCUMENT_ADVANCED : MOBILE_API_PATH_REST_SEARCH_DOCUMENT), data);
            const count = response.data.count;
  
            if (count == 0) {
              toast('info', 'top', 'No Data', t('fragment_document_search_error_2'));
            } else {
                setScrollCounter(1);
                setIsAdvancedSearchState(isAdvancedSearch);
                setTimeout(() => {
                    setLoading(false);
                }, 500);
                getNextPage(1, false, isAdvancedSearch);
            }
  
            setAllowServerCall(true);
            setRefreshing(false)

            setTimeout(() => {
                setLoading(false);
            }, 500);
        } catch (e) {
            console.log(e);
            setLoading(false);
            setEndScrollFlag(false);
            setAllowServerCall(true);
            setRefreshing(false)
        }
      }
    };

    const getNextPage = async (scrollCounter: number, refresh: boolean, isAdvancedSearch: boolean) => {
      //console.log(scrollCounter, ' //// scrollCounter');
      
      if (allowServerCall) {
        setAllowServerCall(false);
        setLoading(true);
        const url: string | null = await getUrl();
        const lang: string | null = await getLang();
        try {
            const data = await getSearchParamsData(search, lang, isAdvancedSearch, scrollCounter);
            const response = await axiosInstance.post(url + (isAdvancedSearch ? MOBILE_API_PATH_REST_SEARCH_DOCUMENT_ADVANCED : MOBILE_API_PATH_REST_SEARCH_DOCUMENT), data);
            const archives = response.data.archives;

            if (archives) {
              if (scrollCounter == 1) {
                setSearchListData(archives);
              } else {
                setSearchListData([...searchListData, ...archives]);
              }
            }
  
            setScrollCounter(scrollCounter+1);
            setAllowServerCall(true);
            setRefreshing(false)
  
            if(archives?.length == PAGINATION_COUNT_20){
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

    const clickOnFirstLine = (item: any) => {
      const recordID = item?.recordID;
      const archiveType = item?.archiveType;
      const imageID = item?.imageID;
      const fileCode = item?.articleCode;
      const boxCode = item?.boxCode;
      console.log(recordID, archiveType, imageID, fileCode, boxCode, ' // recordId');
      
      
      //setShowElecDocModal(true);

      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveCode: t('advanced_search'),
  
          // profileDrawerActiveSubId: '2.0',
          profileDrawerActiveSubCode: 'ElectronicDocumentView',
          profileDrawerActiveSubTitle: t('title_activity_electronic_document'),
          profileDrawerActiveTitle: t('title_activity_electronic_document'),
        }
      });
      props.navigation.navigate(
        "ElectronicDocumentView", 
        { 
          randomKey: Math.random(),
          actionType: 'nenu',
          data: { 
            recordID: recordID,
            archiveType: archiveType,
            imageID: imageID,
            fileCode: fileCode,
            boxCode: boxCode
          }
        }
      );

    };

    const _renderPage = ({ item, index }: { item: any; index: number }) => {
      //console.log(item?.recordID, item?.archiveID + '' + item?.imageID, ' // item?.archiveID + item?.imageID');
      //console.log(item, ' // item');
      //console.log(item.fieldTypes, ' // item.fieldTypes');
      
      let line: string = '';
      let orderedColumnNames = item.orderedColumnNames;
      let orderedColumnNamesArr = orderedColumnNames.split(",");
      let fieldTypes = item.fieldTypes;
      let fieldTypesArr = fieldTypes.split(",");
      let boxCode: string = '';
      let fileCode: string = '';
      let recordFileCode: string = '';
      let recordBoxCode: string = '';
      let recordArchiveType: number = 0;
      let columnTransName: string = '';
      let columnValue: string = '';
      let archiveType: number = 0;
      let imageId: number = 0;
      let hasExtendedNotices: boolean = false;
      let hasStamps: boolean = false;

      let recordId = "";
      if (item.recordID) {
          recordId = item.recordID;
      }

      if (item.imageID) {
          imageId = item.imageID;
      }

      if (item.hasExtendedNotices && item.hasExtendedNotices === "true") {
          hasExtendedNotices = true;
      }

      if (item.hasStamps && item.hasStamps === "true") {
          hasStamps = true;
      }

      if (item.recordArchiveType) {
          recordArchiveType = parseInt(item.recordArchiveType);
      }

      if (item.recordBoxCode) {
          recordBoxCode = item.recordBoxCode;
      }

      if (item.recordFileCode) {
          recordFileCode = item.recordFileCode;
      }

      //console.log(item, ' archive');
      
      for (let columnName of orderedColumnNamesArr) {
          //console.log(columnName, ' columnName');
          
          let columnValue: string = "";
          if(item[columnName]){
              columnValue = item[columnName];
          }
          if (columnValue.length === 0) columnValue = "-";

          if (columnName.toLowerCase() === "department") {
              columnTransName = t('department');
          } else if (columnName.toLowerCase() === "doctype") {
              columnTransName = t('docType');
          } else if (columnName.toLowerCase() === "company") {
              columnTransName = t('company');
          } else if (columnName.toLowerCase() === "articlecode") {
              columnTransName = t('articleCode');
              fileCode = columnValue;
          } else if (columnName.toLowerCase() === "boxcode") {
              columnTransName = t('boxCode');
              boxCode = columnValue;
          } else if (columnName.toLowerCase() === "archivetype") {
              columnTransName = t('archiveType');
              archiveType = parseInt(columnValue);
              switch (archiveType){
                  case ARCHIVE_TYPE_ELECTRONIC:
                      columnValue = t('document_type_electronic');
                      break;
                  case ARCHIVE_TYPE_PHYSICAL:
                      columnValue = t('document_type_physical');
                      break;
                  case ARCHIVE_TYPE_BOTH:
                      columnValue = t('document_type_both');
                      break;
              }
          } else if (columnName.toLowerCase() === "physicalstorageaddress") {
              columnTransName = t('physicalStorageAddress');
          } else if (columnName.toLowerCase() === "parentboxcode") {
              columnTransName = t('parentBoxCode');
          } else if (columnName.toLowerCase() === "boxtype") {
              columnTransName = t('boxType');
          } else if (columnName.toLowerCase() === "archivingdate") {
              columnTransName = t('archivingDate');
          } else if (columnName.toLowerCase() === "finalizationdate") {
              columnTransName = t('finalizationDate');
          } else if (columnName.toLowerCase() === "state") {
              columnTransName = t('state');
              if(columnValue.toLowerCase() === "a"){
                  columnValue = t('state_A');
              } else if(columnValue.toLowerCase() === "r"){
                  columnValue = t('state_R');
              } else if(columnValue.toLowerCase() === "d"){
                  columnValue = t('state_D');
              }
          } else if (columnName.toLowerCase() === "finalstate") {
              columnTransName = t('finalState');
              let obj = item.columnName;
              let isJSONObject = false;

              try {
                item.columnName;
                  isJSONObject = true;
              } catch (e){}

              if(isJSONObject) {
                  if (language && obj && obj[language]) {
                      columnValue = obj[language];
                  } else {
                      columnValue = "-";
                  }
              } else if(item[columnName] != null && !item[columnName].isEmpty()){
                  let vals = item[columnName];
                  let valArr = vals.split(",");
                  for(let ii = 0; ii < valArr.length; ii++){
                      if(valArr[ii].trim().startsWith(language)){
                          let keyVal = valArr[ii].trim().split(":");
                          columnValue = keyVal[1].trim();
                          break;
                      }
                  }
              } else {
                  columnValue = "-";
              }
          } else if (columnName.toLowerCase() === "qualitycontrol") {
              columnTransName = t('qualityControl');
              if(columnValue.toLowerCase() === "true"){
                  columnValue = t('quality_control_valid');
              } else {
                  columnValue = t('quality_control_not_valid');
              }
          } else if (columnName.toLowerCase() === "out") {
              columnTransName = t('out');
          } else {
              // Indexes
              if(columnName.includes("idx_")){
                  columnTransName = columnName.replace("idx_", "");
              } else {
                  columnTransName = columnName;
              }

              let fieldType: number = 0;
              //console.log(columnValue, ' // columnValue 000');
              if (columnValue && columnValue != '-' && fieldTypesArr[orderedColumnNamesArr.indexOf(columnName)]) {
                  fieldType = fieldTypesArr[orderedColumnNamesArr.indexOf(columnName)];
                    //console.log(fieldType, columnName, ' // fieldType, columnName');
    
                  if(fieldType == INDEX_TYPES_MULTI_VALUED){
                    const sep = item[columnName+'_sep_'];
                    //console.log(columnValue, item[columnName+'_sep_'], ' // columnValue 111');
                    

                    let multiVluesNew: string = '';
                    columnValue.split(sep).forEach((item: string) => {
                      //console.log(item, ' // item');
                      multiVluesNew += item + ', ';
                    });

                    columnValue = multiVluesNew;
                  }
              }
          }

          if (line.length === 0) {
              line = columnTransName + ": " + columnValue;
          } else {
              line += "; " + columnTransName + ": " + columnValue;
          }
      }

      const [line1, line2, line3] = splitIntoLines(line);
      
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
          <Checkbox
              key={recordId}
              label=''
              selected={filterData['users']?.some((item_: any) => item_ == recordId)}
              onSelect={() => onChangeData('multi', 'users', recordId)}
              containerStyle={[Styles.mb_3, {paddingRight: 4, paddingTop: 4, paddingBottom: 10}]}
              touchableStyle={[{width: 30, height: 45, alignItems: 'flex-start'}]}
          />
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => clickOnFirstLine(item)}>
              <Text style={styles.line1}>{line1}</Text>
            </TouchableOpacity>
            { line2 ? 
              <HTML 
                html={line2}
                baseFontStyle={styles.line2}
                tagsStyles={{
                  b: {
                    fontWeight: 'normal'
                  },
                  strong: {
                    fontWeight: 'normal'
                  },
                }}
              />
              : null }
            { line3 ? <TouchableOpacity onPress={() => showMoreIndexes(line3)}>
              <Text style={styles.more}>More...</Text>
            </TouchableOpacity> : null }
          </View>
        </View>
      )
    };

    const showMoreIndexes = (line3: string) => {
      setMoreIndexModalVisible(true);
      setMoreIndexModalLine3(line3);
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

    const initAdvancedSearch = () => {
      setScrollCounter(1);
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveCode: t('advanced_search'),
  
          // profileDrawerActiveSubId: '2.0',
          profileDrawerActiveSubCode: 'AdvancedSearch',
          profileDrawerActiveSubTitle: t('advanced_search'),
          profileDrawerActiveTitle: t('advanced_search')
        }
      });
      props.navigation.navigate("AdvancedSearch", { randomKey: Math.random(), actionType: 'nenu' });
    };

    return (
      <>
        <Header title={t('menu_item_search_document')} navigation={props.navigation} />
        <View style={styles.container}>
          <View style={styles.searchBar}>
            <TouchableOpacity onPress={() => doSearchBtnAction(search)}>
              <Ionicons name="search" size={24} color="#222" />
            </TouchableOpacity>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity onPress={() => initAdvancedSearch()}>
              <Ionicons name="settings-outline" size={24} color="#222" />
            </TouchableOpacity>
          </View>
          {searchListData?.length > 0 &&
            <FlatList refreshControl={<RefreshControl colors={["#9Bd35A", "#689F38"]} refreshing={refreshing}
                                    onRefresh={() => {
                                        reInitPages();
                                    }}/>}
                data={searchListData}
                renderItem={_renderPage}
                keyExtractor={(item) => item?.recordID}
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
          <Loading visible={loading} />
          <MoreIndexModal
            isVisible={moreIndexModalVisible}
            showHideInfo={() => setMoreIndexModalVisible(false)}
            fieldInfoDescription={moreIndexModalLine3}
          />
          <ElectronicDocViewModal
              isVisible={showElecDocModal}
              showHideInfo={() => setShowElecDocModal(false)}
              fieldInfoTitle={t('title_activity_electronic_document')}
              documents={[{
                id: '1',
                type: 'image',
                url: 'https://en.wikipedia.org/wiki/Nature_photography#/media/File:Altja_j%C3%B5gi_Lahemaal.jpg',
                title: 'Image 1'
              },
              {
                id: '2',
                type: 'pdf',
                url: 'https://nasihah.net/wp-content/uploads/books/12-Rules-for-Life.pdf',
                title: 'PDF 1'
              }
            ]}
          />
          
          <Fab navigation={props.navigation} />
        </View>
      </>
    );
};

export default Search;