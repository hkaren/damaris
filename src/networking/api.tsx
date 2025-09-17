import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

import { MOBILE_API_PATH_REST} from "../utils/AppConstants";

const HTTP_RESPONSE_CODE_INTERNAL_ERROR: string = "0002"

const getToken = async (): Promise<string | null> => {
    try {
        const token = await AsyncStorage.getItem("token");
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const axiosInstance: AxiosInstance = axios.create({
    baseURL: MOBILE_API_PATH_REST,
    timeout: 1000000,
});

axiosInstance.interceptors.request.use(
    async (config: any) => {
        const token = await getToken();
        if (token) {
            if (config.headers) { // Type guard to ensure config.headers is defined
                config.headers.token = `${token}`;
            } else {
                config.headers = { token: `${token}` };
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use( async (response) => {
    if (response?.data?.result?.code == HTTP_RESPONSE_CODE_INTERNAL_ERROR || response?.data?.code == HTTP_RESPONSE_CODE_INTERNAL_ERROR) {
        let message = response?.data?.result?.message ? response?.data?.result?.message  : response?.data?.message ? response?.data?.message :  'Oops! something went with the process. Please try it again.'
        Toast.show({
            type: 'error',
            position: 'top',
            text1: 'Response Error!',
            text2: message,
            visibilityTime: 3000,
            autoHide: true,
            onShow: () => {},
            onHide: () => {}
        });
        console.log(response, 'response-error');
        return Promise.reject({message: 'Error status 0002'})
    }
    return response;
}, (error) =>  {
    console.log('AXIOS ERROR MESSAGE:', error?.message);
    console.log('AXIOS ERROR STATUS:', error?.response?.status);
    console.log('AXIOS ERROR DATA:', JSON.stringify(error?.response?.data));
    console.log('AXIOS ERROR URL:', error?.config?.url);

    
    Toast.show({
        type: 'error',
        position: 'top',
        text1: 'ERROR!',
        text2: 'Oops! something went with the process. Please try it again.',
        visibilityTime: 3000,
        autoHide: true,
        onShow: () => {},
        onHide: () => {}
    });
    return Promise.reject(error);
})

export default axiosInstance;
