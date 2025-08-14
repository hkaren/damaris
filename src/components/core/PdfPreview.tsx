import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const PdfPreview = ({ fileUri }: { fileUri: string }) => {
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        console.log('Reading file from:', fileUri);

        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setPdfBase64(base64);
      } catch (err) {
        console.error('Error loading PDF:', err);
        Alert.alert('Error', 'Could not load PDF file.');
      }
    };

    if (fileUri) loadPdf();
  }, [fileUri]);

  if (!pdfBase64) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  const dataUri = `data:application/pdf;base64,${pdfBase64}`;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ uri: dataUri }}
      style={{ flex: 1 }}
      useWebKit
      startInLoadingState
      renderLoading={() => (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default PdfPreview;