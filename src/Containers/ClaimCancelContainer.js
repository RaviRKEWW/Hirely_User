import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Alert,
  Linking,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import {
  HELP_CLAIM_CANCEL_API,
  getProportionalFontSize,
  SUBJECT_HELP_CANCEL_CLAIM,
} from '../Utils/HRConstant';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import HRPopupView from '../Components/HRPopView';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import BaseContainer from '../Components/BaseContainer';
import {postApi, getApi} from '../Utils/ServiceManager';
import ImagePicker from 'react-native-image-crop-picker';
import ValidationHelper from '../Utils/ValidationHelper';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import HRDropDownPickerComponent from '../Components/HRDropDownPickerComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const ClaimCancelContainer = props => {
  const [, setState] = useState('');
  var validationHelper = new ValidationHelper();
  const [isError, setIsError] = useState(false);
  const [uploadImg, setUploadImg] = useState([]);
  const [headerText, setHeaderText] = useState('');
  const [isClaimed, setIsClaimed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [noInternet, setNoInternet] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [claimCancelReason, setClaimCancelReason] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHeaderText(props?.route?.params?.headerText);
    getSubjectForClaimCancel();
  }, []);

  const getSubjectForClaimCancel = () => {
    let url = SUBJECT_HELP_CANCEL_CLAIM + props?.route?.params?.headerText;
    getApi(url, onSubjectSuccess, onSubjectFailure, userData);
  };
  const onSubjectSuccess = success => {
    if (success.status) {
      if (success.data.length > 0) {
        success.data.map(item => {
          let body = {};
          body.value = item.name;
          body.label = item.title;
          claimCancelReason.push(body);
        });
      }
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
    }
  };

  const onSubjectFailure = error => {
    // close loader here and show toast
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };
  const onSubmit = () => {
    setIsError(true);
    if (selectedSubject == '' || description == '') {
      return false;
    } else if (
      validationHelper.descriptionValidation(description).trim() !== '' ||
      validationHelper.isEmptyValidation(selectedSubject) !== ''
    ) {
      return false;
    } else {
      Keyboard.dismiss();
      setIsLoading(true);
      let param = {
        'images[]': uploadImg,
        reason: selectedSubject,
        description: description,
        user_id: userData?.userDetail.id,
        flag: props?.route?.params?.headerText,
        order_id: props?.route?.params?.orderId,
      };
      postApi(HELP_CLAIM_CANCEL_API, param, onSuccess, onFailure, userData);
    }
  };
  const onSuccess = success => {
    if (success.status) {
      setIsError(false);
      Toast.show(success.message, Toast.LONG);
      setDescription('');
      setSelectedSubject('');
      setUploadImg([]);
      setIsLoading(false);
      if (props?.route?.params?.headerText == 'claim') {
        setIsClaimed(true);
      } else {
        onBackPress();
      }
    } else {
      setIsLoading(false);
      Toast.show(success.message, Toast.LONG);
    }
  };

  const onFailure = error => {
    setUploadImg([]);
    setIsLoading(false);
  };

  const openCamera = () => {
    setIsOpen(false);
    setTimeout(() => {
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      })
        .then(response => {
          let image = {
            path: response.path,
            mime: response.mime,
            name: response.modificationDate,
          };
          uploadImg.push(image);
          setIsOpen(false);
          setState(item);
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
  console.log('res::', uploadImg);
  const imagePicker = () => {
    setIsOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        forceJpg: true,
        multiple: true,
        mediaType: 'photo',
        maxFiles: 5,
      })
        .then(response => {
          if (response.length + uploadImg.length > 5) {
            Toast.show('You can select only 5 images!', Toast.LONG);
          } else {
            response.map(item => {
              let image = {
                path: item.path,
                mime: item.mime,
                name: item.modificationDate,
              };
              uploadImg.push(image);
              setState(item);
              setIsOpen(false);
            });
          }
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
  const onChangeDescription = text => {
    setIsError(false);
    setDescription(text);
  };
  const removeSelectedImage = (item, index) => {
    if (uploadImg.length == 1) {
      setUploadImg([]);
    } else {
      uploadImg.splice(index, 1);
      setState(index);
    }
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    getSubjectForClaimCancel();
  };

  const onClose = () => {
    setIsClaimed(false);
    onBackPress();
  };
  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      noInternet={noInternet}
      headerText={headerText}
      onInternetRefresh={onInternetRefresh}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}>
        <HRDropDownPickerComponent
          headerText={'Reason'}
          value={selectedSubject}
          item={claimCancelReason}
          openDropDown={openDropDown}
          setValue={setSelectedSubject}
          placeholder={'Select reason'}
          defaultValue={'Select reason'}
          setOpenDropDown={setOpenDropDown}
          onChangeDropDownValue={data => setSelectedSubject(data)}
        />
        {isError ? (
          <Text style={styles.errorTextStyle}>
            {validationHelper.isEmptyValidation(selectedSubject).trim()}
          </Text>
        ) : null}
        <HRTextInput
          inputContainerStyle={{
            height: 120,
            alignSelf: 'flex-start',
            overflow: 'hidden',
            paddingBottom: Platform.OS == 'ios' ? 30 : 15,
          }}
          multiline
          numberOfLines={3}
          value={description}
          txtHeader={'Description'}
          textInputStyle={styles.desTextInputStyle}
          onChangeText={text => onChangeDescription(text)}
          errorText={
            isError
              ? validationHelper.descriptionValidation(description).trim()
              : ''
          }
          style={styles.desViewStyle}
        />
        <View
          style={[
            styles.imgViewStyle,
            {
              marginVertical: uploadImg.length > 0 ? 10 : 0,
            },
          ]}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            contentContainerStyle={{
              paddingVertical: uploadImg.length > 0 ? 10 : 0,
            }}>
            {uploadImg.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => removeSelectedImage(item, index)}>
                  <FastImage
                    source={{uri: item.path}}
                    style={styles.imgStyle}
                  />
                  <View style={styles.removeIconStyle}>
                    <Icon
                      size={25}
                      name="cancel"
                      type={'materialicons'}
                      color={HRColors.primary}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <HRThemeBtn
          onPress={() => {
            if (uploadImg.length < 5) {
              setIsOpen(true);
            } else {
              Toast.show('You can select only 5 images!', Toast.LONG);
            }
          }}
          btnText={'Upload Image'}
          style={styles.uploadBtnStyle}
          btnTextStyle={styles.uploadTextStyle}
        />
        <HRThemeBtn
          onPress={onSubmit}
          isLoading={isLoading}
          style={styles.btnStyle}
        />
      </KeyboardAwareScrollView>
      <HRPopupView isVisible={isClaimed} onRequestClose={onClose}>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={1.0}
          style={styles.redeemViewStyle}>
          <View style={styles.commonViewStyle}>
            <Text style={styles.redeemText1Style}>
              You will receive a response email within 2 days
            </Text>
            <HRThemeBtn
              onPress={onClose}
              btnText={'Close'}
              style={styles.cancelBtnStyle}
              btnTextStyle={styles.bookTxtStyle}
            />
          </View>
        </TouchableOpacity>
      </HRPopupView>
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
export default ClaimCancelContainer;
const styles = StyleSheet.create({
  contentContainerStyle: {
    marginTop: 20,
  },
  redeemBtnStyle: {
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
  btnViewStyle: {
    marginTop: 10,
    alignItems: 'center',
  },
  stateTextStyle: {
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
  },
  modalViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  imgViewStyle: {
    marginHorizontal: 20,
    flexDirection: 'row',
  },

  removeIconStyle: {
    top: -10,
    right: 7,
    position: 'absolute',
  },

  imgStyle: {
    marginEnd: 7,
    borderRadius: 30,
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
    borderColor: HRColors.textTitleColor,
  },

  desTextInputStyle: {
    height: 80,
    paddingVertical: 20,
  },

  desViewStyle: {
    marginHorizontal: 20,
  },

  uploadTextStyle: {
    color: HRColors.primary,
  },

  uploadBtnStyle: {
    borderWidth: 1,
    borderRadius: 7,
    marginVertical: 20,
    marginHorizontal: 20,
    borderStyle: 'dashed',
    backgroundColor: '#FFF9F8',
    borderColor: HRColors.primary,
  },

  errorTextStyle: {
    color: 'red',
    marginTop: 5,
    marginStart: 20,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },

  btnStyle: {
    marginHorizontal: 20,
  },

  redeemViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },

  commonViewStyle: {
    padding: 10,
    width: '90%',
    borderRadius: 10,
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

  redeemText1Style: {
    marginTop: 10,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  cancelBtnStyle: {
    borderWidth: 0.5,
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  bookTxtStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },
});
