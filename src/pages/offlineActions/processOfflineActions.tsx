import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../../networking/api";
import { MOBILE_API_PATH_REST_LOCALIZE, MOBILE_API_PATH_REST_RECEIVE, MOBILE_API_PATH_REST_RELOCALIZE, RESPONSE_CODE_SUCCESS } from "../../utils/AppConstants";

export async function processOfflineActions(uniqueKey: string, url: string | null, lang: string | null) {
    let storageKey = 'offlineActions_receiveFile_' + uniqueKey;
    let existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: false,
                    fileOrBoxCode: action.code
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_RECEIVE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }

    storageKey = 'offlineActions_receiveBox_' + uniqueKey;
    existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: true,
                    fileOrBoxCode: action.code
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_RECEIVE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }

    storageKey = 'offlineActions_localizeFile_' + uniqueKey;
    existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: false,
                    fileOrBoxCode: action.code,
                    storageCodeAddress: action.storageAddress,
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_LOCALIZE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }

    storageKey = 'offlineActions_localizeBox_' + uniqueKey;
    existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: true,
                    fileOrBoxCode: action.code,
                    storageCodeAddress: action.storageAddress,
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_LOCALIZE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }

    storageKey = 'offlineActions_reLocalizeFile_' + uniqueKey;
    existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: false,
                    fileOrBoxCode: action.code,
                    storageCodeAddress: action.storageAddress,
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_RELOCALIZE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }

    storageKey = 'offlineActions_reLocalizeBox_' + uniqueKey;
    existingData = await AsyncStorage.getItem(storageKey);
    if(existingData) {
        let offlineActions = JSON.parse(existingData);
        if(offlineActions.length > 0) {
            for(let i = 0; i < offlineActions.length; i++) {
                const action = offlineActions[i];
                const data = {
                    uniqueKey: uniqueKey,
                    lang: lang,
                    box: true,
                    fileOrBoxCode: action.code,
                    storageCodeAddress: action.storageAddress,
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_RELOCALIZE, data);
                if(response?.data?.code == RESPONSE_CODE_SUCCESS){
                    offlineActions.splice(i, 1); // Remove the action object from the array
                    i--; // Adjust index after removal
                }
            }
            // Save updated array back to AsyncStorage
            await AsyncStorage.setItem(storageKey, JSON.stringify(offlineActions));
        }
    }
}