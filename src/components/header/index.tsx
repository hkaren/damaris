import { Text, TouchableOpacity, View } from "react-native"
import { MainTabScreenHeaderProps } from "../../Interface"
import { styles } from "./styles"
import { SvgComponent } from "../../core/SvgComponent"
import { Styles } from "../../core/Styles"
import { useContext, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

export const Header = (props: MainTabScreenHeaderProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const config = useSelector((store: any) => store.config);
    const userInfo = useSelector((store: any) => store.userInfo);

    const [showBack, setShowBack] = useState(false);

    const goBackToChat = () => {
        //context.CurrentProfileInfo.accountId = context.UserInfo.accountId;
        //context.CurrentProfileInfo.userName = context.UserInfo.userName;
        props.navigation.goBack();
    };

    const openBottomModal = () => {
        let types = [];

        if(props.type == 'offline_actions'){
            types = [
                {key: 'delete', title: 'Delete'},
                {key: 'cleanup', title: 'Cleanup'},
            ];
        } else {
            types = [
                {key: 'all_messages', title: 'All messages'},
                {key: 'new_message', title: 'New message'},
                {key: 'storage_info', title: 'Storage info'},
            ];
        }

        dispatch({
            type: 'SET_CONFIG',
            payload: { bottomHalfModal: true, bottomHalfModalData: {type: types, callbackFunction: openBottomModalCallback, callbackFunctionParams: null} }
        });
    };

    const openBottomModalCallback = async (action: string, item: any) => {
        if (action == 'all_messages') { 
            allMessages();
        } else if (action == 'new_message') {
            newMessage();
        } else if (action == 'storage_info') {
            storageInfo();
        } else if (action == 'delete') {
            props.callBackFunction?.('delete');
        } else if (action == 'cleanup') {
            props.callBackFunction?.('cleanup');
        }
    };

    const allMessages = () => {
        props.navigation.navigate('Messages', { randomKey: Math.random(), actionType: 'all-messages' });
    };

    const newMessage = () => {
        dispatch({
            type: 'SET_CONFIG',
            payload: {
              profileDrawerActiveId: 221,
              profileDrawerActiveCode: "MessagesNew",
              profileDrawerActiveTitle: t('word_new_message'),
            }
        });
        props.navigation.navigate('MessagesNew', {randomKey: Math.random()});
    };

    const storageInfo = () => {
        console.log('storageInfo');
    };

    const openDrawer = () => {
        props.navigation.openDrawer();
    };

    const openMessenger = () => {
        //props.navigation.navigate(NAVIGATOR_STACK_SCREEN_MESSENGER);
    };

    return (
        <View style={styles.HeaderArea}>
            <View style={styles.HeaderAreaInner}>
                <View style={styles.HeaderAreaInnerLeft}>
                    <View style={styles.HeaderAreaInnerLeftInner}>
                        {props.type == 'back_callback' ?    
                            <TouchableOpacity style={styles.HamburgerIcon} onPress={props.backCallbackFunction}>
                                <SvgComponent name='back'/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.HamburgerIcon} onPress={openDrawer}>
                                <SvgComponent name='hamburger'/>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={styles.HeaderAreaInnerCenter}>
                    <Text style={styles.HeaderAreaInnerCenterText}>{config.profileDrawerActiveTitle}</Text>
                </View>
                <View style={styles.HeaderAreaInnerRight}>
                    <View style={styles.HeaderAreaInnerRightInner}>
                        <View></View>
                        <View style={styles.flex_d_row}>
                            { !props.hideMoreIcon ?
                                <TouchableOpacity style={Styles.IconButton}
                                                    onPress={openBottomModal}>
                                    <SvgComponent name="more_vertical"/>
                                </TouchableOpacity>
                                : 
                                <View style={{width: 44}}></View>
                            }
                            {/* <TouchableOpacity style={Styles.IconButton} onPress={() => openMessenger()}>
                                <SvgComponent name="message"/>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
