import React, {FC, useEffect, useState} from 'react';
import {View, Text, useWindowDimensions, Dimensions, ScrollView, Alert, Image, TouchableOpacity} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import styles from './styles';
import { Header } from '../../components';
import { Button } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { Select } from '../../components/core/Select';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ARCHIVE_TYPE_ELECTRONIC, MOBILE_API_PATH_REST_ARCHIVE_ELECTRONIC_DOCUMENT, MOBILE_API_PATH_REST_DOC_TYPE_LIST, MOBILE_API_PATH_REST_GET_DOC_TYPE_INDEXES_LIST, RESPONSE_CODE_ERROR_DOC_TYPE_NOT_FOUND, RESPONSE_CODE_ERROR_INTERNAL_ERROR, RESPONSE_CODE_ERROR_NOT_ENOUGH_SPACE_IN_STORAGE, RESPONSE_CODE_ERROR_QUALITY_CONTROL, RESPONSE_CODE_ERROR_QUALITY_CONTROL_DOCUMENT, RESPONSE_CODE_ERROR_STORAGE_NOT_FOUND, RESPONSE_CODE_ERROR_USER_DOCUMENT_TYPE_NO_ACCESS, RESPONSE_CODE_SUCCESS } from '../../utils/AppConstants';
import axiosInstance from '../../networking/api';
import { getDeviceId, toast } from '../../utils/StaticMethods';
import * as Location from 'expo-location';
import { IndexesComponent } from '../general/components/IndexesComponent';
import { Loading } from '../../components/loading/Loading';
import * as ImagePicker from 'expo-image-picker';
import Base64 from 'react-native-base64';
import { Fab } from '../../components/fab';

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

type ElectronicArchiveProps = {
    navigation: any;
    route: RouteProp<Record<string, any>, string>;
};

