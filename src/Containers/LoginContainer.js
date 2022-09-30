import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  Keyboard,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Assets from '../Assets/index';
import Flag from 'react-native-flags';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import {SEND_OTP_API} from '../Utils/HRConstant';
import HRThemeBtn from '../Components/HRThemeBtn';
import BaseContainer from '../Components/BaseContainer';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const LoginContainer = props => {
  const animation = useRef(null);
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  useEffect(() => {
    animation.current?.play();
  }, []);

  const skipLogin = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };

  const onChangeMobile = number => {
    setErrorText('');
    setMobileNumber(number);
  };
  const onSubmitLogin = () => {
    if (mobileNumber.trim() === '') {
      setErrorText('Please enter mobile number');
    } else if (mobileNumber.length < 8) {
      setErrorText('Please enter valid mobile number');
    } else {
      setErrorText('');
      Keyboard.dismiss();
      setIsLoading(true);
      let params = {
        type: 2, //user
        country_code: '65',
        phone: mobileNumber,
      };
      postApi(SEND_OTP_API, params, onSuccess, onFailure);
    }
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      if (successResponse.is_register) {
        setIsLoading(false);
        props.navigation.navigate('otp', {
          userMobile: mobileNumber,
        });
      } else {
        setIsLoading(false);
        //mobile is not registered
        props.navigation.navigate('signUp', {
          userMobile: mobileNumber,
        });
        Toast.show('This mobile number is not registered!', Toast.LONG);
      }
    } else {
      Toast.show(successResponse.error, Toast.LONG);
      setIsLoading(false);
    }
  };

  const onFailure = error => {
    setIsLoading(false);
  };

  return (
    <BaseContainer styles={styles.baseContainerStyle}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.flex}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={skipLogin}
          activeOpacity={1.0}
          style={styles.skipViewStyle}>
          <Text style={styles.skipTxtStyle}>Skip</Text>
        </TouchableOpacity>

        <LottieView
          ref={animation}
          autoPlay={false}
          style={styles.lottieStyle}
          source={Assets.loginAnimation}
        />
        <View style={styles.bottomViewStyle}>
          <View style={styles.innerViewStyle}>
            <Text style={styles.titleStyle}>Welcome!</Text>
            <Text style={styles.descriptionTextStyle}>
              Enter your mobile number to {`\n`}get started
            </Text>
            <Text style={styles.phoneLabelStyle}>Mobile Number</Text>
            <View
              style={[
                styles.mobileNumberViewStyle,
                {marginBottom: errorText == '' ? 20 : 0},
              ]}>
              <View style={styles.flagCodeStyle}>
                <Flag code={'SG'} size={24} />
                <Text style={styles.countryCodeStyle}>+65</Text>
              </View>
              <TextInput
                maxLength={10}
                value={mobileNumber}
                keyboardType="number-pad"
                onChangeText={onChangeMobile}
                style={styles.mobileTxtInStyle}
              />
            </View>
            {errorText ? (
              <Text style={styles.errorTextStyle}>{errorText}</Text>
            ) : null}
            <HRThemeBtn
              btnText={'Continue'}
              isLoading={isLoading}
              onPress={onSubmitLogin}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};

export default LoginContainer;
const styles = StyleSheet.create({
  baseContainerStyle: {
    backgroundColor: HRColors.grayBg,
  },

  flex: {
    flex: 1,
  },

  skipViewStyle: {
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },

  skipTxtStyle: {
    color: HRColors.primary,
    textDecorationLine: 'underline',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(16),
  },

  lottieStyle: {
    alignSelf: 'center',
    height: heightPercentageToDP('85%'),
  },

  titleStyle: {
    marginTop: 10,
    color: '#36455A',
    paddingVertical: 10,
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

  flagCodeStyle: {
    paddingEnd: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryCodeStyle: {
    paddingStart: 5,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  phoneLabelStyle: {
    color: '#36455A',
    paddingVertical: 7,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(12),
  },

  mobileNumberViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.4,
  },

  mobileTxtInStyle: {
    flex: 1,
    paddingBottom: 7,
    borderLeftWidth: 0.5,
    paddingHorizontal: 7,
    color: HRColors.black,
    backgroundColor: HRColors.white,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  bottomViewStyle: {
    flex: 1,
    bottom: 0,
    elevation: 1,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    position: 'absolute',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    shadowColor: HRColors.black,
    width: widthPercentageToDP('100%'),
    shadowOffset: {width: 0, height: -2},
  },

  innerViewStyle: {
    marginTop: 2,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: HRColors.white,
  },

  errorTextStyle: {
    color: 'red',
    marginTop: 5,
    marginBottom: 20,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },
});
