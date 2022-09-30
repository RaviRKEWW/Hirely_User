import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Assets from '../Assets/index';
import Flag from 'react-native-flags';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import {REGISTER_API} from '../Utils/HRConstant';
import DeviceInfo from 'react-native-device-info';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import BaseContainer from '../Components/BaseContainer';
import ValidationHelper from '../Utils/ValidationHelper';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRRoundBackButton from '../Components/HRRoundBackButton';
import HRGenderComponent from '../Components/HRGenderComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {checkFirebaseServices} from '../Utils/FirebaseServiceManager';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HRServiceProviderLinkComponent from '../Components/HRServiceProviderLinkComponent';
let gender = 'male';
const genderArray = [
  {
    label: 'male',
  },
  {
    label: 'female',
  },
  {
    label: 'other',
  },
];
const SignUpContainer = props => {
  var validationHelper = new ValidationHelper();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
  var deviceName = DeviceInfo.useDeviceName().result;
  const [userFullName, setUserFullName] = useState('');
  const [userEmailAddress, setEmailAddress] = useState('');
  const [userReferralCode, setReferralCode] = useState('');
  const [userMobileNumber, setMobileNumber] = useState(
    props.route?.params?.userMobile ?? '',
  );
  useEffect(() => {
    checkFirebaseServices(
      FCMToken => {
        setDeviceToken(FCMToken);
      },
      error => {},
    );
  }, []);

  const onSubmit = () => {
    setIsError(true);
    if (
      userFullName == '' ||
      userEmailAddress == '' ||
      userMobileNumber == ''
    ) {
      return false;
    } else if (
      validationHelper.nameValidation(userFullName).trim() !== '' ||
      validationHelper.emailValidation(userEmailAddress).trim() !== '' ||
      validationHelper.mobileValidation(userMobileNumber) !== ''
    ) {
      return false;
    } else {
      Keyboard.dismiss();
      setIsLoading(true);
      let params = {
        country_code: '65',
        name: userFullName,
        email: userEmailAddress,
        phone: userMobileNumber,
        device_name: deviceName,
        device_token: deviceToken,
        gender: gender.toLowerCase(),
        referral_code: userReferralCode,
        device_type: Platform.OS == 'android' ? 0 : 1,
      };
      postApi(REGISTER_API, params, onSignUpSuccess, onSignUpFailure);
    }
  };
  const onSignUpSuccess = successResponse => {
    if (successResponse.status) {
      setIsLoading(false);
      props.navigation.navigate('otp', {
        userMobile: userMobileNumber,
      });
    } else {
      setIsLoading(false);
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onSignUpFailure = error => {
    setIsLoading(false);
    Toast.show(error?.message?.toString(), Toast.LONG);
  };

  const onClickCMS = () => {
    props.navigation.navigate('cmsContent', {
      headerTitle: 'Terms & Conditions',
      urlParam: 'terms',
    });
  };

  const onChangeUserName = text => {
    setIsError(false);
    setUserFullName(text);
  };

  const onChangeEmail = text => {
    setIsError(false);
    setEmailAddress(text);
  };

  const onChangeMobile = text => {
    setIsError(false);
    setMobileNumber(text);
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer styles={{backgroundColor: HRColors.grayBg}}>
      <View style={styles.headerStyle}>
        <HRRoundBackButton onPress={onBackPress} />
        <Image
          resizeMode={'contain'}
          source={Assets.signUpHeader}
          style={styles.headerImgStyle}
        />
      </View>
      <View style={styles.bottomViewStyle}>
        <View style={styles.keyboardAwareStyle}>
          <KeyboardAwareScrollView
            bounces={false}
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}>
            <Text style={styles.titleStyle}>Create Account</Text>
            <Text style={styles.descriptionTextStyle}>
              Enter your details to get started {`\n`} using Hirely
            </Text>

            <HRTextInput
              value={userFullName}
              txtHeader={'Full Name'}
              placeHolder={'Enter Full Name'}
              onChangeText={onChangeUserName}
              errorText={
                isError
                  ? validationHelper.nameValidation(userFullName).trim()
                  : ''
              }
              textInputStyle={styles.editTextInput1Style}
            />

            <HRTextInput
              value={userEmailAddress}
              txtHeader={'Email Address'}
              keyboardType={'email-address'}
              placeHolder={'Enter Email Address'}
              errorText={
                isError
                  ? validationHelper.emailValidation(userEmailAddress).trim()
                  : ''
              }
              onChangeText={onChangeEmail}
            />

            <HRTextInput
              maxLength={10}
              renderLeftAccessory={() => (
                <View style={styles.flagCodeStyle}>
                  <Flag code={'SG'} size={24} />
                  <Text style={styles.countryCodeStyle}>{'+65'}</Text>
                </View>
              )}
              style={styles.flex}
              keyboardType={'numeric'}
              value={userMobileNumber}
              txtHeader={'Mobile Number'}
              onChangeText={onChangeMobile}
              placeHolder={'Enter Mobile Number'}
              errorText={
                isError
                  ? validationHelper.mobileValidation(userMobileNumber).trim()
                  : ''
              }
            />

            <HRGenderComponent
              gender={gender}
              arrayItem={genderArray}
              genderValue={data => (gender = data)}
            />

            <HRTextInput
              value={userReferralCode}
              placeHolder={'Ex. HJK541'}
              onChangeText={setReferralCode}
              txtHeader={'Referral Code (Optional)'}
            />

            <TouchableOpacity
              activeOpacity={1.0}
              onPress={onClickCMS}
              style={styles.submitTextStyle}>
              <Text style={styles.submitRightTextStyle}>
                By clicking on "Submit", I agree with{' '}
                <Text style={styles.submitLeftStyle}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>

            <HRThemeBtn
              onPress={onSubmit}
              isLoading={isLoading}
              style={styles.submitBtnStyle}
            />

            <HRServiceProviderLinkComponent />
          </KeyboardAwareScrollView>
        </View>
      </View>
    </BaseContainer>
  );
};
export default SignUpContainer;
const styles = StyleSheet.create({
  headerStyle: {
    marginTop: -30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerImgStyle: {
    marginHorizontal: 30,
    marginHorizontal: 15,
    width: widthPercentageToDP(50),
    height: widthPercentageToDP(15),
  },

  bottomViewStyle: {
    flex: 1,
    elevation: 1,
    marginTop: 30,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: HRColors.black,
    backgroundColor: HRColors.white,
    shadowOffset: {width: 0, height: 0},
  },

  keyboardAwareStyle: {
    marginTop: 1,
    paddingTop: 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: HRColors.white,
  },

  titleStyle: {
    color: '#36455A',
    paddingBottom: 10,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(21),
  },

  descriptionTextStyle: {
    color: '#CBCFD4',
    paddingBottom: 15,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(17),
  },

  editTextInput1Style: {
    textTransform: 'capitalize',
  },

  submitTextStyle: {
    marginVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  countryCodeStyle: {
    paddingStart: 5,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  submitRightTextStyle: {
    color: HRColors.textInputHeaderColor,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(11),
  },

  submitLeftStyle: {
    color: HRColors.primary,
    textDecorationLine: 'underline',
    textDecorationColor: HRColors.primary,
  },

  flagCodeStyle: {
    marginEnd: 3,
    paddingEnd: 5,
    marginBottom: 1,
    borderRightWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  submitBtnStyle: {
    marginHorizontal: 20,
  },

  flex: {
    flex: 1,
  },
});
