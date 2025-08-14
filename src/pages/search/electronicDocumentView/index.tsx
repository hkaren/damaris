import React, {useEffect, useState} from 'react';
import { RouteProp } from '@react-navigation/native';
import { Header } from '../../../components';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, TouchableOpacity, View, Image, Dimensions, Alert, Linking } from 'react-native';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOBILE_API_PATH_REST_ELECTRONIC_DOCUMENT } from '../../../utils/AppConstants';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { ActivityIndicator } from 'react-native-paper';

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

interface DocumentItem {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'pdf';
  thumbnail?: string;
}
interface ElectronicDocumentViewProps {
  navigation: any;
  route: RouteProp<Record<string, any>, string>;
}
const ElectronicDocumentView = (props: ElectronicDocumentViewProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const userInfo = useSelector((store: any) => store.userInfo);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [pdfLoadError, setPdfLoadError] = useState<boolean>(false);
    const [pdfLoading, setPdfLoading] = useState<boolean>(false);
    const [pdfViewerKey, setPdfViewerKey] = useState<number>(0);
    const [currentViewerIndex, setCurrentViewerIndex] = useState<number>(0);
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
    const [fileUriDownloaded, setFileUriDownloaded] = useState<string>('');
    
    // Sample data - replace with your actual data
    const [documents, setDocuments] = useState<DocumentItem[]>([
      {
        id: '1',
        title: 'Sample Image 1',
        url: 'https://picsum.photos/800/600?random=1',
        type: 'image'
      },
      {
        id: '2',
        title: 'Sample PDF Document',
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        type: 'pdf'
      },
      {
        id: '3',
        title: 'Sample Image 2',
        url: 'https://picsum.photos/800/600?random=2',
        type: 'image'
      }
    ]);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
      setLoading(false);
      setAllowServerCall(true);
      initData();
    }, [props.route.params?.randomKey]);

    const initData = async () => {
      const url: string | null = await getUrl();
      const lang: string | null = await getLang();

      const data = {
        uniqueKey: userInfo.uniqueKey,
        lang: lang,
        recordID: props?.route?.params?.data?.recordID,
        imageID: props?.route?.params?.data?.imageID,
        boxCode: props?.route?.params?.data?.boxCode,
        fileCode: props?.route?.params?.data?.fileCode
      };
      await downloadFile(url + MOBILE_API_PATH_REST_ELECTRONIC_DOCUMENT, data);
    };

    const downloadFile = async (serviceUrl: string, urlParams: Record<string, any>) => {
      if (allowServerCall) {
        setLoading(true);
        setAllowServerCall(false);

        try {
          const fileUri = FileSystem.documentDirectory + 'downloaded_file.pdf'; // Change file name if needed
      
          const response = await fetch(serviceUrl, {
            method: 'POST',
            headers: {
              'Accept-Charset': 'UTF-8',
              'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(urlParams),
          });
      
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.status}`);
          }
      
          const blob = await response.blob();
          const base64 = await convertBlobToBase64(blob);
      
          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
      
          console.log('✅ File downloaded to:', fileUri);
          setFileUriDownloaded(fileUri);
          //return fileUri;
          setAllowServerCall(true);

          setTimeout(() => {
              setLoading(false);
          }, 500);
        } catch (e) {
            console.log(e);
            setLoading(false);
            setAllowServerCall(true);
        }
      }
    };

    const convertBlobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          const base64data = (reader.result as string).split(',')[1]; // remove data:*/*;base64,
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      });
    };

    // Reset PDF viewer when document changes
    useEffect(() => {
      setPdfLoadError(false);
      setPdfLoading(false);
      setPdfViewerKey(prev => prev + 1);
      setCurrentViewerIndex(0);
    }, [currentIndex]);

    const openPDF = async (url: string, title: string) => {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Cannot open PDF file');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to open PDF file');
      }
    };

    const goToNext = () => {
      if (currentIndex < documents.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    };

    const goToPrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };

    const getPdfViewerUrl = (pdfUrl: string, viewerIndex: number = 0) => {
      // Multiple PDF viewers for better compatibility
      const viewers = [
        `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`,
        `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}`,
        `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pdfUrl)}`,
        `https://pdfjs.express/viewer?url=${encodeURIComponent(pdfUrl)}`
      ];
      return viewers[viewerIndex] || viewers[0];
    };

    const tryNextViewer = () => {
      if (currentViewerIndex < 3) {
        setCurrentViewerIndex(currentViewerIndex + 1);
        setPdfViewerKey(prev => prev + 1);
        setPdfLoadError(false);
        setPdfLoading(true);
      } else {
        setPdfLoadError(true);
        setPdfLoading(false);
      }
    };

    const renderDocument = (item: DocumentItem) => {
      if (item.type === 'image') {
        return (
          <Image
            source={{ uri: item.url }}
            style={styles.documentImage}
            resizeMode="contain"
          />
        );
      } else if (item.type === 'pdf') {
        if (pdfLoadError) {
          return (
            <View style={styles.pdfFallback}>
              <Ionicons name="document-text" size={80} color="#e74c3c" />
              <Text style={styles.pdfText}>PDF Document</Text>
              <Text style={styles.pdfTitle}>{item.title}</Text>
              <View style={styles.pdfButtonsContainer}>
                <TouchableOpacity 
                  style={styles.openPdfButton}
                  onPress={() => openPDF(item.url, item.title)}
                >
                  <Ionicons name="open-outline" size={20} color="white" />
                  <Text style={styles.openPdfButtonText}>Open PDF</Text>
                </TouchableOpacity>
                {currentViewerIndex < 3 && (
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={tryNextViewer}
                  >
                    <Ionicons name="refresh" size={20} color="#007AFF" />
                    <Text style={styles.retryButtonText}>Try Different Viewer</Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          );
        }
        
        return (
          <View style={styles.pdfContainer}>
            <WebView
              key={pdfViewerKey}
              source={{ 
                uri: getPdfViewerUrl(item.url, currentViewerIndex)
              }}
              style={styles.pdfViewer}
              onLoadStart={() => {
                console.log('PDF viewer loading...', currentViewerIndex);
                setPdfLoading(true);
              }}
              onLoadEnd={() => {
                console.log('PDF viewer loaded', currentViewerIndex);
                setPdfLoading(false);
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('PDF viewer error: ', nativeEvent);
                tryNextViewer();
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('PDF HTTP error: ', nativeEvent);
                tryNextViewer();
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              bounces={false}
              scrollEnabled={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Loading PDF...</Text>
                </View>
              )}
            />
            {pdfLoading && (
              <View style={styles.overlayLoading}>
                <Text style={styles.loadingText}>Loading PDF...</Text>
              </View>
            )}
          </View>
        );
      }
    };

    return (
      <>
        <Header title="Electronic Document Viewer" navigation={props.navigation} />
        <View style={styles.container}>

        {/* <InlinePdfBase64Viewer fileUri={fileUriDownloaded} /> */}

        <View style={styles.pdfContainer1}>
          <WebView
            source={{ uri: fileUriDownloaded }}
            style={{ flex: 1 }}
            useWebKit
            startInLoadingState
            renderLoading={() => <ActivityIndicator size="large" color="blue" />}
          />
          <Text style={styles.pdfText}>{fileUriDownloaded}</Text>
        </View>

          <View style={styles.carouselContainer}>
            <View style={styles.documentContainer}>
              {documents.length > 0 && renderDocument(documents[currentIndex])}
            </View>
            
            {documents.length > 1 && (
              <View style={styles.navigationContainer}>
                <TouchableOpacity 
                  style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                  onPress={goToPrevious}
                  disabled={currentIndex === 0}
                >
                  <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>
                
                <View style={styles.paginationContainer}>
                  {documents.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentIndex && styles.paginationDotActive
                      ]}
                    />
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={[styles.navButton, currentIndex === documents.length - 1 && styles.navButtonDisabled]}
                  onPress={goToNext}
                  disabled={currentIndex === documents.length - 1}
                >
                  <Ionicons name="chevron-forward" size={24} color={currentIndex === documents.length - 1 ? "#ccc" : "#007AFF"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          {documents.length > 0 && (
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>{documents[currentIndex].title}</Text>
              <Text style={styles.documentType}>{documents[currentIndex].type.toUpperCase()}</Text>
            </View>
          )}
        </View>
      </>
    );
};

export default ElectronicDocumentView;
