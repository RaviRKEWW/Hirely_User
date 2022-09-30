import React, {useState} from 'react';
import {
  saveUserDetails,
  saveReferralPoint,
  saveNotificationSetting,
} from '../redux/Actions/User';
import Assets from '../Assets/index';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import FastImage from 'react-native-fast-image';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import {EDIT_PROFILE_API, getProportionalFontSize} from '../Utils/HRConstant';
import {useDispatch, useSelector} from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import ImagePicker from 'react-native-image-crop-picker';
import ValidationHelper from '../Utils/ValidationHelper';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import HRGenderComponent from '../Components/HRGenderComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {
  View,
  Alert,
  Linking,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import HRBorderedBtnComponent from '../Components/HRBorderedBtnComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HRPopupView from '../Components/HRPopView';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
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
const EditProfileContainer = props => {
  const dispatch = useDispatch();
  var validationHelper = new ValidationHelper();
  const [isError, setIsError] = useState(false);
  const [updateImage, setUpdateImage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [userEmail, setUserEmail] = useState(userData?.userDetail?.email);
  const [userImage, setUserImage] = useState(userData?.userDetail?.image);
  const [userFullName, setUserFullName] = useState(userData?.userDetail?.name);
  const [isOpen, setIsOpen] = useState(false);

  const saveProfileData = () => {
    setIsError(true);
    if (userFullName == '' || userEmail == '') {
      return false;
    } else if (
      validationHelper.nameValidation(userFullName).trim() !== '' ||
      validationHelper.emailValidation(userEmail) !== ''
    ) {
      return false;
    } else {
      Keyboard.dismiss();
      setIsLoading(true);
      let params = {
        gender: gender,
        email: userEmail,
        image: updateImage,
        name: userFullName,
        user_id: userData?.userDetail?.id,
      };
      postApi(EDIT_PROFILE_API, params, onSuccess, onFailure, userData);
    }
  };
  const onSuccess = success => {
    if (success.status) {
      dispatch(saveUserDetails(success.user));
      dispatch(saveNotificationSetting(success.user?.notification));
      dispatch(saveReferralPoint(success.user.point));
      saveDataInAsync(
        'UserData',
        success.user,
        () => {},
        () => {},
      );
      saveDataInAsync(
        'isNotification',
        success.user.notification,
        () => {},
        () => {},
      );
      saveDataInAsync(
        'referralPoint',
        success.user.point,
        () => {},
        () => {},
      );
      Toast.show(success.message, Toast.LONG);
      onBackPress();
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Toast.show(success.message, Toast.LONG);
    }
  };

  const onFailure = error => {
    setIsLoading(false);
  };
  console.log(isOpen);

  const openCamera = () => {
    setIsOpen(false);
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      })
        .then(response => {
          setUpdateImage({
            path: response.path,
            mime: response.mime,
            name: response.modificationDate,
          });
          setUserImage(response.path);
          setIsOpen(false);
        })
        .catch(error => {
          if (error == 'Error: User did not grant camera permission.') {
            Alert.alert('Alert', 'Camera permission needed!', [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'OK', onPress: () => Linking.openSettings()},
            ]);
          }
        });
    }, 600);
  };
  const imagePicker = () => {
    setIsOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        mediaType: 'photo',
      })
        .then(response => {
          setUpdateImage({
            path: response.path,
            mime: response.mime,
            name: response.modificationDate,
          });
          setUserImage(response.path);
          setIsOpen(false);
        })
        .catch(error => {
          if (error == 'Error: User did not grant library permission.') {
            Alert.alert('Alert', 'Gallery permission needed!', [
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
              {text: 'OK', onPress: () => Linking.openSettings()},
            ]);
          }
        });
    }, 600);
  };
  const onChangeUserName = text => {
    setIsError(false);
    setUserFullName(text);
  };

  const onChangeEmail = text => {
    setIsError(false);
    setUserEmail(text);
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  return (
    <BaseContainer headerText={'Edit Profile'} onPress={onBackPress} isLeftIcon>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageViewStyle}>
          <FastImage
            style={styles.profileImgStyle}
            source={
              userImage == '' || userImage == null
                ? Assets.noImage
                : {uri: userImage}
            }
          />
          <HRBorderedBtnComponent
            onPress={() => setIsOpen(true)}
            btnText={'Edit Picture'}
          />
        </View>
        <HRTextInput
          value={userFullName}
          txtHeader={'Full Name'}
          textInputStyle={styles.edit1TextInputStyle}
          onChangeText={text => onChangeUserName(text)}
          errorText={
            isError ? validationHelper.nameValidation(userFullName).trim() : ''
          }
        />
        <HRTextInput
          value={userEmail}
          txtHeader={'Email Address'}
          keyboardType={'email-address'}
          onChangeText={text => onChangeEmail(text)}
          errorText={
            isError ? validationHelper.emailValidation(userEmail).trim() : ''
          }
        />
        <HRGenderComponent
          arrayItem={genderArray}
          gender={userData.userDetail.gender}
          genderValue={data => (gender = data)}
        />
      </KeyboardAwareScrollView>
      <HRThemeBtn
        btnText={'Save'}
        isLoading={isLoading}
        style={styles.btnStyle}
        onPress={saveProfileData}
      />
      <HRPopupView isVisible={isOpen} onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          onPress={() => setIsOpen(false)}
          activeOpacity={1.0}
          style={styles.modalViewStyle}>
          <View style={styles.commonViewStyle}>
            <Text style={styles.stateTextStyle}>Please select an option</Text>
            <View style={styles.btnViewStyle}>
              <View style={{flexDirection: 'row'}}>
                <HRThemeBtn
                  btnText={'Camera'}
                  onPress={openCamera}
                  style={styles.redeemBtnStyle}
                />
                <HRThemeBtn
                  btnText={'Gallery'}
                  onPress={imagePicker}
                  style={styles.redeemBtnStyle}
                />
              </View>
              <HRThemeBtn
                onPress={() => setIsOpen(false)}
                btnText={'Cancel'}
                style={styles.cancelBtnStyle}
                btnTextStyle={styles.bookTxtStyle}
              />
            </View>
          </View>
        </TouchableOpacity>
      </HRPopupView>
    </BaseContainer>
  );
};
export default EditProfileContainer;
const styles = StyleSheet.create({
  redeemBtnStyle: {
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
  bookTxtStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },
  cancelBtnStyle: {
    borderWidth: 0.5,
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },
  imageViewStyle: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnViewStyle: {
    marginTop: 10,
    alignItems: 'center',
  },

  stateTextStyle: {
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
  },
  commonViewStyle: {
    padding: 10,
    width: '90%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 1,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 2,
      },
    }),
  },
  modalViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  edit1TextInputStyle: {
    textTransform: 'capitalize',
  },

  profileImgStyle: {
    width: widthPercentageToDP(25),
    height: widthPercentageToDP(25),
    borderRadius: widthPercentageToDP(25) / 2,
  },

  btnStyle: {
    marginVertical: 15,
    marginHorizontal: 20,
  },
});
