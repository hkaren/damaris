//import * as Device from 'expo-device';
import { Dimensions, Platform } from 'react-native';
import Constants from 'expo-constants';
import { Camera } from 'expo-camera';
import Toast, { ToastPosition } from 'react-native-toast-message';
import * as Application from 'expo-application';
import ImagesPath from './ImagesPath';
import { MenuItem } from '../Interface';
import { NAVIGATOR_STACK_SCREEN_LOGOUT } from './AppConstants';
import BarcodeScanning, { BarcodeFormat } from '@react-native-ml-kit/barcode-scanning';
// choose ONE:
import PdfPageImage from 'react-native-pdf-page-image'; 

export const getDeviceId = async (): Promise<string | null> => {
    if (Platform.OS === 'android') {
      return Application.getAndroidId();
    } else if (Platform.OS === 'ios') {
      return await Application.getIosIdForVendorAsync();
    }
    return null;
};

export const getLocation = () => {
    let data = {
        latitude: "",
        longitude: ""
    };

    
    return data;
};

export const getPlatform = () => {
    return Platform.OS === 'android' ? "ANDROID" : "iOS";
};

export const toast = (type: string, position: ToastPosition, text1: string, text2: string) => {
    Toast.show({
        type: type,
        position: position,
        text1: text1,
        text2: text2,
        visibilityTime: 3000,
        autoHide: true,
        onShow: () => {},
        onHide: () => {}
    });
};

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^(([a-zA-Z0-9-_\"+\"]+(\\.[a-zA-Z0-9]+)*)+(\\-[a-zA-Z0-9]+)*|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3})|(([a-zA-Z0-9])+(\\-[a-zA-Z0-9]+)*(\\.[a-zA-Z0-9-]+)*(\\.[a-zA-Z]{2,})+))/;
    return emailRegex.test(email.toLowerCase());
};

export const isValidUrl = (url: string): boolean => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
};


const windowWidth = Dimensions.get('window').width; // fixed width for this example
const charWidthEstimate = 7; // assume 7px per character (monospace-like)
const maxCharsPerLine = Math.floor(windowWidth / charWidthEstimate);
export const splitIntoLines = (input: string) => {
    const parts = input.split(';').map(p => p.trim()).filter(Boolean);

    const lines = ["", "", ""];
    let lineIdx = 0;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const candidate = lines[lineIdx] ? `${lines[lineIdx]}; ${part}` : part;

      if (candidate.length <= maxCharsPerLine || lineIdx === 2) {
        lines[lineIdx] = candidate;
      } else {
        lineIdx++;
        if (lineIdx > 2) break;
        lines[lineIdx] = part;
      }
    }

    // Add remaining parts to line 3
    if (lineIdx < parts.length - 1 && lineIdx < 2) {
      const consumedParts = lines.slice(0, 2).join("; ").split(";").length;
      lines[2] = parts.slice(consumedParts).join("; ");
    }

    return lines;
};

export const getMenuItemsArray = (t: (key: string) => string): MenuItem[] => [
  {id: '1', code: "Messages", navigateTo: 'Messages', title: t('fragment_messages_title'), icon: ImagesPath.messageDrawer},
  {id: '2', code: "PhysicalArchiveManagementFromMobile", navigateTo: 'PhysicalArchive', title: t('menu_item_physical_archive'), icon: ImagesPath.phArchiveDrawer},
  {id: '3', code: "ElectronicDocumentArchivingFromMobile", navigateTo: 'ElectronicArchive', title: t('menu_item_electronic_archive'), icon: ImagesPath.elArchiveDrawer},
  {id: '4', code: "SearchDocumentsFromMobile", navigateTo: 'SearchDocument', title: t('menu_item_search_document'), icon: ImagesPath.searchDrawer},
  {id: '5', code: "ManualTasksFromMobile", navigateTo: 'ManualTask', title: t('menu_item_manual_task'), icon: ImagesPath.manualTaskDrawer},
  {id: '6', code: "OfflineActions", navigateTo: 'OfflineActions', title: t('menu_item_offline_actions'), icon: ImagesPath.offlineActionDrawer},
  {id: '7', code: "GenerateToken", navigateTo: 'GenerateToken', title: t('menu_item_generate_token'), icon: ImagesPath.generateTokenDrawer},
  {id: '100',code: "Settings", navigateTo: 'Settings', title: t('menu_item_settings')},
  {id: '101',code: "About", navigateTo: 'About', title: t('menu_item_aboutUs')},
  {id: '102',code: "Logout", navigateTo: NAVIGATOR_STACK_SCREEN_LOGOUT, title: t('menu_item_logout')}
];


/** Parse "yyyyMMddHHmm" into a JS Date */
export const parseYyyyMMddHHmm = (s: string): Date | null => {
  if (!/^\d{12}$/.test(s)) return null;

  const year = Number(s.slice(0, 4));
  const month = Number(s.slice(4, 6)) - 1; // JS months: 0–11
  const day = Number(s.slice(6, 8));
  const hour = Number(s.slice(8, 10));
  const minute = Number(s.slice(10, 12));

  const d = new Date(year, month, day, hour, minute, 0, 0);

  // Check validity (avoid overflow like 20260231 → Mar 2)
  if (
    d.getFullYear() !== year ||
    d.getMonth() !== month ||
    d.getDate() !== day ||
    d.getHours() !== hour ||
    d.getMinutes() !== minute
  ) {
    return null;
  }

  return d;
}

export async function readQrFromFirstPage(pdfUri: any): Promise<string | null> {

  // Render first page to an image (higher scale ⇒ clearer QR)
  const { uri: imgUri } = await PdfPageImage.generate(pdfUri, /*page*/ 0, /*scale*/ 2.0);
  // If using react-native-pdf-thumbnail instead:
  // const { uri: imgUri } = await PdfThumbnail.generate(pdfUri, /*page*/ 0, /*quality*/ 90);

  // Scan image for barcodes and filter to QR
  const barcodes = await BarcodeScanning.scan(imgUri);
  console.log(barcodes, ' /// barcodes');
  
  const isQr = (b: any) =>
    b?.format === BarcodeFormat.QR_CODE || b?.format === 256 || b?.format === 'QR_CODE';
  
  const qr = barcodes.find(isQr) ?? barcodes[0]; // fallback to first if you restricted formats
  const raw = (qr?.value ?? '').trim();
  
  return raw || null;          // value is the decoded text/URL
}