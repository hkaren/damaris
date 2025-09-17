import React, {useCallback, useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import Constants from "expo-constants";
import {useDispatch, useSelector} from "react-redux";
import {StatusBar} from 'expo-status-bar';

import MainNavigator from "./navigations/MainNavigator";

import {Provider as PaperProvider} from "react-native-paper";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetwork } from "../src/hook/useNetwork";
import { toast } from "./utils/StaticMethods";
import { useTranslation } from "react-i18next";
import { processOfflineActions } from "./pages/offlineActions/processOfflineActions";

const getOnOffModeFromStorage = async (): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem("onOffMode");
  } catch (error) {
      console.log(error);
      return null;
  }
};

const setOnOffModeIntoStorage = async (onOffMode: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem("onOffMode", onOffMode);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};

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

const APPBAR_HEIGHT = Constants.statusBarHeight;

const MyApp = () => {
//   configureReanimatedLogger({
//     level: ReanimatedLogLevel.warn,
//     strict: true, // Reanimated runs in strict mode by default
//   });
    const userInfo = useSelector((store: any) => store.userInfo);
    const { t } = useTranslation();
    const [isLogged, setIsLogged] = useState(false);
    const dispatch = useDispatch();
    const config = useSelector((store: any) => store.config)
    const { isConnected } = useNetwork();
//     useEffect(() => {
//         setIsLogged(config.isLogin)

//     }, [config]);

    useEffect(() => {
        if (isConnected == null) {
            return;
        }

        const checkOnOffMode = async () => {
            const onOffMode = await getOnOffModeFromStorage();
            
            if (isConnected === false && onOffMode === 'on') {
                toast('error', 'top', 'ERROR!', t('switched_to_off_mode'));
            } else if (isConnected === true && onOffMode === 'off') {
                toast('success', 'top', 'SUCCESS!', t('switched_to_on_mode'));

                const url: string | null = await getUrlFromStorage();
                let lang: string | null = await getLang();

                processOfflineActions(userInfo.uniqueKey, url, lang);
            }
            setOnOffModeIntoStorage(isConnected ? 'on' : 'off');
        };
        checkOnOffMode();
    }, [isConnected]);

    return (
        <GestureHandlerRootView>
         {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
                <PaperProvider>
                    <SafeAreaView edges={['top', 'left', 'right']}
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                            //paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,

                        }}
                    >
                            <StatusBar style={'dark'}/>
                            <MainNavigator/>
                    </SafeAreaView>
                </PaperProvider>
         {/* </TouchableWithoutFeedback> */}
         </GestureHandlerRootView>
    );
};

export default MyApp;
