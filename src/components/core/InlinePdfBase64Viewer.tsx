import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

const InlinePdfBase64Viewer = ({ fileUri }: { fileUri: string }) => {
  const [base64Pdf, setBase64Pdf] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const base64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64Pdf(base64);
      } catch (err) {
        console.error('Failed to load PDF:', err);
      }
    };

    loadPdf();
  }, [fileUri]);

  if (!base64Pdf) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Loading PDF...</Text>
      </View>
    );
  }

  const dataUri = `data:application/pdf;base64,${base64Pdf}`;

  return (
    <View style={styles.pdfContainer}>
      <WebView
        originWhitelist={['*']}
        source={{ uri: dataUri }}
        style={{ flex: 1 }}
        useWebKit
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pdfContainer: {
    height: 500, // Change to desired height
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loading: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InlinePdfBase64Viewer;