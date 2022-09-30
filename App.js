import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import RootNavigator from './src/Components/RootNavigator';
import { userOperation } from './src/redux/Reducers/UserReducer';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import { PersistGate } from 'redux-persist/integration/react';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';
import NavigationServiceManager from './src/Utils/NavigationServiceManager';
import Toast from 'react-native-simple-toast';
import NetInfo from '@react-native-community/netinfo';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const rootReducer = combineReducers({
  userOperation: userOperation,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const applicationStore = createStore(persistedReducer);
let persistor = persistStore(applicationStore);

const App = (props) => {
  useEffect(() => {
    NetInfo.addEventListener(connectionInfo => {
      if (connectionInfo?.isConnected === false) {
        Toast.show('No internet connection', Toast.LONG);
      }
      console.log('Changed Connection Type', connectionInfo.type);
      console.log('Is connected?', connectionInfo.isConnected);
    });
    if (Platform.OS === 'ios') {
      KeyboardManager.setEnable(true);
      KeyboardManager.setEnableDebugging(false);
      KeyboardManager.setKeyboardDistanceFromTextField(10);
      KeyboardManager.setLayoutIfNeededOnUpdate(true);
      KeyboardManager.setEnableAutoToolbar(true);
      KeyboardManager.setToolbarDoneBarButtonItemText('Done');
      KeyboardManager.setToolbarManageBehaviourBy('subviews'); // "subviews" | "tag" | "position"
      KeyboardManager.setToolbarPreviousNextButtonEnable(false);
      KeyboardManager.setToolbarTintColor('#0000FF'); // Only #000000 format is supported
      KeyboardManager.setToolbarBarTintColor('#FFFFFF'); // Only #000000 format is supported
      KeyboardManager.setShouldShowToolbarPlaceholder(true);
      KeyboardManager.setOverrideKeyboardAppearance(false);
      KeyboardManager.setKeyboardAppearance('default'); // "default" | "light" | "dark"
      KeyboardManager.setShouldResignOnTouchOutside(true);
      KeyboardManager.setShouldPlayInputClicks(true);
      KeyboardManager.resignFirstResponder();
      KeyboardManager.isKeyboardShowing().then(isShowing => { });
    }

    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: notification => {
        console.log('NOTIFICATION:', notification);

        if (notification?.userInteraction) {
          setTimeout(() => {
            if (notification?.data?.type == 'chat') {
              NavigationServiceManager?.navigateToSingleRoute('messageList', {
                senderId: notification?.data?.sender_id,
                name: notification?.data?.sender_name,
                image: notification?.data?.sender_image,
              });
            } else if (notification?.data?.type == 'order') {
              const navigation = NavigationServiceManager.getTopLevelNavigation();
              const currentRoute = navigation?.getCurrentRoute()?.name;
              if (currentRoute == 'orderDetail') {
                // navigation.replace('orderDetail', {
                //   orderId: notification?.data?.order_id,
                // });
                navigation.setParams({ orderId: notification?.data?.order_id, reload: true })
              } else {
                NavigationServiceManager?.navigateToSingleRoute('orderDetail', {
                  orderId: notification?.data?.order_id,
                });
              }
            } else {
              return;
            }
          }, 2000);
        }

        // process the notification

        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION ACTION :', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      // permissions: {
      //   alert: true,
      //   badge: true,
      //   sound: true,
      // },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });
  }, []);
  console.disableYellowBox = true;
  //for push notification please check RootNavigator
  return (
    <Provider store={applicationStore}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};
export default App;
