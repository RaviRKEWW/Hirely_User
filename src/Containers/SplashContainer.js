import React, {useRef, useEffect} from 'react';
import {
  saveAddressList,
  saveUserDetails,
  saveMessageCount,
  saveReferralPoint,
  saveNotificationCount,
  saveNotificationSetting,
  saveStripeKey,
} from '../redux/Actions/User';
import Assets from '../Assets/index';
import {useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';
import {getApi} from '../Utils/ServiceManager';
import {getDataFromAsync} from '../Utils/AsyncStorageHelper';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {
  StatusBar,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
  Linking,
  BackHandler,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import RNExitApp from 'react-native-exit-app';

const SplashContainer = props => {
  const animation = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    animation.current.play();
    getApi(
      `Auth/init/${Platform.OS}_customer/${DeviceInfo.getVersion()}`,
      success => {
        console.log('success::', success);
        dispatch(saveStripeKey(success.pk_test));
        if (success.status) {
          if (success.update === false) {
            Alert.alert('Alert', success.message, [
              {
                text: 'Update',
                onPress: () =>
                  Platform.OS == 'ios'
                    ? Linking.openURL(
                        'https://apps.apple.com/sg/app/app-name/id1594362715',
                      )
                    : Linking.openURL(
                        'http://play.google.com/store/apps/details?id=com.hirely',
                      ),
              },
              {
                text: 'Continue',
                onPress: () => {
                  setTimeout(() => {
                    props?.navigation?.popToTop();
                    getDataFromAsync(
                      'UserData',
                      onUserDataSuccess,
                      onUserDataFailure,
                    );
                  }, 5000);
                },
              },
            ]);
          } else {
            setTimeout(() => {
              props?.navigation?.popToTop();
              getDataFromAsync(
                'UserData',
                onUserDataSuccess,
                onUserDataFailure,
              );
            }, 5000);
          }
        } else {
          Alert.alert('Alert', success.message, [
            {
              text: 'OK',
              onPress: () => {
                if (success.update) {
                  Platform.OS == 'ios'
                    ? Linking.openURL(
                        'https://apps.apple.com/sg/app/app-name/id1594362715',
                      )
                    : Linking.openURL(
                        'http://play.google.com/store/apps/details?id=com.hirely',
                      );
                } else {
                  return Platform.OS === 'ios'
                    ? RNExitApp?.exitApp()
                    : BackHandler.exitApp();
                }
              },
            },
          ]);
        }
      },
      err => console.log('err::', err),
    );
  }, []);

  const onUserDataSuccess = userData => {
    dispatch(saveUserDetails(userData));
    getDataFromAsync(
      'notificationCount',
      count => {
        dispatch(saveNotificationCount(count));
      },
      () => {},
    );
    getDataFromAsync(
      'messageCount',
      count => {
        dispatch(saveMessageCount(count));
      },
      () => {},
    );
    getDataFromAsync(
      'isNotification',
      isNotification => {
        dispatch(saveNotificationSetting(isNotification));
      },
      () => {},
    );
    getDataFromAsync(
      'referralPoint',
      point => {
        dispatch(saveReferralPoint(point));
      },
      () => {},
    );
    getDataFromAsync(
      'addressList',
      data => {
        dispatch(saveAddressList(data));
      },
      () => {},
    );

    props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };
  const onUserDataFailure = error => {
    getDataFromAsync(
      'isIntroViewed',
      isViewed => {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'login'}],
        });
      },
      () => {
        props.navigation.reset({
          index: 0,
          routes: [{name: 'intro'}],
        });
      },
    );
  };

  return (
    <ImageBackground source={Assets.splashBG} style={styles.bgImgStyle}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor={'transparent'}
      />
      <LottieView
        ref={animation}
        style={styles.lottieStyle}
        source={Assets.splashAnimation}
      />
    </ImageBackground>
  );
};
export default SplashContainer;
const styles = StyleSheet.create({
  bgImgStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lottieStyle: {
    height: heightPercentageToDP('100%'),
  },
});
