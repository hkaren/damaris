import React, {FC, useEffect, useState} from 'react';
import {View, Text, useWindowDimensions, Dimensions, Keyboard} from 'react-native';
import { useIsFocused} from '@react-navigation/native';

import { TabBar, TabView } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import DamarisPredict from './tabs/DamarisPredict';
import { RouteProp } from '@react-navigation/native';
import styles from './styles';
import { Styles } from '../../core/Styles';
import { Header } from '../../components';
import ReceiveBox from './tabs/ReceiveBox';
import ReceiveFiles from './tabs/ReceiveFiles';
import LocalizeBox from './tabs/LocalizeBox';
import LocalizeFiles from './tabs/LocalizeFiles';
import ReLocalizeBox from './tabs/ReLocalizeBox';
import ReLocalizeFiles from './tabs/ReLocalizeFiles';
import PackagingBox from './tabs/PackagingBox';
import PackagingFiles from './tabs/PackagingFiles';
import { useTranslation } from 'react-i18next';
import QRScanner from '../general/components/QRScanner';

type PhysicalArchiveProps = {
    navigation: any;
    route: RouteProp<Record<string, any>, string>;
};

const height = Dimensions.get("window").height;

export const PhysicalArchive: FC<PhysicalArchiveProps> = (props: PhysicalArchiveProps) => {
  const { t } = useTranslation();
    const customer = useSelector((store: any) => store.customer);
    const config = useSelector((store: any) => store.config);
    const isFocused = useIsFocused();
    const layout = useWindowDimensions();
    const [index, setIndex] = useState<number>(0);
    const [type, setType] = useState('videos');
    const [showDescriptionModal, setShowDescriptionModal] = useState<boolean>(false);
    const [modalDescription, setModalDescription] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const dispatch = useDispatch();
    const [showQrScanner, setShowQrScanner] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<Record<string, string>>({});
    const [scannerFor, setScannerFor] = useState<string>('');

    const {height: windowHeight} = useWindowDimensions();
    
    /*useEffect(() => {
      console.log(' //////////////////000000000000');
      if (config?.profileDrawerActiveSubId && typeof config.profileDrawerActiveSubId === 'string') {
        const subId = config.profileDrawerActiveSubId.substring(2);
        console.log(subId, 'subId');
        
        setIndex(Number(subId));
      } else {
        console.log(' //////////////////11111111');
        
        setIndex(0); // Default to first tab if no valid subId
      }
    }, [config?.profileDrawerActiveSubId]);*/

    useEffect(() => {
      setTimeout(() => {
        if (config?.profileDrawerActiveSubId && typeof config.profileDrawerActiveSubId === 'string') {
          const subId = config.profileDrawerActiveSubId.substring(2);
          setIndex(Number(subId));
        } else {
          setIndex(0); // Default to first tab if no valid subId
        }
      }, 100);
    }, [props.route.params]);

    useEffect(() => {
      dispatch({
        type: 'SET_CONFIG',
        payload: {
          profileDrawerActiveSubId: "2." + index
        }
      });
    }, [index]);

    const openScanner = (scannerFor: string) => {
      Keyboard.dismiss();
      setShowQrScanner(true);
      setScannerFor(scannerFor);
    };

    const renderScene = ({route}: { route: { key: string, title: string } }) => {
        switch (route.key) {
            case 'DmarisPredict':
                return <DamarisPredict navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['dp'] ?? ''} />
            case 'ReceiveBox':
                return <ReceiveBox navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['rb'] ?? ''} />
            case 'ReceiveFiles':
                return <ReceiveFiles navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['rf'] ?? ''} />
            case 'LocalizeBox':
                return <LocalizeBox navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['lb'] ?? ''} qrCodeStorageAddress={qrCode['lb_sa'] ?? ''} />
            case 'LocalizeFiles':
                return <LocalizeFiles navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['lf'] ?? ''} qrCodeStorageAddress={qrCode['lf_sa'] ?? ''} />
            case 'ReLocalizeBox':
                return <ReLocalizeBox navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['rlb'] ?? ''} qrCodeStorageAddress={qrCode['rlb_sa'] ?? ''} />
            case 'ReLocalizeFiles':
                return <ReLocalizeFiles navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['rlf'] ?? ''} qrCodeStorageAddress={qrCode['rlf_sa'] ?? ''} />
            case 'PackagingBox':
                return <PackagingBox navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['pb'] ?? ''} qrCodeStorageAddress={qrCode['pb_sa'] ?? ''} />
            case 'PackagingFiles':
                return <PackagingFiles navigation={props.navigation} route={props.route} openScanner={openScanner} qrCode={qrCode['pf'] ?? ''} qrCodeStorageAddress={qrCode['pf_sa'] ?? ''} />
        }
    };

    const [routes] = React.useState([
        {key: 'DmarisPredict', title: t('menu_item_damarisPredict')},
        {key: 'ReceiveBox', title: t('menu_item_receiveBox')},
        {key: 'ReceiveFiles', title: t('menu_item_receiveFile')},
        {key: 'LocalizeBox', title: t('menu_item_localizeBox')},
        {key: 'LocalizeFiles', title: t('menu_item_localizeFile')},
        {key: 'ReLocalizeBox', title: t('menu_item_relocalizeBox')},
        {key: 'ReLocalizeFiles', title: t('menu_item_relocalizeFile')},
        {key: 'PackagingBox', title: t('menu_item_packagingBox')},
        {key: 'PackagingFiles', title: t('menu_item_packagingFile')},
    ]);

    // const onOpenDescModal = (title: string, description: string) => {
    //     setModalTitle(title);
    //     setModalDescription(description);
    //     setShowDescriptionModal(true);
    // };

    const changeIndex = (index: number) => {
      setIndex(index);
      dispatch({
        type: 'SET_CONFIG',
        payload: { profileDrawerActiveTitle: routes[index].title }
      });
    };
console.log(qrCode, ' // QrCode');

    return (
      <>
        <Header title="Damaris Predict" navigation={props.navigation} />
          <View style={styles.container}>
            { showQrScanner ? 
              <QRScanner
                onCode={(value) => {
                  setQrCode(prev => ({ ...prev, [scannerFor || 'qr']: value }));
                  setShowQrScanner(false);
                }}
                onBack={() => setShowQrScanner(false)}
              />
            :
              <View style={[Styles.w_100p, {
                  flex: 1,
                  flexDirection: "column",
                  height: (windowHeight - 300)
              }]}>
                  <TabView
                      navigationState={{index, routes}}
                      renderScene={renderScene}
                      onIndexChange={changeIndex}
                      style={{ flex: 1 }}
                      animationEnabled={true}
                      initialLayout={{width: layout.width}}
                      renderTabBar={props => (
                          <TabBar
                              style={styles.tab_cont}
                              tabStyle={styles.tab_style}
                              indicatorStyle={{backgroundColor: '#479ab8', height: 1,}}
                              activeColor="#479ab8"
                              inactiveColor="#000"
                              renderLabel={({ route, focused, color }) => (
                                <Text style={{ color: color || (focused ? '#479ab8' : '#000'), fontWeight: focused ? 'bold' : 'normal' }}>{route.title}</Text>
                              )}
                              scrollEnabled
                              {...props}
                          />
                      )}
                  />
              </View>
            }
        </View>
      </>
    );
};