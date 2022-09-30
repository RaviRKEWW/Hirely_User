import React, { useEffect } from 'react';
import {
  saveAddressList,
  saveUserDetails,
  saveMessageCount,
  saveFavouriteList,
  saveReferralPoint,
  saveNotificationCount,
  saveNotificationSetting,
} from '../redux/Actions/User';
import Assets from '../Assets';
import HRFonts from '../Utils/HRFonts';
import { useDispatch } from 'react-redux';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import { enableScreens } from 'react-native-screens';
import OTPContainer from '../Containers/OTPContainer';
import CMSContainer from '../Containers/CMSContainer';
import HomeContainer from '../Containers/HomeContainer';
import HelpContainer from '../Containers/HelpContainer';
import messaging from '@react-native-firebase/messaging';
import LoginContainer from '../Containers/LoginContainer';
import SignUpContainer from '../Containers/SignUpContainer';
import SearchContainer from '../Containers/SearchContainer';
import RewardContainer from '../Containers/RewardContainer';
import SplashContainer from '../Containers/SplashContainer';
import { getProportionalFontSize } from '../Utils/HRConstant';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ProfileContainer from '../Containers/ProfileContainer';
import DetailsContainer from '../Containers/DetailsContainer';
import { Text, Image, Platform, StyleSheet } from 'react-native';
import ChatListContainer from '../Containers/ChatListContainer';
import CardInfoContainer from '../Containers/CardInfoContainer';
import MyOrdersContainer from '../Containers/MyOrdersContainer';
import FavouriteContainer from '../Containers/FavouriteContainer';
import HirelyPayContainer from '../Containers/HirelyPayContainer';
import PointMallContainer from '../Containers/PointMallContainer';
import MyAddressContainer from '../Containers/MyAddressContainer';
import AddAddressContainer from '../Containers/AddAddressContainer';
import MessageListContainer from '../Containers/MessageListContainer';
import EditProfileContainer from '../Containers/EditProfileContainer';
import ClaimCancelContainer from '../Containers/ClaimCancelContainer';
import IntroSliderContainer from '../Containers/IntroSliderContainer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationContainer from '../Containers/NotificationContainer';
import OrderDetailsContainer from '../Containers/OrderDetailsContainer';
import OrderPreviewContainer from '../Containers/OrderPreviewContainer';
import CategoryListContainer from '../Containers/CategoryListContainer';
import NavigationServiceManager from '../Utils/NavigationServiceManager';
import AllRatingReviewContainer from '../Containers/AllRatingReviewContainer';
import CurrentVouchersContainer from '../Containers/CurrentVouchersContainer';
import { saveDataInAsync, clearDataFromAsync } from '../Utils/AsyncStorageHelper';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AutoCompletePlaceContainer from '../Containers/AutoCompletePlaceContainer';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import SubCategoryListContainer from '../Containers/SubCategoryListContainer';

