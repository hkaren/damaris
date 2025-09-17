import React, { FC, useEffect, useState } from 'react';
import { MainTabActivityScreenProps } from '../../Interface';
import { Header } from '../../components';
import { useDispatch, useSelector } from "react-redux";
import { View } from 'react-native';
import { Loading } from '../../components/loading/Loading';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMenuItemsArray } from '../../utils/StaticMethods';

const getMenuRatingByCode = async (code: string): Promise<string | null> => {
  try {
      return await AsyncStorage.getItem(code);
  } catch (error) {
      console.log(error);
      return null;
  }
};

export const Home: FC<MainTabActivityScreenProps> = (props) => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const userInfo = useSelector((store: any) => store.userInfo);

    useEffect(() => {
      setLoading(true);
      initDefaultPage();
    }, []);

    async function getMaxRatingMenuCode() {
      let maxRating = -Infinity;
      let maxCode = null;

      const menuItemsArray = getMenuItemsArray(t);
    
      for (const item of menuItemsArray) {
        // Check permissions inside the loop - only process allowed items
        let isAllowed = true;
        
        if (item.code.endsWith('FromMobile')) {
          // Check if user has permission for this item
          isAllowed = userInfo?.permissions && Array.isArray(userInfo.permissions) && 
                     userInfo.permissions.some((permission: any) => permission.code === item.code);
        }
        // For other items (like "Messages", "OfflineActions"), always allow them
        
        if (isAllowed) {
          const ratingStr = await getMenuRatingByCode(item.code);
          const rating = ratingStr ? parseInt(ratingStr) : 0;
          if (rating > maxRating) {
            maxRating = rating;
            maxCode = item.code;
          }
        }
      }
      return maxCode;
    };

    const initDefaultPage = async () => {
      const maxCode = await getMaxRatingMenuCode();

      const menuItemsArray = getMenuItemsArray(t);
      let menuItem = menuItemsArray.find(item => item.code === maxCode);
      if(!menuItem){
        menuItem = menuItemsArray[0];
      }

      setTimeout(() => {
        setTimeout(() => {
          setLoading(false);
        }, 100);
        
        dispatch({
          type: 'SET_CONFIG',
          payload: {
            profileDrawerActiveId: menuItem.id,
            profileDrawerActiveCode: menuItem.code,
            profileDrawerActiveSubTitle: menuItem.title,
            profileDrawerActiveTitle: menuItem.title
          }
        });
        // onChangeSelectTab(menuItem.id)
        // onClose()
        // @ts-ignore
        props.navigation.navigate(menuItem.navigateTo, { randomKey: Math.random(), actionType: 'nenu' });
      }, 100);
    };

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
         <Header navigation={props.navigation} showHumburgerIcon={true}/> 
        <Loading visible={loading} />
      </View>
    );
};
