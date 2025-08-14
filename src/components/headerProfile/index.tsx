import React, {Fragment, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';

import {SvgComponent} from "../../core/SvgComponent";
import {styles} from './styles';
import {useNavigation} from "@react-navigation/native";
import {DrawerModal} from "../modals/drawerModal";
import {useSelector} from "react-redux";

interface RouteItem {
    id: number;
    type: string;
    navigateTo: string;
    title: string;
    icon: string;
}

export const HeaderProfile: React.FC = () => {
    const config = useSelector((store: any) => store.config);
    const navigation = useNavigation();
    const [drawerModalVisible, setDrawerModalVisible] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number | null>(2);


    const openDrawerModalCallback = () => {
        setDrawerModalVisible(true);
    };

    return (
      <Fragment>
          {/*<Header navigation={navigation} showHumburgerIcon={true} openDrawerModalCallback={openDrawerModalCallback}/>*/}
          <View style={styles.container}>
              <DrawerModal
                isVisible={drawerModalVisible}
                onClose={() => {
                    setDrawerModalVisible(false);
                }}
                selectedIdTab={selectedId}
                onChangeSelectTab={(id) => {
                    if(id === 1) {
                        setSelectedId(2)
                    }else{
                        setSelectedId(null)
                    }
                }}
              />

          </View>
      </Fragment>
    );
};