let currentScreen = '';
enableScreens();
export const BASE_STACK = createStackNavigator();
export const HIRELY_PAY_STACK = createStackNavigator();
export const POINT_MALL_STACK = createStackNavigator();
export const HOME_STACK = createStackNavigator();
// export const HELP_STACK = createStackNavigator();
export const ORDER_STACK = createStackNavigator();
export const PROFILE_STACK = createStackNavigator();
export const BOTTOM_TAB = createBottomTabNavigator();
let bottomTabArray = [
  { name: 'hirelypay', title: 'Hirelypay', image: Assets.hirelyPay2 },
  { name: 'pointmall', title: 'Point Mall', image: Assets.pointMall },
  { name: 'Home', title: 'Home', image: Assets.home },
  { name: 'orders', title: 'Orders', image: Assets.orders },
  { name: 'profile', title: 'Profile', image: Assets.profile },
];
const TransitionScreenOptions = {
  ...TransitionPresets.SlideFromRightIOS, // This is where the transition happens
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Notification in background', remoteMessage);
});
export const HOME_STACK_NAVIGATOR = () => {
  return (
    <HOME_STACK.Navigator initialRouteName={'homePage'} headerMode={'none'}>
      <HOME_STACK.Screen name={'homePage'} component={HomeContainer} />
    </HOME_STACK.Navigator>
  );
};
export const HIRELY_PAY_STACK_NAVIGATOR = () => {
  return (
    <HIRELY_PAY_STACK.Navigator
      initialRouteName={'hirelypay'}
      headerMode={'none'}>
      <HIRELY_PAY_STACK.Screen
        name={'hirelypay'}
        component={HirelyPayContainer}
      />
    </HIRELY_PAY_STACK.Navigator>
  );
};
export const POINT_MALL_STACK_NAVIGATOR = () => {
  return (
    <POINT_MALL_STACK.Navigator
      initialRouteName={'pointmall'}
      headerMode={'none'}>
      <POINT_MALL_STACK.Screen
        name={'pointmall'}
        component={PointMallContainer}
      />
    </POINT_MALL_STACK.Navigator>
  );
};
// export const HELP_STACK_NAVIGATOR = () => {
//   return (
//     <HELP_STACK.Navigator
//       tabBarOptions={{keyboardHidesTabBar: true}}
//       initialRouteName={'help'}
//       headerMode={'none'}>
//       <HELP_STACK.Screen name={'help'} component={HelpContainer} />
//     </HELP_STACK.Navigator>
//   );
// };
export const ORDER_STACK_NAVIGATOR = () => {
  return (
    <ORDER_STACK.Navigator initialRouteName={'myOrders'} headerMode={'none'}>
      <ORDER_STACK.Screen name={'myOrders'} component={MyOrdersContainer} />
    </ORDER_STACK.Navigator>
  );
};
export const PROFILE_STACK_NAVIGATOR = () => {
  return (
    <PROFILE_STACK.Navigator initialRouteName={'profile'} headerMode={'none'}>
      <PROFILE_STACK.Screen name={'profile'} component={ProfileContainer} />
    </PROFILE_STACK.Navigator>
  );
};
export const BOTTOM_TAB_NAVIGATOR = props => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  useEffect(() => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      if (remoteMessage.data.type == 'chat') {
        //personal chat message notification
        await messageNotification();
      } else if (remoteMessage.data.type == 'delete_by_admin') {
        //account delete by admin from admin panel
        await accountDeletedByAdmin();
      } else {
        await addNotificationCount();
      }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage.data.type == 'chat') {
        //personal chat message notification
        messageNotification();
        NavigationServiceManager?.navigateToSingleRoute('messageList', {
          senderId: remoteMessage?.data?.sender_id,
          name: remoteMessage?.data?.sender_name,
          image: remoteMessage?.data?.sender_image,
        });
      } else if (remoteMessage.data.type == 'order') {
        addNotificationCount();
        if (currentScreen == 'orderDetail') {
          // navigation.setParams({orderId: remoteMessage?.data?.order_id, reload: true});
          navigation.replace('orderDetail', {
            orderId: remoteMessage?.data?.order_id,
          })
        } else {
          NavigationServiceManager?.navigateToSingleRoute('orderDetail', {
            orderId: remoteMessage?.data?.order_id,
          });
        }
      } else if (remoteMessage.data.type == 'delete_by_admin') {
        //account delete by admin from admin panel
        accountDeletedByAdmin();
      } else {
        addNotificationCount();
      }
    });

    messaging().getInitialNotification(remoteMessage => {
      if (remoteMessage.data.type == 'chat') {
        messageNotification();
      } else if (remoteMessage.data.type == 'delete_by_admin') {
        accountDeletedByAdmin();
      } else {
        addNotificationCount();
      }
    });

    const foregroundMessage = messaging().onMessage(async remoteMessage => {
      console.log('onmessage::', remoteMessage);
      if (currentScreen == 'messageList') {
        //no need to show notification on chat screen
      } else {
        if (Platform.OS === 'android') {
          PushNotification.createChannel(
            {
              channelId: 'channel-id', // (required)
              channelName: 'My channel', // (required)
              channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
              playSound: false, // (optional) default: true
              soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
              vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
          );
          PushNotification.localNotification({
            /* Android Only Properties */
            channelId: 'channel-id',
            // ticker: 'My Notification Ticker', // (optional)
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_new_launcher', // (optional) default: "ic_launcher"
            smallIcon: 'ic_new_launcher', // (optional) default: "ic_notification" with fallback for "ic_launcher"
            // bigText: '', // (optional) default: "message" prop
            // subText: none, // (optional) default: none
            // color: 'red', // (optional) default: system default
            vibrate: true, // (optional) default: true
            vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
            tag: 'some_tag', // (optional) add tag to message
            group: 'group', // (optional) add group to message
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
            when: null, // (optional) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

            /* iOS only properties */
            category: remoteMessage?.data?.type, // (optional) default: empty string
            // subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

            /* iOS and Android properties */
            data: remoteMessage?.data,
            // id: remoteMessage?.messageId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: remoteMessage?.data?.title, // (optional)
            message: remoteMessage?.data?.body, // (required)
            // userInfo: {screen: 'home'}, // (optional) default: {} (using null throws a JSON value '<null>' error)
            // playSound: !!soundName, // (optional) default: true
            // soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          });
        } else {
          PushNotificationIOS.presentLocalNotification({
            alertTitle: remoteMessage?.data?.title,
            userInfo: remoteMessage?.data,
            // applicationIconBadgeNumber: 1,
            alertBody: remoteMessage?.data?.body,
          });
          // PushNotificationIOS.addNotificationRequest({
          //   id: 'notificationWithSound',
          //   title: 'Sample Title',
          //   subtitle: 'Sample Subtitle',
          //   body: 'Sample local notification with custom sound',
          //   sound: 'customSound.wav',
          //   badge: 1,
          // });
          // PushNotification.localNotification({
          //   /* Android Only Properties */
          //   // channelId: channel_ids[0],
          //   ticker: 'My Notification Ticker', // (optional)
          //   autoCancel: true, // (optional) default: true
          //   largeIcon: 'ic_new_launcher', // (optional) default: "ic_launcher"
          //   smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher"
          //   // bigText: '', // (optional) default: "message" prop
          //   // subText: none, // (optional) default: none
          //   color: 'red', // (optional) default: system default
          //   vibrate: true, // (optional) default: true
          //   vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          //   tag: 'some_tag', // (optional) add tag to message
          //   group: 'group', // (optional) add group to message
          //   groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
          //   ongoing: false, // (optional) set whether this is an "ongoing" notification
          //   invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
          //   when: null, // (optional) Add a timestamp pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
          //   usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
          //   timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

          //   /* iOS only properties */
          //   category: remoteMessage?.data?.type, // (optional) default: empty string
          //   // subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

          //   /* iOS and Android properties */
          //   data: remoteMessage?.data,
          //   // id: remoteMessage?.messageId, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          //   title: remoteMessage?.data?.title, // (optional)
          //   message: remoteMessage?.data?.body, // (required)
          //   // userInfo: {screen: 'home'}, // (optional) default: {} (using null throws a JSON value '<null>' error)
          //   // playSound: !!soundName, // (optional) default: true
          //   // soundName: soundName ? soundName : 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          //   number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          // });
        }
      }

      if (remoteMessage.data.type == 'chat') {
        messageNotification();
      } else if (remoteMessage.data.type == 'delete_by_admin') {
        accountDeletedByAdmin();
      } else {
        addNotificationCount();
      }
    });
    return foregroundMessage;
  }, []);

  const addNotificationCount = () => {
    dispatch(saveNotificationCount(1));
    saveDataInAsync(
      'notificationCount',
      1,
      () => { },
      () => { },
    );
  };
  const messageNotification = () => {
    dispatch(saveMessageCount(1));
    saveDataInAsync(
      'messageCount',
      1,
      () => { },
      () => { },
    );
  };
  const accountDeletedByAdmin = () => {
    clearDataFromAsync(
      'UserData',
      () => {
        dispatch(saveUserDetails({}));
      },
      () => { },
    );
    clearDataFromAsync(
      'isNotification',
      () => {
        dispatch(saveNotificationSetting(true));
      },
      () => { },
    );
    clearDataFromAsync(
      'referralPoint',
      () => {
        dispatch(saveReferralPoint(0));
      },
      () => { },
    );
    clearDataFromAsync(
      'messageCount',
      () => {
        dispatch(saveMessageCount(0));
      },
      () => { },
    );
    clearDataFromAsync(
      'notificationCount',
      () => {
        dispatch(saveNotificationCount(0));
      },
      () => { },
    );
    clearDataFromAsync(
      'addressList',
      () => {
        dispatch(saveAddressList([]));
      },
      () => { },
    );
    dispatch(saveFavouriteList([]));
    Toast.show('Your account has been deleted by admin!', Toast.LONG);
    NavigationServiceManager.navigateToSpecificRoute('login');
  };

  return (
    <BOTTOM_TAB.Navigator
      initialRouteName={'Home'}
      sceneAnimationEnabled={false}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        style: {
          height: Platform.OS == 'ios' ? 75 : 55,
        },
        safeAreaInsets: { bottom: Platform.OS == 'ios' ? 25 : 0 },
      }}>
      {bottomTabArray.map((item, index) => {
        return (
          <BOTTOM_TAB.Screen
            key={index}
            name={item.name}
            options={{
              tabBarLabel: ({ focused }) => (
                <Text
                  style={[
                    styles.titleStyle,
                    {
                      color: focused ? HRColors.primary : '#8392A5',
                      fontSize: focused
                        ? getProportionalFontSize(12)
                        : getProportionalFontSize(13),
                    },
                  ]}>
                  {item.title}
                </Text>
              ),
              tabBarIcon: ({ focused }) =>
                index == 0 ? (
                  <Image
                    style={styles.imageStyle}
                    source={
                      focused ? Assets.hirelyPay2Highlight : Assets.hirelyPay2
                    }
                  />
                ) : (
                  <Image
                    source={item.image}
                    style={[
                      {
                        tintColor: focused ? HRColors.primary : '#8392A5',
                      },
                      styles.bottomImgStyle,
                    ]}
                  />
                ),
            }}
            component={
              index == 0
                ? HIRELY_PAY_STACK_NAVIGATOR
                : index == 1
                  ? POINT_MALL_STACK_NAVIGATOR
                  : index == 2
                    ? HOME_STACK_NAVIGATOR
                    : index == 3
                      ? ORDER_STACK_NAVIGATOR
                      : PROFILE_STACK_NAVIGATOR
            }
          />
        );
      })}
    </BOTTOM_TAB.Navigator>
  );
};
export const RootNavigator = () => {
  return (
    <NavigationContainer
      ref={navigationRef =>
        NavigationServiceManager.setTopLevelNavigation(navigationRef)
      }
      onStateChange={state => {
        currentScreen = state.routes[state.routes.length - 1].name;
      }}>
      <BASE_STACK.Navigator
        headerMode={'none'}
        initialRouteName={'splash'}
        screenOptions={TransitionScreenOptions}>
        <BASE_STACK.Screen name={'otp'} component={OTPContainer} />
        <BASE_STACK.Screen name={'login'} component={LoginContainer} />
        <BASE_STACK.Screen name={'search'} component={SearchContainer} />
        <BASE_STACK.Screen name={'reward'} component={RewardContainer} />
        <BASE_STACK.Screen name={'splash'} component={SplashContainer} />
        <BASE_STACK.Screen name={'signUp'} component={SignUpContainer} />
        <BASE_STACK.Screen name={'cmsContent'} component={CMSContainer} />
        <BASE_STACK.Screen name={'details'} component={DetailsContainer} />
        <BASE_STACK.Screen name={'Home'} component={BOTTOM_TAB_NAVIGATOR} />
        {/* <BASE_STACK.Screen name={'myOrders'} component={MyOrdersContainer} /> */}
        <BASE_STACK.Screen name={'help'} component={HelpContainer} />
        <BASE_STACK.Screen name={'cardInfo'} component={CardInfoContainer} />
        <BASE_STACK.Screen name={'chatList'} component={ChatListContainer} />
        <BASE_STACK.Screen name={'intro'} component={IntroSliderContainer} />
        <BASE_STACK.Screen name={'favorite'} component={FavouriteContainer} />
        <BASE_STACK.Screen name={'myAddress'} component={MyAddressContainer} />
        <BASE_STACK.Screen
          name={'subCategory'}
          component={SubCategoryListContainer}
        />
        <BASE_STACK.Screen
          name={'addAddress'}
          component={AddAddressContainer}
        />
        <BASE_STACK.Screen
          name={'messageList'}
          component={MessageListContainer}
        />
        <BASE_STACK.Screen
          name={'notifications'}
          component={NotificationContainer}
        />
        <BASE_STACK.Screen
          name={'editProfile'}
          component={EditProfileContainer}
        />
        <BASE_STACK.Screen
          name={'orderDetail'}
          component={OrderDetailsContainer}
        />
        <BASE_STACK.Screen
          name={'orderPreview'}
          component={OrderPreviewContainer}
        />
        <BASE_STACK.Screen
          name={'claimCancel'}
          component={ClaimCancelContainer}
        />
        <BASE_STACK.Screen
          name={'currentVouchers'}
          component={CurrentVouchersContainer}
        />
        <BASE_STACK.Screen
          name={'category'}
          component={CategoryListContainer}
        />
        <BASE_STACK.Screen
          name={'viewAllRating'}
          component={AllRatingReviewContainer}
        />
        <BASE_STACK.Screen
          name={'autocompletePlace'}
          component={AutoCompletePlaceContainer}
        />
      </BASE_STACK.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
const styles = StyleSheet.create({
  bottomImgStyle: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  titleStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
  },

  imageStyle: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
