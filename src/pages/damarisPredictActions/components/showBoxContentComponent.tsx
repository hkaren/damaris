import React, {FC, useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../../../networking/api';
import { ARCHIVE_TYPE_BOTH, ARCHIVE_TYPE_ELECTRONIC, ARCHIVE_TYPE_PHYSICAL, MOBILE_API_PATH_REST_GET_BOX_CONTENT } from '../../../utils/AppConstants';
import { getDeviceId } from '../../../utils/StaticMethods';
import * as Location from 'expo-location';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Loading } from '../../../components/loading/Loading';

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

interface ShowBoxContentComponentProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
  requestID: string;
  recordId: string;
  isArchive: boolean;
  storAddrID: string;
}

const ShowBoxContentComponent = (props: ShowBoxContentComponentProps) => {
    const { t } = useTranslation();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [archives, setArchives] = useState<any[]>([]);
    const [language, setLanguage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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
            setLanguage(lang);
        })();

        setLoading(false);
    }, []);

    const initData = async () => {
        const url: string | null = await getUrlFromStorage();
        const lang: string | null = await getLang();

        try {
            setLoading(true);
            const data = {
                uniqueKey: userInfo.uniqueKey,
                lang: lang,
                archDeclID: props.recordId,
                archive: props.isArchive,
                pagination: {
                    pageNumber: 1,
                    pageSize: 100
                },
                location: {
                    imei: await getDeviceId(),
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                }
            };
            const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_GET_BOX_CONTENT, data);
            if(response.data.archives.length > 0) {
                setArchives(response.data.archives);
            }
            setLoading(false);
        } catch (e) {
            console.log(e);
            setLoading(false);
        }
    };

    const _renderArchives = () => {
        return archives.map((archive: any) => {
            let line: string = '';
            let orderedColumnNames = archive.orderedColumnNames;
            let orderedColumnNamesArr = orderedColumnNames.split(",");
            let boxCode: string = '';
            let fileCode: string = '';
            let recordFileCode: string = '';
            let recordBoxCode: string = '';
            let recordArchiveType: number = 0;
            let columnTransName: string = '';
            let columnValue: string = '';
            let archiveType: number = 0;

            let recordId = "";
            if (archive.recordID) {
                recordId = archive.recordID;
            }

            if (archive.recordArchiveType) {
                recordArchiveType = parseInt(archive.recordArchiveType);
            }

            if (archive.recordBoxCode) {
                recordBoxCode = archive.recordBoxCode;
            }

            if (archive.recordFileCode) {
                recordFileCode = archive.recordFileCode;
            }

            console.log(archive, ' archive');
            
            for (let columnName of orderedColumnNamesArr) {
                console.log(columnName, ' columnName');
                
                let columnValue: string = "";
                if(archive[columnName]){
                    columnValue = archive[columnName];
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
                    let obj = archive.columnName;
                    let isJSONObject = false;

                    try {
                        archive.columnName;
                        isJSONObject = true;
                    } catch (e){}

                    if(isJSONObject) {
                        if (language && obj[language]) {
                            columnValue = obj[language];
                        } else {
                            columnValue = "-";
                        }
                    } else if(archive[columnName] != null && !archive[columnName].isEmpty()){
                        let vals = archive[columnName];
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
                }

                if (line.length === 0) {
                    line = columnTransName + ": " + columnValue;
                } else {
                    line += "; " + columnTransName + ": " + columnValue;
                }
            }
            return (
                <View key={recordId} style={styles.textContainer}>
                    <Text style={styles.text}>{ line }</Text>
                </View>
            );
        });
    };

    return (
      <View style={styles.container}>
        {_renderArchives()}
        <Loading visible={loading} />
      </View>
    );
  };
  
  export default ShowBoxContentComponent;

  const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: '#fff',
      marginBottom: 10,
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
  });