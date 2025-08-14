import React, { useState } from "react";
import {
    View,
    Text,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import Modal from "react-native-modal";
import {styles} from "./styles";
import { SvgComponent } from "../../../core/SvgComponent";
import { Styles } from "../../../core/Styles";
import { InputOutlined } from "../../core/InputOutlined";
import { useTranslation } from "react-i18next";
import { Button } from "../../Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import axiosInstance from "../../../networking/api";
import { MOBILE_API_PATH_REST_TASK_CHANGE_STATE } from "../../../utils/AppConstants";

interface FieldInfoModalProps {
    isVisible: boolean;
    manualTaskID: string;
    showHideInfo: () => void;
    finishCallback: (taskItem: any) => void;
}

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

export const ManualTaskModal: React.FC<FieldInfoModalProps> = ({
                                                isVisible,
                                                manualTaskID,
                                                showHideInfo,
                                                finishCallback
                                            }) => {
    const { t } = useTranslation();
    const userInfo = useSelector((store: any) => store.userInfo);
    const [unit, setUnit] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);

    const doFinish = async () => {
        if (allowServerCall) {
            Keyboard.dismiss();
            setAllowServerCall(false);

            const url: string | null = await getUrl();
            const lang: string | null = await getLang();

            try {
                const data = {
                    uniqueKey: userInfo.uniqueKey,
                    lang: lang,
                    manualTaskID: manualTaskID,
                    state: 2,
                    unit: unit,
                    comment: comment
                };
                const response = await axiosInstance.post(url + MOBILE_API_PATH_REST_TASK_CHANGE_STATE, data);
                finishCallback(response.data.tasks[0]);
                setAllowServerCall(true);
            } catch (e) {
                console.log(e);
                setAllowServerCall(true);
            }
        }
    }

    return (
        <Modal
            testID={"modal"}
            isVisible={isVisible}
            swipeDirection={['down']}
            onSwipeComplete={showHideInfo}
            onBackdropPress={showHideInfo}
            style={styles.containerModal}
            statusBarTranslucent>
                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <KeyboardAvoidingView
                    style={{flex: 1, justifyContent: 'flex-end'}}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} >

                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.container}>
                                <View style={Styles.mt_10}>
                                    <InputOutlined
                                        label={t('mt_execution_result')}
                                        value={unit}
                                        keyboardType="numeric"
                                        onChange={(value) => {
                                            setUnit(value)
                                        }} />
                                </View>
                                <View style={Styles.mt_10}>
                                    <InputOutlined
                                        label={t('label_comment')}
                                        value={comment}
                                        multiline
                                        fieldCss={[styles.comment]}
                                        onChange={(value) => {
                                            setComment(value)
                                        }} />
                                </View>
                                <View style={[Styles.mt_10, {flexDirection: 'row'}]}>
                                    <Button variant="general" title={t('save')} onClickHandler={() => doFinish()} />
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </View>
        </Modal>
    );
};