export const ElectronicArchive: FC<ElectronicArchiveProps> = (props: ElectronicArchiveProps) => {
    const customer = useSelector((store: any) => store.customer);
    const userInfo = useSelector((store: any) => store.userInfo);
    const config = useSelector((store: any) => store.config);
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const layout = useWindowDimensions();
    const dispatch = useDispatch();
    const [documentType, setDocumentType] = useState<number>(0);
    const [documentTypeList, setDocumentTypeList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [errorFieldNames, setErrorFieldNames] = useState<string[]>([]);
    const [selectedIndexFormData, setSelectedIndexFormData] = useState<Record<string, string>>({});
    const [indexes, setIndexes] = useState<any[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [reloadKey, setReloadKey] = useState(0);
  
    useEffect(() => {
        setLoading(false);
        setDocumentType(0);
        setSelectedImages([]);
        initData();
    }, [props.route.params?.randomKey, reloadKey]);

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
    };

    const initDocumentTypeList = (data :any) => {
      let documentTypeList_: any = [];
      data?.map((item: any, index: number) => {
          const {docTypeID, docTypeName} = item;
          documentTypeList_.push({value: docTypeID, label: docTypeName});
      });
      setDocumentTypeList(documentTypeList_);
    };
    
    const handleTakePhoto = async () => {
        console.log('Take photo pressed');
        
        try {
            setLoading(true);
            console.log('Requesting camera permissions...');
            
            // Request camera permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            console.log('Camera permission status:', status);
            
            if (status !== 'granted') {
                console.log('Camera permission denied');
                Alert.alert(
                    'Camera Permission Required',
                    'Sorry, we need camera permissions to take photos!',
                    [{ text: 'OK' }]
                );
                return;
            }

            console.log('Launching camera...');
            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                aspect: [4, 3],
                quality: 0.8,
            });

            console.log('Camera result:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const newImage = result.assets[0].uri;
                console.log('Captured image URI:', newImage);
                
                // Add the captured image to the selected images array
                setSelectedImages(prevImages => [...prevImages, newImage]);
                console.log('Added captured image to selectedImages array');
                
                // You can also get additional info about the captured image
                const capturedAsset = result.assets[0];
                console.log('Captured image width:', capturedAsset.width);
                console.log('Captured image height:', capturedAsset.height);
                console.log('Captured image type:', capturedAsset.type);
                
                // Here you can upload the captured image to your server
                // await uploadImage(newImage);
                
            } else {
                console.log('User cancelled camera or no image captured');
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert(
                'Error',
                'Failed to take photo. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
            console.log('handleTakePhoto completed');
        }
    };

    const handleChoosePhoto = async () => {
      console.log('handleChoosePhoto called');
      try {
          setLoading(true);
          console.log('Requesting permissions...');
          
          // Request permissions
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          console.log('Permission status:', status);
          
          if (status !== 'granted') {
              console.log('Permission denied');
              Alert.alert(
                  'Permission Required',
                  'Sorry, we need camera roll permissions to make this work!',
                  [{ text: 'OK' }]
              );
              return;
          }

          console.log('Launching image picker...');
          // Launch image picker with multiple selection
          const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
              aspect: [4, 3],
              quality: 0.8,
              allowsMultipleSelection: true,
          });

          console.log('Image picker result:', result);

          if (!result.canceled && result.assets && result.assets.length > 0) {
              const newImages = result.assets.map(asset => asset.uri);
              console.log('Selected assets:', result.assets);
              setSelectedImages(prevImages => [...prevImages, ...newImages]);
              console.log('Selected image URIs:', newImages);
              
              // You can also get additional info for each image
              result.assets.forEach((asset, index) => {
                  console.log(`Image ${index + 1} - width:`, asset.width);
                  console.log(`Image ${index + 1} - height:`, asset.height);
                  console.log(`Image ${index + 1} - type:`, asset.type);
              });
              
              // Here you can upload the images to your server
              // await uploadImages(newImages);
              
          } else {
              console.log('User cancelled image picker or no assets selected');
          }
      } catch (error) {
          console.error('Error picking image:', error);
          Alert.alert(
              'Error',
              'Failed to pick image. Please try again.',
              [{ text: 'OK' }]
          );
      } finally {
          setLoading(false);
          console.log('handleChoosePhoto completed');
      }
    };

    const doArchive = async (forceArchive: string) => {
         console.log('Do archive pressed');
         const url: string | null = await getUrlFromStorage();
         const lang: string | null = await getLang();
   
         try {
             setLoading(true);
             
             // Create FormData for multipart upload
             const formData = new FormData();
             
             // Add text fields
             formData.append('uniqueKey', userInfo.uniqueKey);
             formData.append('lang', lang !== null ? lang : '');
             formData.append('docTypeID', documentType.toString());
             formData.append('forceArchive', forceArchive);
             formData.append('indexValues', Base64.encode(JSON.stringify(selectedIndexFormData)));
             formData.append('imei', await getDeviceId() || '');
             formData.append('latitude', location?.latitude?.toString() || '');
             formData.append('longitude', location?.longitude?.toString() || '');
             
             // Add images as files
             if (selectedImages && selectedImages.length > 0) {
                 // Send the first image as 'file' to match the server parameter
                 const firstImageFile = {
                     uri: selectedImages[0],
                     type: 'image/jpeg',
                     name: 'image.jpg'
                 };
                 formData.append('file', firstImageFile as any);
                 
                 // If there are more images, send them with different field names
                 for (let i = 1; i < selectedImages.length; i++) {
                     const imageFile = {
                         uri: selectedImages[i],
                         type: 'image/jpeg',
                         name: `image_${i + 1}.jpg`
                     };
                     formData.append(`file${i}`, imageFile as any);
                 }
             };
             
             const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_ARCHIVE_ELECTRONIC_DOCUMENT, formData, {
                 headers: {
                     'Content-Type': 'multipart/form-data',
                 },
             });
             
             if(response.data.code === RESPONSE_CODE_SUCCESS) {
                setReloadKey(prev => prev + 1); // triggers useEffect
             } else if(response.data.code === RESPONSE_CODE_ERROR_QUALITY_CONTROL_DOCUMENT) {
                 toast('error', 'top', 'ERROR!', t('document_level_qc_error'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_DOC_TYPE_NOT_FOUND) {
                 toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_4'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_USER_DOCUMENT_TYPE_NO_ACCESS) {
                 toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_3'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_QUALITY_CONTROL) {
               toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_8'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_STORAGE_NOT_FOUND) {
               toast('error', 'top', 'ERROR!', t('storage_no_info'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_NOT_ENOUGH_SPACE_IN_STORAGE) {
               toast('error', 'top', 'ERROR!', t('fragment_electronic_archive_error_11'));
             } else if(response.data.code === RESPONSE_CODE_ERROR_INTERNAL_ERROR) {
               toast('error', 'top', 'ERROR!', t('internal_error'));
             } else {
               toast('error', 'top', 'ERROR!', t('error_occurred_process'));
             }
   
             setLoading(false);
         } catch (e) {
             console.log(e);
             setLoading(false);
         }
     };

    const chooseDocumentType = async (value: number) => {
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
    
    return (
      <>
        <Header title="Electronic Archive" navigation={props.navigation} />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {/* Main Content Area */}
            <View style={styles.mainContent}>
                {/* Placeholder Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="archive-outline" size={120} color="#333" />
                    <View style={styles.diagonalLines}>
                        <View style={styles.diagonalLine1} />
                        <View style={styles.diagonalLine2} />
                    </View>
                </View>

                {/* Heading */}
                <Text style={styles.heading}>electronic archive</Text>

                {/* Instructions */}
                <Text style={styles.instructions}>
                    Please take a photo or choose a document from gallery for archiving.
                </Text>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <Button variant="general" title={t('fragment_electronic_capture_image_btn')} onClickHandler={() => handleTakePhoto()} />
                    <Button variant="general" title={t('fragment_electronic_load_image_btn')} onClickHandler={() => handleChoosePhoto()} />
                </View>
            </View>

            {/* Selected Images Display */}
            {selectedImages.length > 0 && (
                <View style={styles.selectedImagesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScrollView}>
                        {selectedImages.map((imageUri, index) => (
                            <View key={index} style={styles.imageItemContainer}>
                                <Image 
                                    source={{ uri: imageUri }} 
                                    style={styles.selectedImage}
                                    resizeMode="cover"
                                />
                                <TouchableOpacity 
                                    style={styles.removeImageButton}
                                    onPress={() => {
                                        setSelectedImages(prevImages => 
                                            prevImages.filter((_, i) => i !== index)
                                        );
                                    }}
                                >
                                    <Ionicons name="close-circle" size={24} color="#ff4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                { selectedImages && selectedImages.length > 0 ?
                    <View style={styles.inputContainer}>
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
                    : null
                }
                { documentType && indexes?.length > 0 ? 
                  <View>
                    <Button variant="general" title={t('archive')} onClickHandler={() => doArchive('F')} />
                    <View style={{marginTop: 20}}>
                      <IndexesComponent
                          indexes={indexes}
                          errorFieldNames={errorFieldNames}
                          onSelected={(indexID, value) => {
                              setIndexDataValue(indexID, value);
                          }}
                      />
                    </View>
                    <Button variant="general" title={t('archive')} onClickHandler={() => doArchive('F')} />
                  </View>
                  : null
                }
            </View>

            <Fab navigation={props.navigation} />
            <Loading visible={loading} />
        </ScrollView>
      </>
    );
};