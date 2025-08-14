import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { DrawerNavigationProps, MenuItem } from '../../Interface';
import { SvgComponent } from '../../core/SvgComponent';
import { Styles } from '../../core/Styles';
import { NAVIGATOR_STACK_SCREEN_LOGOUT } from '../../utils/AppConstants';
import ImagesPath from '../../utils/ImagesPath';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const setMenuRatingIntoStorage = async (code: string, counter: string): Promise<string | null> => {
  try {
      await AsyncStorage.setItem(code, counter);
      return null
  } catch (error) {
      console.log(error);
      return null;
  }
};

const getMenuRatingByCode = async (code: string): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem(code);
  } catch (error) {
      console.log(error);
      return null;
  }
};

const CustomDrawer = (props: any) => {
  const config = useSelector((store: any) => store.config);
  const userInfo = useSelector((store: any) => store.userInfo);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [menuArray, setMenuArray] = useState<MenuItem[]>([]);
  const isDrawerOpen = useDrawerStatus() === 'open';
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSelectedId(config?.profileDrawerActiveSubId ? config.profileDrawerActiveSubId : '2.0');
  }, [isDrawerOpen]);

  useEffect(() => {
    setSelectedId('');
    initData();
  }, [config.profileDrawerActiveCode]);

  const selectLeftMenu = async (menuItem: MenuItem) => {
    const counter = await getMenuRatingByCode(menuItem.code);
    
    setMenuRatingIntoStorage(menuItem.code, counter ? (parseInt(counter) + 1)+'' : '1');
    
    setSelectedId(menuItem.id);

    if (config.profileDrawerActiveCode === 'PhysicalArchiveManagementFromMobile') {
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            profileDrawerActiveSubId: menuItem.id,
            profileDrawerActiveSubCode: menuItem.code,
            profileDrawerActiveSubTitle: menuItem.title,
            profileDrawerActiveTitle: menuItem.title
          }
        });
        props.navigation.navigate('PhysicalArchive', { randomKey: Math.random(), actionType: 'nenu' });
    } else {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveId: menuItem.id,
          profileDrawerActiveCode: menuItem.code,
          profileDrawerActiveTitle: menuItem.code === 'PhysicalArchiveManagementFromMobile' ? t('menu_item_damarisPredict') : menuItem.title,
        }
      });
      // onChangeSelectTab(menuItem.id)
      // onClose()
      // @ts-ignore
      props.navigation.navigate(menuItem.navigateTo, { randomKey: Math.random(), actionType: 'nenu' });
    }
  };

  const menuArray_: MenuItem[] = [
    {id: '1', code: "Messages", navigateTo: 'Messages', title: t('fragment_messages_title'), icon: ImagesPath.messageDrawer},
    {id: '2', code: "PhysicalArchiveManagementFromMobile", navigateTo: 'PhysicalArchive', title: t('menu_item_physical_archive'), icon: ImagesPath.phArchiveDrawer},
    {id: '3', code: "ElectronicDocumentArchivingFromMobile", navigateTo: 'ElectronicArchive', title: t('menu_item_electronic_archive'), icon: ImagesPath.elArchiveDrawer},
    {id: '4', code: "SearchDocumentsFromMobile", navigateTo: 'SearchDocument', title: t('menu_item_search_document'), icon: ImagesPath.searchDrawer},
    {id: '5', code: "ManualTasksFromMobile", navigateTo: 'ManualTask', title: t('menu_item_manual_task'), icon: ImagesPath.manualTaskDrawer},
    {id: '6', code: "OfflineActions", navigateTo: 'OfflineActions', title: t('menu_item_offline_actions'), icon: ImagesPath.offlineActionDrawer},
    {id: '7', code: "GenerateToken", navigateTo: 'GenerateToken', title: t('menu_item_generate_token'), icon: ImagesPath.generateTokenDrawer},
  ];

  const initData = () => {
    if (config.profileDrawerActiveCode === 'PhysicalArchiveManagementFromMobile') {
      const menuArray_physicalArchive: MenuItem[] = [
        {id: '2.0', code: "DmarisPredict", navigateTo: 'DmarisPredict', title: t('menu_item_damarisPredict'), icon: null},
        {id: '2.1', code: "ReceiveBox", navigateTo: 'ReceiveBox', title: t('menu_item_receiveBox'), icon: null},
        {id: '2.2', code: "ReceiveFiles", navigateTo: 'ReceiveFiles', title: t('menu_item_receiveFile'), icon: null},
        {id: '2.3', code: "LocalizeBox", navigateTo: 'LocalizeBox', title: t('menu_item_localizeBox'), icon: null},
        {id: '2.4', code: "LocalizeFiles", navigateTo: 'LocalizeFiles', title: t('menu_item_localizeFile'), icon: null},
        {id: '2.5', code: "ReLocalizeBox", navigateTo: 'ReLocalizeBox', title: t('menu_item_relocalizeBox'), icon: null},
        {id: '2.6', code: "ReLocalizeFiles", navigateTo: 'ReLocalizeFiles', title: t('menu_item_relocalizeFile'), icon: null},
        {id: '2.7', code: "PackagingBox", navigateTo: 'PackagingBox', title: t('menu_item_packagingBox'), icon: null},
        {id: '2.8', code: "PackagingFiles", navigateTo: 'PackagingFiles', title: t('menu_item_packagingFile'), icon: null},
      ];

      setMenuArray(menuArray_physicalArchive);
    } else {
      initManuArray();
    }
  };

  const initManuArray = () => {
    // Filter menuArray_ to only show items that user has permissions for
    if (userInfo?.permissions && Array.isArray(userInfo.permissions)) {
      const filteredMenu = menuArray_.filter(item => {
        // Only check permissions for items whose code ends with "FromMobile"
        if (item.code.endsWith('FromMobile')) {
          return userInfo.permissions.some((permission: any) => permission.code === item.code);
        }
        // For other items (like "Messages", "OfflineActions"), always show them
        return true;
      });
      setMenuArray(filteredMenu);
    } /*else {
      // If no permissions or permissions array doesn't exist, show all menu items
      setMenuArray(menuArray_);
    }*/
  };

  const backToStandardMenu = () => {
    if (isConnected) {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveId: '1',
          profileDrawerActiveCode: 'Messages',
          profileDrawerActiveTitle: t('fragment_messages_title')
        }
      });
      setSelectedId('');
      initManuArray();
      props.navigation.navigate("Messages", { randomKey: Math.random(), actionType: 'nenu' });
    } else {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveId: '6',
          profileDrawerActiveCode: 'OfflineActions',
          profileDrawerActiveTitle: t('menu_item_offline_actions')
        }
      });
      setSelectedId('');
      initManuArray();
      props.navigation.navigate("OfflineActions", { randomKey: Math.random(), actionType: 'nenu' });
    }
  };

  const renderItem = ({item}: { item: MenuItem }) => {
    const backgroundColor = item.id === config.profileDrawerActive ? '#ffffff' : '#ffffff';
    const borderLeftColor = item.id === config.profileDrawerActive ? '#ffffff' : '#ffffff';
    return (
        <TouchableOpacity onPress={() => selectLeftMenu(item)}
                          style={[
                              styles.drawer_item, 
                              {backgroundColor, borderLeftColor, borderLeftWidth: 2},
                              ((selectedId && selectedId === item.id) || (selectedId === '' && config.profileDrawerActiveCode === 'PhysicalArchiveManagementFromMobile' && item.id === '2.0')) ? styles.selected_item : null,
                          ]}>
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
    // <DrawerContentScrollView {...props}> 
      <View style={styles.container}>
          {config.profileDrawerActiveCode === 'PhysicalArchiveManagementFromMobile' ?
            <TouchableOpacity style={styles.backButton} onPress={() => backToStandardMenu()}>
                <SvgComponent name="back" color="black" />
            </TouchableOpacity>
            : null
          }
          <View style={[Styles.pd_15]}>
              <View style={[config.profileDrawerActiveCode === 'PhysicalArchiveManagementFromMobile' ? null : Styles.mt_70, Styles.mb_30]}>
                  <Text style={styles.owner_name}>{userInfo.account.firstName} {userInfo.account.lastName}</Text>
                  <Text style={styles.owner_department}>{userInfo.departments[0].departmentName}</Text>
                  { isConnected ? 
                    <Text style={styles.online_mode}>{t('on_mode')}</Text>
                    :
                    <Text style={styles.offline_mode}>{t('off_mode')}</Text>
                  }
              </View>
              <FlatList
                  data={menuArray}
                  renderItem={renderItem}
                  showsHorizontalScrollIndicator={false}
              />
          </View>
          { config.profileDrawerActiveCode != 'PhysicalArchiveManagementFromMobile' ? 
            <>
              <View style={styles.devider}></View>
              <View>
                  <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                      id: '100',
                      code: "Settings",
                      navigateTo: 'Settings',
                      title: t('menu_item_settings')
                  })} >
                      <Text style={[styles.drawer_text, Styles.ml_70]}>{t('menu_item_settings')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                      id: '101',
                      code: "About",
                      navigateTo: 'About',
                      title: t('menu_item_aboutUs')
                  })}>
                      <Text style={[styles.drawer_text, Styles.ml_70]}>{t('menu_item_aboutUs')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.drawer_item]} onPress={() => selectLeftMenu({
                      id: '102',
                      code: "Logout",
                      navigateTo: NAVIGATOR_STACK_SCREEN_LOGOUT,
                      title: t('menu_item_logout')
                  })}>
                      <Text style={[styles.drawer_text, Styles.ml_70]}>{t('menu_item_logout')}</Text>
                  </TouchableOpacity>
              </View>
            </>
            : null
          }
        {/* <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
        </View>
        
        <View style={styles.drawerContent}>
          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => props.navigation.navigate('Home')}
          >
            <SvgComponent name="home" color="#333" />
            <Text style={styles.drawerItemText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => props.navigation.navigate('Settings')}
          >
            <SvgComponent name="settings" color="#333" />
            <Text style={styles.drawerItemText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.drawerItem} 
            onPress={() => props.navigation.navigate('Logout')}
          >
            <SvgComponent name="logout" color="#333" />
            <Text style={styles.drawerItemText}>Logout</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    // </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
  },
  // header: {
  //   height: 150,
  //   backgroundColor: '#2196F3',
  //   justifyContent: 'flex-end',
  //   padding: 20,
  // },
  // headerTitle: {
  //   color: '#fff',
  //   fontSize: 24,
  //   fontWeight: 'bold',
  // },
  // drawerContent: {
  //   padding: 20,
  // },
  // drawerItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 15,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',
  // },
  // drawerItemText: {
  //   marginLeft: 15,
  //   fontSize: 16,
  //   color: '#333',
  // },

  drawer_item: {
    height: 44,
    alignItems: 'center',
    flexDirection: 'row'
  },
  drawer_icon: {
      width: 24,
      height: 24,
      resizeMode: "contain",
  },
  drawer_text: {
      marginLeft: 30,
      color: 'black',
      fontSize: 20,
      fontWeight: '500',
  },
  w_100: {
      width: 100
  },
  owner_name: {
      fontSize: 20,
      fontWeight: '700',
      color: 'black',
  },
  owner_department: {
      fontSize: 14,
      fontWeight: '400',
      color: 'black',
      marginTop: 5,
      marginBottom: 5,
  },
  online_mode: {
      fontSize: 14,
      fontWeight: '400',
      color: '#00FF00',
  },
  offline_mode: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FF0000',
  },
  devider: {
      height: 1,
      backgroundColor: '#bbbbbb',
      marginVertical: 10,
  },
  selected_item: {
    backgroundColor: '#ebebeb',
    borderRadius: 30,
  }
});

export default CustomDrawer; 