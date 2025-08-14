import React, { useState, useRef } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Image,
    FlatList,
    Linking,
    Alert,
} from "react-native";
import Modal from "react-native-modal";
import {styles} from "./styles";
import { SvgComponent } from "../../../core/SvgComponent";
import { Ionicons } from '@expo/vector-icons';

interface ElectronicDocViewModalProps {
    isVisible: boolean;
    showHideInfo: () => void;
    fieldInfoTitle: any;
    documents?: Array<{
        id: string;
        type: 'image' | 'pdf';
        url: string;
        title?: string;
    }>;
}

const { width: screenWidth } = Dimensions.get('window');

export const ElectronicDocViewModal: React.FC<ElectronicDocViewModalProps> = ({
                                                isVisible,
                                                showHideInfo,
                                                fieldInfoTitle,
                                                documents = []
                                            }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const goToNext = () => {
        if (currentIndex < documents.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
        }
    };

    const openPDF = (url: string, title?: string) => {
        Alert.alert(
            'Open PDF',
            `Would you like to open "${title || 'Document'}" in your browser?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Open',
                    onPress: () => {
                        Linking.openURL(url).catch(err => {
                            Alert.alert('Error', 'Could not open the PDF file');
                        });
                    },
                },
            ]
        );
    };

    const renderDocument = ({ item, index }: { item: any; index: number }) => {
        return (
            <View style={styles.documentContainer}>
                {item.type === 'image' ? (
                    <Image 
                        source={{ uri: item.url }} 
                        style={styles.documentImage}
                        resizeMode="contain"
                    />
                ) : (
                    <View style={styles.pdfContainer}>
                        {/* <View style={styles.pdfPreview}>
                            <Ionicons name="document-text" size={80} color="#e74c3c" />
                            <Text style={styles.pdfText}>PDF Document</Text>
                            <Text style={styles.pdfTitle}>{item.title || 'Document'}</Text>
                            <TouchableOpacity 
                                style={styles.openPdfButton}
                                onPress={() => openPDF(item.url, item.title)}
                            >
                                <Ionicons name="open-outline" size={20} color="white" />
                                <Text style={styles.openPdfButtonText}>Open PDF</Text>
                            </TouchableOpacity>
                        </View> */}
                        
                    </View>
                )}
            </View>
        );
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    return (
        <Modal
            testID={"modal"}
            isVisible={isVisible}
            style={styles.containerModal}
            statusBarTranslucent>
                <View style={styles.container}>
                    <View style={styles.title_area}>
                        <SvgComponent name="field_title_info" cssClass={[styles.icon]} color="#555555" />
                        <Text style={styles.title}>{fieldInfoTitle}</Text>
                        <TouchableOpacity onPress={showHideInfo} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#555555" />
                        </TouchableOpacity>
                    </View>

                    {documents.length > 0 ? (
                        <View style={styles.carouselContainer}>
                            <FlatList
                                ref={flatListRef}
                                data={documents}
                                renderItem={renderDocument}
                                keyExtractor={(item) => item.id}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onViewableItemsChanged={onViewableItemsChanged}
                                viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                            />
                            
                            {documents.length > 1 && (
                                <>
                                    <View style={styles.navigationContainer}>
                                        <TouchableOpacity 
                                            onPress={goToPrevious}
                                            disabled={currentIndex === 0}
                                            style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
                                        >
                                            <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? "#ccc" : "#555555"} />
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
                                            onPress={goToNext}
                                            disabled={currentIndex === documents.length - 1}
                                            style={[styles.navButton, currentIndex === documents.length - 1 && styles.navButtonDisabled]}
                                        >
                                            <Ionicons name="chevron-forward" size={24} color={currentIndex === documents.length - 1 ? "#ccc" : "#555555"} />
                                        </TouchableOpacity>
                                    </View>
                                    
                                    <Text style={styles.counterText}>
                                        {currentIndex + 1} / {documents.length}
                                    </Text>
                                </>
                            )}
                        </View>
                    ) : (
                        <View style={styles.noDocumentsContainer}>
                            <Ionicons name="document-outline" size={60} color="#ccc" />
                            <Text style={styles.noDocumentsText}>No documents available</Text>
                        </View>
                    )}
                </View>
        </Modal>
    );
};


