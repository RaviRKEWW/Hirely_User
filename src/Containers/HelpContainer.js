import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Alert,
  Linking,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  Platform,
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
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import BaseContainer from '../Components/BaseContainer';
import {postApi, getApi} from '../Utils/ServiceManager';
import ValidationHelper from '../Utils/ValidationHelper';
import ImagePicker from 'react-native-image-crop-picker';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import HRDropDownPickerComponent from '../Components/HRDropDownPickerComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useFocusEffect} from '@react-navigation/native';
import HRPopupView from '../Components/HRPopView';
import {ScrollView} from 'react-native';
const HelpContainer = props => {
  const [, setState] = useState('');
  const [isError, setIsError] = useState(false);
  var validationHelper = new ValidationHelper();
  const [uploadImg, setUploadImg] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [helpSubject, setHelpSubject] = useState([]);
  const [description, setDescription] = useState('');
  const [noInternet, setNoInternet] = useState(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getHelpSubjectList();
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!userData.userDetail.id) {
        Alert.alert('Hirely', 'Please login to access this section', [
          {
            text: 'Cancel',
            onPress: () => props.navigation.navigate('Home'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () =>
              props.navigation.reset({
                index: 0,
                routes: [{name: 'login'}],
              }),
          },
        ]);
        return true;
      }
    }, [props.navigation]),
  );

  const getHelpSubjectList = () => {
    getApi(
      SUBJECT_HELP_CANCEL_CLAIM + 'help',
      onSubjectSuccess,
      onSubjectFailure,
      userData,
    );
  };
  const onSubjectSuccess = success => {
    if (success.status) {
      if (success.data.length > 0) {
        success.data.map(item => {
          let body = {};
          body.value = item.name;
          body.label = item.title;
          helpSubject.push(body);
        });
      }
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
      // close loader here
    }
  };

  const onSubjectFailure = error => {};
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
      setIsLoading(true);
      Keyboard.dismiss();
      let params = {
        flag: 'help',
        order_id: '0',
        'images[]': uploadImg,
        reason: selectedSubject,
        description: description,
        user_id: userData?.userDetail.id,
      };
      postApi(
        HELP_CLAIM_CANCEL_API,
        params,
        onHelpSuccess,
        onHelpFailure,
        userData,
      );
    }
  };
  const onHelpSuccess = success => {
    if (success.status) {
      setIsLoading(false);
      setIsError(false);
      setDescription('');
      setSelectedSubject('');
      setUploadImg([]);
      Toast.show(success.message, Toast.LONG);
    } else {
      Toast.show(success.message, Toast.LONG);
      setIsLoading(false);
    }
  };

  const onHelpFailure = error => {
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
  console.log('uploadImg::', uploadImg);
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

  const onInternetRefresh = () => {
    setNoInternet(false);
    getHelpSubjectList();
  };
  const removeSelectedImage = (item, index) => {
    if (uploadImg.length == 1) {
      setUploadImg([]);
    } else {
      uploadImg.splice(index, 1);
      setState(index);
    }
  };
  const onBackPress = () => {
    props?.navigation?.goBack();
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      headerText={'Help'}
      noInternet={noInternet}
      onInternetRefresh={onInternetRefresh}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}>
        <HRDropDownPickerComponent
          item={helpSubject}
          headerText={'Subject'}
          value={selectedSubject}
          openDropDown={openDropDown}
          setValue={setSelectedSubject}
          placeholder={'Select subject'}
          defaultValue={'Select subject'}
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
            paddingBottom: 30,
          }}
          multiline
          numberOfLines={3}
          value={description}
          txtHeader={'Description'}
          style={styles.desViewStyle}
          textInputStyle={styles.desTextInputStyle}
          onChangeText={text => onChangeDescription(text)}
          errorText={
            isError
              ? validationHelper.descriptionValidation(description).trim()
              : ''
          }
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
                    style={styles.imgStyle}
                    source={{uri: item.path}}
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
          style={styles.submitBtnStyle}
        />
      </KeyboardAwareScrollView>
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
export default HelpContainer;
const styles = StyleSheet.create({
  contentContainerStyle: {
    marginTop: 20,
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
  removeIconStyle: {
    top: -10,
    right: 7,
    position: 'absolute',
  },

  imgViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },

  imgStyle: {
    marginEnd: 7,
    borderRadius: 30,
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(15),
    borderColor: HRColors.textTitleColor,
  },

  desViewStyle: {
    marginHorizontal: 20,
  },

  desTextInputStyle: {
    height: 80,
    paddingTop: 20,
    paddingBottom: Platform.OS == 'ios' ? 20 : 0,
  },

  uploadTextStyle: {
    color: HRColors.primary,
  },

  uploadBtnStyle: {
    borderWidth: 1,
    borderRadius: 7,
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

  submitBtnStyle: {
    marginBottom: 25,
    marginHorizontal: 20,
  },
});
