import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from "react-redux";

import BottomSheet from "@gorhom/bottom-sheet";
import { styles } from './styles';
import { Styles } from '../../../core/Styles';
import { Link } from '../../core/Link';

interface Props {
    isVisible: boolean;
    navigation: any;
    onClose: () => void;
}

export const BottomHalfModal: React.FC<Props> = ({isVisible, onClose, navigation}) => {
    const config = useSelector((store: any) => store.config);
    const dispatch = useDispatch()
    const [scrollView, setScrollView] = useState<any>('down');
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(false);

    let snapPoints;
    let type: any = config.bottomHalfModalData.type;
    let callbackFunction: any = config.bottomHalfModalData.callbackFunction;
    let callbackFunctionParams: any = config.bottomHalfModalData.callbackFunctionParams;

    snapPoints = ['30%', '80%'];

    useEffect(() => {
        setIsOpen(false);
        bottomSheetRef?.current?.snapToIndex(-1);
    }, []);
    useEffect(() => {
        if (isOpen) {
            bottomSheetRef?.current?.snapToIndex(0);
        }
    }, [isOpen]);


    const doAction = (action: string, callbackFunction: any, callbackFunctionParams: any) => {
        if(action == 'edit'){
            dispatch({
                type: 'SET_CONFIG',
                payload: {
                    bottomHalfModal: false,
                    bottomHalfModalData: {
                        actionType: action,
                        callbackFunctionParams
                    }
                }
            });
        } else {
            dispatch({
                type: 'SET_CONFIG',
                payload: {
                    bottomHalfModal: false,
                    bottomHalfModalData: {}
                }
            });
            callbackFunction(action, callbackFunctionParams);
        }
    };

    useEffect(() => {
        if (!config?.bottomHalfModalData?.scroll) {
            setScrollView('down')
        }
        return setScrollView(undefined)
    }, [config]);

    const _renderBottomMenus = () => {
        if(typeof type !== 'string'){
            return type?.map((menu: any, index: number) => {
                return (
                    <View key={index}>
                        <View style={[Styles.t_a_c]}>
                            <Link
                                onClickHandler={() => doAction(menu?.key, callbackFunction, callbackFunctionParams)}
                                className={[Styles.h_30, Styles.flex_d_row, Styles.h_44, Styles.t_a_c, Styles.w_100p]}
                                textClassName={[Styles.fs_20]} title={menu?.title}/>
                        </View>
                    </View>
                )
            })
        }
    }

    return (
        <Modal
            testID={'modal'}
            isVisible={isVisible}
            onSwipeComplete={onClose}
            onBackdropPress={onClose}
            swipeDirection={'down'}
            animationOutTiming={500}
            animationInTiming={300}
            style={styles.containerModal}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={Styles.pt_15}>
                    {_renderBottomMenus()}
                </View>
            </View>
        </Modal>
    );
}
