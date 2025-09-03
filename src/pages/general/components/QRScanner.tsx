import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

type Props = {
  onCode?: (value: string) => void;
  autoOpenUrls?: boolean;      // if true, opens URLs automatically
  vibrateOnScan?: boolean;     // default true
  onBack?: () => void;
};

const isLikelyUrl = (s: string) => {
  try {
    const u = new URL(s);
    return !!u.protocol && !!u.host;
  } catch {
    return /^https?:\/\/.+/i.test(s);
  }
};

export default function QRScanner({
  onCode,
  autoOpenUrls = false,
  vibrateOnScan = true,
  onBack
}: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isActive, setIsActive] = useState(true);
  const [torch, setTorch] = useState(false);
  const lastValue = useRef<string | null>(null);
  const debounceMs = 1200;

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  const handleBarcodeScanned = useCallback(
    (codes: { rawValue?: string }[]) => {
      if (!isActive || !codes?.length) return;
      const value = codes[0]?.rawValue ?? "";
      if (!value || value === lastValue.current) return;
      lastValue.current = value;
      setIsActive(false); // pause to prevent rapid re-fires

      if (vibrateOnScan) Vibration.vibrate(50);

    //   if (autoOpenUrls && isLikelyUrl(value)) {
    //     Linking.openURL(value).catch(() => {});
    //   }
      onCode?.(value);

      // resume after debounce
      setTimeout(() => {
        lastValue.current = null;
        setIsActive(true);
      }, debounceMs);
    },
    [isActive, autoOpenUrls, onCode, vibrateOnScan]
  );

  const mask = useMemo(() => {
    return (
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View style={styles.overlayRow} />
        <View style={styles.overlayCenterRow}>
          <View style={styles.overlayCol} />
          <View style={styles.focusBox} />
          <View style={styles.overlayCol} />
        </View>
        <View style={styles.overlayRow} />
      </View>
    );
  }, []);

  if (!permission) return <View style={styles.center}><Text>Requesting camera permission…</Text></View>;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>We need your permission to use the camera.</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={torch}
        // Barcode scanning API (Expo SDK 51+)
        // @ts-ignore – prop name may vary slightly across SDKs; keep both to be safe
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={
          isActive
            ? (event: any) =>
                handleBarcodeScanned(
                  // normalize shapes from various SDK versions
                  event?.barcodes ?? [{ rawValue: event?.data }]
                )
            : undefined
        }
      />
      {mask}

      <View style={styles.controls}>
        <TouchableOpacity style={styles.pill} onPress={() => onBack?.()}>
          <Text style={styles.pillText}>{"Back"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pill} onPress={() => setTorch(t => !t)}>
          <Text style={styles.pillText}>{torch ? "Turn Torch Off" : "Turn Torch On"}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.pill} onPress={() => setIsActive(a => !a)}>
          <Text style={styles.pillText}>{isActive ? "Pause" : "Resume"}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const BOX = 240;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, marginBottom: 12 },
  btn: { backgroundColor: "#111", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  btnText: { color: "#fff", fontWeight: "600" },

  overlayRow: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  overlayCenterRow: { height: BOX, flexDirection: "row" },
  overlayCol: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  focusBox: {
    width: BOX,
    height: BOX,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 16,
  },

  controls: {
    position: "absolute",
    bottom: Platform.select({ ios: 32, android: 24 }),
    alignSelf: "center",
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
    padding: 8,
    borderRadius: 16,
  },
  pill: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillText: { color: "#fff", fontWeight: "600" },
});