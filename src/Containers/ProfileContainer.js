import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {
  saveAddressList,
  saveUserDetails,
  saveMessageCount,
  saveReferralPoint,
  saveFavouriteList,
  saveNotificationCount,
  saveNotificationSetting,
} from '../redux/Actions/User';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import {useSelector, useDispatch} from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import {postApi} from '../Utils/ServiceManager';
import Clipboard from '@react-native-community/clipboard';
import {DELETE_ACCOUNT, getProportionalFontSize} from '../Utils/HRConstant';
import HRProfileComponent from '../Components/HRProfileComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {profileListData, guestListData} from '../Utils/ProfileData';
import {LOGOUT_API, NOTIFICATION_SETTING_API} from '../Utils/HRConstant';
import {saveDataInAsync, clearDataFromAsync} from '../Utils/AsyncStorageHelper';
import HRServiceProviderLinkComponent from '../Components/HRServiceProviderLinkComponent';
import DeviceInfo from 'react-native-device-info';
import {checkFirebaseServices} from '../Utils/FirebaseServiceManager';
import HRPopupView from '../Components/HRPopView';
import HRColors from '../Utils/HRColors';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import ValidationHelper from '../Utils/ValidationHelper';

const ProfileContainer = props => {
  const dispatch = useDispatch();
  let userData = useSelector(state => state.userOperation);
  const [notificationToggle, setNotificationToggle] = useState(
    userData.isNotification,
  );
  const [deviceToken, setDeviceToken] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPerform, setShouldPerform] = useState(false);
  var validationHelper = new ValidationHelper();

  useEffect(() => {
    getFcmService();
  }, []);
  const getFcmService = () => {
    checkFirebaseServices(
      FCMToken => {
        setDeviceToken(FCMToken);
      },
      error => {},
    );
  };
  const onPressNotificationSetting = () => {
    let params = {
      user_id: userData.userDetail.id,
      notification: userData.isNotification ? 0 : 1,
    };
    postApi(
      NOTIFICATION_SETTING_API,
      params,
      onSettingSuccess,
      onSettingFailure,
      userData,
    );
  };
  const onSettingSuccess = successResponse => {
    if (successResponse.status) {
      setNotificationToggle(successResponse.user.notification);
      dispatch(saveNotificationSetting(successResponse.user.notification));
      saveDataInAsync(
        'isNotification',
        successResponse.user.notification,
        () => {},
        () => {},
      );
    } else {
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onSettingFailure = error => {};
  const renderProfileList = ({item, index}) => {
    return (
      <HRProfileComponent
        item={item}
        index={index}
        notificationToggle={notificationToggle}
        onPress={() => navigateToProfileItem(item, index)}
        setNotificationToggle={onPressNotificationSetting}
        isProfile={
          userData.userDetail.id == undefined || userData.userDetail.id == ''
            ? false
            : true
        }
      />
    );
  };
  const onPressLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout ?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          let logoutParams = {
            user_id: userData.userDetail.id,
            device_token: deviceToken,
            type: 2,
          };
          postApi(LOGOUT_API, logoutParams, onLogoutSuccess, onLogoutFailure);
        },
      },
    ]);
  };
  const onLogoutSuccess = successResponse => {
    if (successResponse.status) {
      Toast.show(successResponse.message, Toast.LONG);
      dispatch(saveUserDetails({}));
      dispatch(saveNotificationSetting(true));
      dispatch(saveReferralPoint(0));
      dispatch(saveFavouriteList([]));
      dispatch(saveMessageCount(0));
      dispatch(saveNotificationCount(0));
      dispatch(saveAddressList([]));
      clearDataFromAsync(
        'isNotification',
        () => {},
        () => {},
      );
      clearDataFromAsync(
        'referralPoint',
        () => {},
        () => {},
      );
      clearDataFromAsync(
        'messageCount',
        () => {},
        () => {},
      );
      clearDataFromAsync(
        'notificationCount',
        () => {},
        () => {},
      );
      clearDataFromAsync(
        'addressList',
        () => {},
        () => {},
      );
      clearDataFromAsync(
        'UserData',
        () => {
          props.navigation.reset({
            index: 0,
            routes: [{name: 'login'}],
          });
        },
        () => {},
      );
    } else {
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onLogoutFailure = error => {
    Toast.show('Please try again later!', Toast.LONG);
  };
  const navigateToProfileItem = (item, index) => {
    if (item.routeName) {
      props.navigation.navigate(item.routeName, {
        headerTitle: item.title,
        urlParam: item.urlParam,
      });
    }
    if (index == 4) {
      Toast.show('Code copied!', Toast.LONG);
      Clipboard.setString(
        `Hey, Hirely is the latest app for affordable home services! Please download and use my referral code ${userData?.userDetail?.referral_code} to get a 10% discount on your order. 
Play Store: http://play.google.com/store/apps/details?id=com.hirely
App Store: https://apps.apple.com/sg/app/app-name/id1594362715`,
      );
    }
  };
  const headerComponent = () => {
    return (
      <View style={styles.profileUpperViewStyle}>
        <FastImage
          style={styles.userProfileStyle}
          source={
            userData.userDetail?.image == '' ||
            userData.userDetail?.image == null
              ? Assets.noImage
              : {uri: userData.userDetail.image}
          }
        />
        <View style={styles.usernameViewStyle}>
          <Text style={styles.userNameTextStyle} numberOfLines={1}>
            {userData.userDetail.name ?? 'Guest'}
          </Text>
          {userData.userDetail.id == undefined ||
          userData.userDetail.id == '' ? null : (
            <Text style={styles.userMobileTextStyle}>
              +{userData.userDetail.country_code} {userData.userDetail.phone}
            </Text>
          )}
        </View>
      </View>
    );
  };
  const onPressDelete = () => {
    Alert.alert('Delete Account', 'Are you sure you want to delete account?', [
      {
        text: 'NO',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          setIsOpen(true);
        },
      },
    ]);
  };
  const onChangeTitle = value => {
    setShouldPerform(false);
    setTitle(value);
  };

  const footerComponent = () => {
    return (
      <>
        <View style={styles.dividerStyle} />
        <HRServiceProviderLinkComponent />
        {userData.userDetail.id == undefined ||
        userData.userDetail.id == '' ? null : (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={onPressLogout}
              style={styles.logoutViewStyle}>
              <Image
                source={Assets.logoutIcon}
                style={styles.logoutIconStyle}
              />
              <Text style={styles.logOutTextStyle}>Log Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressDelete}
              style={styles.logoutViewStyle}>
              <Image style={styles.logoutIcon} source={Assets.deleteAccount} />
              <Text style={styles.logOutTextStyle}>{'Delete Account'}</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={styles.appVersionTextStyle}>
          App Version : {DeviceInfo.getVersion()}
        </Text>
      </>
    );
  };
  const deleteAccount = () => {
    setShouldPerform(true);
    if (
      title.trim() == '' ||
      validationHelper.isEmptyValidation(title, 'Please enter message')
    ) {
      return;
    } else {
      setIsLoading(true);
      let params = {
        user_id: userData.userDetail.id,
        reason: title,
      };
      postApi(
        DELETE_ACCOUNT,
        params,
        onLogoutSuccess,
        onFailure => {
          console.log('onFailure::', onFailure);
        },
        userData,
      );
    }
  };

  return (
    <BaseContainer headerText={'My Account'}>
      <FlatList
        data={
          userData.userDetail.id == undefined || userData.userDetail.id == ''
            ? guestListData
            : profileListData
        }
        renderItem={renderProfileList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={headerComponent()}
        ListFooterComponent={footerComponent()}
        keyExtractor={item => item.id.toString()}
      />
      <HRPopupView
        blurType="dark"
        isVisible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{justifyContent: 'flex-end'}}>
        <View style={{flex: 0.8}}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={styles.mainViewStyle}
            keyboardShouldPersistTaps={'always'}>
            <Text style={styles.stateTextStyle}>
              Please submit your reason to delete account
            </Text>
            <HRTextInput
              multiline
              numberOfLines={4}
              value={title}
              txtHeader={'Give Feedback'}
              textInputStyle={styles.inputStyle}
              onChangeText={onChangeTitle}
              inputContainerStyle={styles.containerInputStyle}
            />
            {shouldPerform ? (
              <Text
                style={{
                  marginTop: 10,
                  marginStart: 20,
                  color: 'red',
                  fontFamily: HRFonts.AirBnB_Medium,
                  fontSize: getProportionalFontSize(12),
                }}>
                {shouldPerform
                  ? validationHelper
                      .isEmptyValidation(title, 'Please enter feedback')
                      .trim()
                  : ''}
              </Text>
            ) : null}
            <HRThemeBtn
              btnText={'Submit'}
              isLoading={isLoading}
              onPress={deleteAccount}
              style={{marginHorizontal: 20}}
            />
            <HRThemeBtn
              btnText={'Go Back'}
              isLoading={isLoading}
              onPress={() => setIsOpen(false)}
              style={{
                backgroundColor: HRColors.white,
                borderColor: HRColors.primary,
                borderWidth: 1,
                marginHorizontal: 20,
              }}
              btnTextStyle={styles.bookTxtStyle}
            />
          </ScrollView>
        </View>
      </HRPopupView>
    </BaseContainer>
  );
};

export default ProfileContainer;
const styles = StyleSheet.create({
  mainViewStyle: {
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: HRColors.white,
  },
  inputStyle: {
    height: 80,
    paddingVertical: 20,
  },

  containerInputStyle: {
    height: 120,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    paddingBottom: Platform.OS == 'ios' ? 30 : 15,
  },

  bookTxtStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  stateTextStyle: {
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
    marginHorizontal: 20,
  },
  profileUpperViewStyle: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    borderBottomColor: '#8B9897',
  },

  userProfileStyle: {
    borderRadius: 30,
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
  },

  usernameViewStyle: {
    marginHorizontal: 10,
    flex: 1,
  },

  userNameTextStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(17),
  },

  userMobileTextStyle: {
    marginTop: 5,
    color: '#9C9C9C',
    fontFamily: HRFonts.AirBnB_Book,
    fontSize: getProportionalFontSize(12),
  },

  logoutViewStyle: {
    // marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutIconStyle: {
    resizeMode: 'contain',
  },

  logOutTextStyle: {
    marginHorizontal: 7,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  dividerStyle: {
    marginVertical: 15,
    borderBottomWidth: 0.3,
    borderColor: '#8B9897',
  },

  appVersionTextStyle: {
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(14),
  },
});
