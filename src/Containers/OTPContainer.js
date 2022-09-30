import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Platform,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  saveUserDetails,
  saveReferralPoint,
  saveNotificationSetting,
} from '../redux/Actions/User';
import HRFonts from '../Utils/HRFonts';
import {useDispatch} from 'react-redux';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import DeviceInfo from 'react-native-device-info';
import BaseContainer from '../Components/BaseContainer';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {LOGIN_API, SEND_OTP_API} from '../Utils/HRConstant';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {checkFirebaseServices} from '../Utils/FirebaseServiceManager';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const OTPContainer = props => {
  const dispatch = useDispatch();
  const [otpCode, setOtpCode] = useState('');
  const [isResend, setIsResend] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  var deviceName = DeviceInfo.useDeviceName().result;

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

  const onOTPVerification = code => {
    Keyboard.dismiss();
    let otpBodyParams = {
      type: 2,
      otp: code,
      country_code: '65',
      device_name: deviceName,
      device_token: deviceToken,
      phone: props?.route?.params?.userMobile,
      device_type: Platform.OS == 'android' ? 0 : 1,
    };
    postApi(LOGIN_API, otpBodyParams, onSuccess, onFailure);
  };

  const onSuccess = successResponse => {
    if (successResponse.status) {
      Toast.show('Login successfully!', Toast.LONG);
      dispatch(saveUserDetails(successResponse.user));
      dispatch(saveNotificationSetting(successResponse.user.notification));
      dispatch(saveReferralPoint(successResponse.user.point));
      saveDataInAsync(
        'UserData',
        successResponse.user,
        () => {},
        () => {},
      );
      saveDataInAsync(
        'isNotification',
        successResponse.user.notification,
        () => {},
        () => {},
      );
      saveDataInAsync(
        'referralPoint',
        successResponse.user.point,
        () => {},
        () => {},
      );
      props.navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } else {
      Toast.show(successResponse.error, Toast.LONG);
    }
  };

  const onFailure = error => {};

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  const onResend = () => {
    setIsResend(true);
    let loginBodyParams = {
      type: 2,
      country_code: '65',
      phone: props?.route?.params?.userMobile,
    };
    postApi(SEND_OTP_API, loginBodyParams, onResendSuccess, onResendFailure);
  };

  const onResendSuccess = successResponse => {
    if (successResponse.status) {
      setIsResend(false);
    } else {
      Toast.show(successResponse.error, Toast.LONG);
      setIsResend(false);
    }
  };

  const onResendFailure = error => {
    setIsResend(false);
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      styles={{backgroundColor: HRColors.grayBg}}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTextStyle}>Phone Verification</Text>
        <Text style={styles.headerSubTextStyle}>Enter your OTP code here</Text>
        <View style={styles.otpViewStyle}>
          <OTPInputView
            pinCount={6}
            code={otpCode}
            // autoFocusOnLoad
            style={styles.otpStyle}
            onCodeChanged={code => {
              setOtpCode(code);
            }}
            onCodeFilled={code => onOTPVerification(code)}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
          />
        </View>
        <Text style={styles.headerSubText2Style}>
          Didn't you receive any code?
        </Text>
        <TouchableOpacity
          onPress={onResend}
          activeOpacity={1.0}
          disabled={isResend}>
          <Text
            style={[
              styles.resendTextStyle,
              {color: isResend ? HRColors.grayBorder : HRColors.primary},
            ]}>
            Resend a new code.
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};
export default OTPContainer;

const styles = StyleSheet.create({
  headerTextStyle: {
    color: '#0A1F44',
    alignSelf: 'center',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(34),
  },

  otpViewStyle: {
    paddingHorizontal: 30,
  },

  otpStyle: {
    height: heightPercentageToDP('18%'),
  },

  headerSubTextStyle: {
    marginTop: 15,
    color: '#0A1F44',
    alignSelf: 'center',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(17),
  },

  headerSubText2Style: {
    color: '#B8BBC6',
    alignSelf: 'center',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(17),
  },

  resendTextStyle: {
    marginTop: 5,
    alignSelf: 'center',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(17),
  },

  underlineStyleBase: {
    borderWidth: 1,
    borderRadius: 25,
    borderBottomWidth: 1,
    color: HRColors.black,
    backgroundColor: '#D9D5D5',
  },

  underlineStyleHighLighted: {
    color: HRColors.white,
    backgroundColor: HRColors.primary,
  },
});
