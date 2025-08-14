import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home } from '../pages/home';
import Logout from '../pages/logout';
import { DrawerParamList } from '../Interface';
import CustomDrawer from '../components/CustomDrawer';
import About from '../pages/about';
import GenerateToken from '../pages/generateToken';
import Messages from '../pages/messages';
import Settings from '../pages/settings';
import MessagesNew from '../pages/messagesNew';
import { PhysicalArchive } from '../pages/physicalArchive';
import DamarisPredictActions from '../pages/damarisPredictActions';
import Search from '../pages/search';
import AdvancedSearch from '../pages/search/advancedSearch';
import ElectronicDocumentView from '../pages/search/electronicDocumentView';
import { ElectronicArchive } from '../pages/electronicArchive';
import ManualTask from '../pages/manualTask';
import OfflineActions from '../pages/offlineActions';
import { Chat } from '../pages/chat';
import { Room } from '../pages/chat/room';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0,0,0,0.7)',
      }}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Messages" component={Messages} />
      <Drawer.Screen name="MessagesNew" component={MessagesNew} />
      <Drawer.Screen name="PhysicalArchive" component={PhysicalArchive} />
      <Drawer.Screen name="ElectronicArchive" component={ElectronicArchive} />
      <Drawer.Screen name="SearchDocument" component={Search} />
      <Drawer.Screen name="AdvancedSearch" component={AdvancedSearch} />
      <Drawer.Screen name="ElectronicDocumentView" component={ElectronicDocumentView} />
      <Drawer.Screen name="DamarisPredictActions" component={DamarisPredictActions} />
      <Drawer.Screen name="ManualTask" component={ManualTask} />
      <Drawer.Screen name="OfflineActions" component={OfflineActions} />
      <Drawer.Screen name="GenerateToken" component={GenerateToken}  />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Logout" component={Logout} />
      <Drawer.Screen name="Chat" component={Chat} />
      <Drawer.Screen name="Room" component={Room} />
    </Drawer.Navigator>
  );
};
