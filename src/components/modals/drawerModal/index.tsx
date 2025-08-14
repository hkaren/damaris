import React, {useState} from 'react';
import {Image, Text, View, FlatList, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from "react-redux";
import {MenuItem} from "../../../Interface";
import {styles} from './styles';
import ImagesPath from "../../../utils/ImagesPath";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import {SvgComponent} from "../../../core/SvgComponent";
import axiosInstance from '../../../networking/api';
import { Styles } from '../../../core/Styles';
import { NAVIGATOR_STACK_SCREEN_LOGOUT } from '../../../utils/AppConstants';

interface DrawerModalProps {
    isVisible: boolean;
    onClose: () => void;
    onChangeSelectTab: (id: number) => void;
    selectedIdTab: number | null;
}

export const DrawerModal: React.FC<DrawerModalProps> = ({
                                                            isVisible,
                                                            onClose,
                                                            onChangeSelectTab,
                                                            selectedIdTab
                                                        }) => {
    const customer = useSelector((store: any) => store.customer);
    const config = useSelector((store: any) => store.config);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const isFocused = useIsFocused();

    const [selectedId, setSelectedId] = useState<number | null>(1);
    const [allowServerCall, setAllowServerCall] = useState<boolean>(true);
    const [followData, setFollowData] = useState<any>([]);

    React.useEffect(() => {
        // When enter to profile tab
        if(navigation?.getState()?.index == 3){
            setAllowServerCall(true);
            setFollowData({followersCount: 0, followingCount: 0});

            loadDrawerModalData();
        }
    }, [isFocused]);

    const loadDrawerModalData = async () => {
        if (allowServerCall) {
            setAllowServerCall(false);
            try {
                const data = {
                    accountId: config.thisAccountId ? config.thisAccountId : customer.accountId,
                    languageId: customer.languageId,
                };
                const response = await axiosInstance.post('PROFILE_URL_GET_REST_PROFILE_DRAWER_MODAL_DATA', data);
                setFollowData(response.data?.result?.resultMapObject);
                
                setAllowServerCall(true);
            } catch (e) {
                console.log(e);
                setAllowServerCall(true);
            }
        }
    };

    const menuArray: MenuItem[] = [
        // {id: 1, navigateTo: 'ProfileAboutHome', title: 'Messages', icon: ImagesPath.messageDrawer},
        // {id: 2, navigateTo: 'ProfileCourse', title: 'Physical archive', icon: ImagesPath.phArchiveDrawer},
        // {id: 3, navigateTo: 'ProfileLesson', title: 'Electronic archive', icon: ImagesPath.elArchiveDrawer},
        // {id: 4, navigateTo: 'ProfileBook', title: 'Search document', icon: ImagesPath.searchDrawer},
        // {id: 5, navigateTo: 'ProfileProject', title: 'Manual task', icon: ImagesPath.manualTaskDrawer},
        // {id: 6, navigateTo: 'ProfileTest', title: 'Offline actions', icon: ImagesPath.offlineActionDrawer},
        // {id: 7, navigateTo: 'ProfileJob', title: 'Generate token', icon: ImagesPath.generateTokenDrawer},
    ];

    const selectLeftMenu = (menuItem: MenuItem) => {
        // setSelectedId(menuItem.id);
        // dispatch({type: 'SET_CONFIG', payload: {profileDrawerActive: menuItem.id}})
        // onChangeSelectTab(menuItem.id)
        // onClose()
        // // @ts-ignore
        // navigation.replace(menuItem.navigateTo);
    };

    // useEffect(() => {
    //     if(selectedIdTab === 2){
    //         setSelectedId(1)
    //         dispatch({type: 'SET_CONFIG', payload: {profileDrawerActive: 1}})
    //
    //     }
    //     // else
    //     //     if (selectedIdTab !== null){
    //     //     setSelectedId(null)
    //     //     dispatch({type: 'SET_CONFIG', payload: {profileDrawerActive: null}})
    //     // }
    // }, [selectedIdTab])

    const renderItem = ({item}: { item: MenuItem }) => {
        const backgroundColor = item.id === config.profileDrawerActive ? '#ffffff' : '#ffffff';
        const borderLeftColor = item.id === config.profileDrawerActive ? '#ffffff' : '#ffffff';
        return (
            <TouchableOpacity onPress={() => selectLeftMenu(item)}
                              style={[styles.drawer_item, {backgroundColor, borderLeftColor, borderLeftWidth: 2}]}>
                <Image
                    source={item.icon}
                    style={styles.drawer_icon}
                    resizeMode="contain"
                />
                <Text style={styles.drawer_text}>{item.title}</Text>
            </TouchableOpacity>
        );
    };


    return (
        <Modal
            testID="modal"
            isVisible={isVisible}
            onSwipeComplete={onClose}
            onBackButtonPress={onClose}
            swipeDirection={['left']}
            statusBarTranslucent
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            style={{margin: 0, justifyContent: 'flex-start', zIndex: 10}}
            onBackdropPress={onClose}
        >
            <TouchableWithoutFeedback>
                <View style={{width: '76%', height: '100%', backgroundColor: '#fff', paddingHorizontal: 10, paddingTop: 20}}>
                    <View style={[Styles.pd_15]}>
                        <View style={[Styles.mt_70, Styles.mb_30]}>
                            <Text style={styles.owner_name}>Karen Hakobyan</Text>
                            <Text style={styles.owner_department}>Department</Text>
                            <Text style={styles.owner_mode}>Online mode</Text>
                        </View>
                        <FlatList
                            data={menuArray}
                            renderItem={renderItem}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    <View style={styles.devider}></View>
                    <View>
                        <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                            id: '100',
                            code: 'settings',
                            navigateTo: 'ProfileAboutHome',
                            title: 'Settings'
                        })} >
                            <Text style={[styles.drawer_text, Styles.ml_70]}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                            id: '101',
                            code: 'about',  
                            navigateTo: 'ProfileAboutHome',
                            title: 'About'
                        })}>
                            <Text style={[styles.drawer_text, Styles.ml_70]}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                            id: '102',
                            code: 'logout',
                            navigateTo: NAVIGATOR_STACK_SCREEN_LOGOUT,
                            title: 'Logout'
                        })}>
                            <Text style={[styles.drawer_text, Styles.ml_70]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
