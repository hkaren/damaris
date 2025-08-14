import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './StackNavigation';
import {GestureHandlerRootView} from "react-native-gesture-handler";

const MainNavigator: React.FC = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
                <StackNavigation />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
};

export default MainNavigator;
