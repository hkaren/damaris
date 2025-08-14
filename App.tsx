import {Provider, useDispatch} from "react-redux";

import MyApp from "./src/MyApp";
import store from "./src/store/Index";
import {Toast} from 'react-native-toast-message/lib/src/Toast';
//import AppGall from "./gall";
import 'react-native-gesture-handler';
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { usePushNotifications } from "./src/hook/usePushNotifications";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const App: React.FC = () => {
  const {expoPushToken} = usePushNotifications();
  console.log('data',expoPushToken?.data, 'enkrbfvhefjbh' );

  

  
  
  return (
    <Provider store={store}>
        <AutocompleteDropdownContextProvider>
          <MyApp/>
        </AutocompleteDropdownContextProvider>
        <Toast />
    </Provider>
    // <AppGall />
  );
};

export default App;