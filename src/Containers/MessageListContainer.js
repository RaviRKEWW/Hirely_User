import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  Keyboard,
  FlatList,
  Platform,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Linking,
  Modal,
  ActivityIndicator,
  AppState,
} from 'react-native';
import io from 'socket.io-client';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {postApi} from '../Utils/ServiceManager';
import FastImage from 'react-native-fast-image';
import HRMsgComponent from '../Components/HRMsgComponent';
import {
  getProportionalFontSize,
  IMAGE_PREVIEW_CHAT,
  SEND_IMAGES_CHAT,
} from '../Utils/HRConstant';
import {CHAT_BASE_URL, GET_MESSAGE_API} from '../Utils/HRConstant';
import KeyboardManager from 'react-native-keyboard-manager';
import {Icon} from 'react-native-elements';
import HRPopupView from '../Components/HRPopView';
import HRThemeBtn from '../Components/HRThemeBtn';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-simple-toast';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import ImageViewer from 'react-native-image-zoom-viewer';
import BackgroundTimer from 'react-native-background-timer';

var moment = require('moment');
const socket = io(CHAT_BASE_URL);
const MessageListContainer = props => {
  const scrollRef = useRef(null);
  const [sendMsg, setSendMsg] = useState('');
  const [isEmoji, setIsEmoji] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  let userData = useSelector(state => state.userOperation);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadImg, setUploadImg] = useState([]);
  const [modal, setModal] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);
  const [imageIndex, setImageIndex] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  // const [apiRes, setApiRes] = useState([]);
  const appState = useRef(AppState.currentState);
  var interval;

  const _handleAppStateChange = nextAppState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
      //clearInterval when your app has come back to the foreground
      BackgroundTimer.clearInterval(interval);
    } else {
      //app goes to background
      console.log('app goes to background');
      //tell the server that your app is still online when your app detect that it goes to background
      interval = BackgroundTimer.setInterval(() => {
        socket.emit('user_connected', userData?.userDetail?.id);
        let chatParams = {
          sender_id: props?.route?.params?.senderId,
          receiver_id: userData.userDetail.id,
        };
        postApi(GET_MESSAGE_API, chatParams, onSuccess, onFailure, userData);
      }, 5000);
      appState.current = nextAppState;
      console.log('AppState', appState.current);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => AppState.removeEventListener('change', _handleAppStateChange);
  }, []);
  useEffect(() => {
    getMessageList();
    getPreviewImages();
    socket.on('new_message', data => {
      getLatestMessage(data);
    });
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    if (Platform.OS == 'ios') {
      KeyboardManager.setEnable(false);
      KeyboardManager.setShouldResignOnTouchOutside(false);
    }

    return () => {
      if (Platform.OS == 'ios') {
        KeyboardManager.setShouldResignOnTouchOutside(true);
        KeyboardManager.setEnable(true);
      }
    };
  }, []);

  const _keyboardDidShow = e => {
    setKeyboardHeight(e?.endCoordinates?.height);
  };

  const _keyboardDidHide = e => {
    setKeyboardHeight(0);
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  const getLatestMessage = data => {
    const newMsgObject = {
      message: data.message,
      sender_id: data.sender_id,
      id: messageList.length + 1,
      receiver_id: data.receiver_id,
      created_at: data.created_at,
      type: data.type,
      image: data?.image,
    };
    if (props?.route?.params?.senderId == data.sender_id) {
      setMessageList(messagelist => [newMsgObject, ...messagelist]);
    }
  };
  const getMessageList = () => {
    setIsLoading(true);
    socket.emit('user_connected', userData.userDetail.id);
    let chatParams = {
      sender_id: props?.route?.params?.senderId,
      receiver_id: userData.userDetail.id,
    };
    postApi(GET_MESSAGE_API, chatParams, onSuccess, onFailure, userData);
  };
  const onSuccess = successResponse => {
    setIsLoading(false);
    if (successResponse.chat.length > 0) {
      setMessageList(successResponse.chat);
      if (successResponse.chat.length > 10) {
        scrollRef.current.scrollToOffset({y: 0, animated: true});
      }
    }
  };
  const getPreviewImages = () => {
    let chatParams = {
      sender_id: props?.route?.params?.senderId,
      receiver_id: userData.userDetail.id,
    };
    postApi(
      IMAGE_PREVIEW_CHAT,
      chatParams,
      res => {
        if (res?.status) {
          setImagePreview(res?.data);
        }
      },
      err => console.log('err::', err),
      userData,
    );
  };
  const onFailure = error => {
    setIsLoading(false);
    console.log(error);
  };
  const onSendMessageClick = () => {
    if (uploadImg?.length > 0) {
      setIsBtnLoading(true);
      let tempMsgData = messageList;
      const sendMsgObject = {
        'images[]': uploadImg,
        sender_id: userData.userDetail.id,
        receiver_id: props?.route?.params?.senderId,
        message: sendMsg.trim(),
      };
      postApi(
        SEND_IMAGES_CHAT,
        sendMsgObject,
        res => {
          setIsBtnLoading(false);
          if (res?.status) {
            res?.data?.map((x, index) => {
              let newMsg = {
                image: x?.image,
                id: tempMsgData.length + 1,
                sender_id: userData.userDetail.id,
                created_at: moment().utc().utcOffset(8),
                receiver_id: props?.route?.params?.senderId,
                type: 1,
                message: index === 0 ? sendMsg?.trim() : '',
              };
              tempMsgData.unshift(newMsg);
              const socketObject = {
                image: x?.image,
                sender_id: userData.userDetail.id,
                receiver_id: props?.route?.params?.senderId,
                type: 1,
                message: index === 0 ? sendMsg?.trim() : '',
              };
              socket.emit('send_message', socketObject);
            });

            scrollRef.current.scrollToOffset({y: 0, animated: true});
            setUploadImg([]);
            getPreviewImages();
            setSendMsg('');
          }
        },
        () => {
          setIsBtnLoading(false);
        },
      );
    } else {
      let tempMsgData = messageList;
      let newMsg = {
        message: sendMsg.trim(),
        id: tempMsgData.length + 1,
        sender_id: userData.userDetail.id,
        created_at: moment().utc().utcOffset(8),
        receiver_id: props?.route?.params?.senderId,
        type: 0,
      };
      tempMsgData.unshift(newMsg);
      const sendMsgObject = {
        message: sendMsg.trim(),
        sender_id: userData.userDetail.id,
        receiver_id: props?.route?.params?.senderId,
        type: 0,
      };
      socket.emit('send_message', sendMsgObject);
      scrollRef.current.scrollToOffset({y: 0, animated: true});
      setSendMsg('');
    }
  };

  const handlePick = emojiObject => {
    setSendMsg(sendMsg + emojiObject.emoji);
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
          setUploadImg(img => [image, ...img]);
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
    }, 1000);
  };
  const imagePicker = () => {
    setIsOpen(false);
    setTimeout(() => {
      ImagePicker.openPicker({
        forceJpg: true,
        multiple: true,
        mediaType: 'photo',
        maxFiles: 3,
      })
        .then(response => {
          if (response.length + uploadImg.length > 3) {
            Toast.show('You can select only 3 images!', Toast.LONG);
          } else {
            response.map(item => {
              let image = {
                path: item.path,
                mime: item.mime,
                name: item.modificationDate,
              };
              setUploadImg(img => [image, ...img]);
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
    }, 1000);
  };
  const removeSelectedImage = (item, index) => {
    if (uploadImg.length == 1) {
      setUploadImg([]);
    } else {
      setUploadImg(uploadImg.filter((x, newIndex) => newIndex !== index));
    }
  };
  const typeMsgView = () => {
    return (
      <View>
        {uploadImg?.length > 0 && (
          <View
            style={[
              styles.imgViewStyle,
              {
                marginVertical: uploadImg.length > 0 ? 10 : 0,
              },
            ]}>
            {uploadImg?.map((item, index) => {
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
          </View>
        )}
        <View style={[styles.msgTypeViewStyle]}>
          {/* <TouchableOpacity activeOpacity={1.0} onPress={() => setIsEmoji(true)}>
          <Image source={Assets.emoji} style={styles.iconStyle} />
          <EmojiPicker
            open={isEmoji}
            onEmojiSelected={handlePick}
            onClose={() => setIsEmoji(false)}
          />
        </TouchableOpacity> */}

          <TextInput
            multiline
            value={sendMsg}
            style={styles.msgTextInputStyle}
            placeholder={'Start Typing... '}
            onChangeText={text => setSendMsg(text)}
          />
          {isBtnLoading ? (
            <ActivityIndicator size={'small'} color={HRColors.primary} />
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={() => {
                  if (uploadImg.length < 3) {
                    setIsOpen(true);
                  } else {
                    Toast.show('You can select only 3 images!', Toast.LONG);
                  }
                }}>
                <Image
                  source={Assets.imagePicker}
                  style={[
                    styles.imagePicker,
                    {
                      tintColor: HRColors.primary,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={onSendMessageClick}
                disabled={
                  (sendMsg && sendMsg.trim() != '') || uploadImg?.length > 0
                    ? false
                    : true
                }>
                <Image
                  source={Assets.sendMsg}
                  style={[
                    styles.iconStyle,
                    {
                      tintColor:
                        (sendMsg && sendMsg.trim() != '') ||
                        uploadImg?.length > 0
                          ? HRColors.primary
                          : '#d4d4d4',
                    },
                  ]}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };
  const onPressImage = item => {
    const images = messageList?.filter(x => x?.type === 1);
    images?.map((x, index) => {
      if (x === item) {
        setImageIndex(index);
        setModal(true);
      }
    });
  };
  const msgSectionList = () => {
    return (
      <View style={{flex: 1}}>
        <FlatList
          style={{paddingBottom: 20}}
          ref={scrollRef}
          inverted
          data={messageList}
          showsVerticalScrollIndicator={false}
          keyExtractor={({item, index}) => index}
          renderItem={({item, index}) => {
            return (
              <HRMsgComponent
                onPress={() => onPressImage(item)}
                item={item}
                index={index}
                userId={userData?.userDetail?.id}
                // isPaid={item.type == 'msg' ? false : true}
              />
            );
          }}
        />
        {typeMsgView()}
      </View>
    );
  };
  return (
    <>
      <View style={styles.mainViewStyle}>
        {isLoading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <ActivityIndicator
              size={'large'}
              animating={true}
              color={HRColors.primary}
              hidesWhenStopped={false}
            />
          </View>
        ) : (
          <>
            <View style={styles.flexRowStyle}>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={onBackPress}
                style={styles.backBtnStyle}>
                <Icon
                  size={25}
                  name="arrowleft"
                  color={'#1C2D41'}
                  type={'antdesign'}
                />
              </TouchableOpacity>
              <FastImage
                style={styles.chatImgStyle}
                source={
                  props?.route?.params?.image == null ||
                  props?.route?.params?.image == ''
                    ? Assets.noImage
                    : {
                        uri: props?.route?.params?.image,
                      }
                }
              />
              <Text style={styles.headerTitleStyle} numberOfLines={1}>
                {props?.route?.params?.name}
              </Text>
            </View>
            {Platform.OS == 'ios' ? (
              <>
                <KeyboardAvoidingView
                  style={{flex: 1}}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                  behavior="padding">
                  {msgSectionList()}
                </KeyboardAvoidingView>
                {/* {typeMsgView()} */}
              </>
            ) : (
              msgSectionList()
            )}
            <HRPopupView
              isVisible={isOpen}
              onRequestClose={() => setIsOpen(false)}>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                activeOpacity={1.0}
                style={styles.modalViewStyle}>
                <View style={styles.commonViewStyle}>
                  <Text style={styles.stateTextStyle}>
                    Please select an option
                  </Text>
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
            <Modal
              onRequestClose={() => setModal(false)}
              visible={modal}
              transparent={true}>
              <ImageViewer
                saveToLocalByLongPress={false}
                enableSwipeDown
                onCancel={() => setModal(false)}
                loadingRender={() => (
                  <ActivityIndicator size={'small'} color={HRColors.primary} />
                )}
                imageUrls={imagePreview}
                index={imageIndex}
              />
            </Modal>
          </>
        )}
      </View>
      {/* // </BaseContainer> */}
    </>
  );
};
export default MessageListContainer;
const styles = StyleSheet.create({
  modalStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
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
  imgViewStyle: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: HRColors.grayBg,
    padding: 10,
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
  modalViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  mainViewStyle: {
    flex: 1,
    paddingBottom: Platform.OS == 'ios' ? 20 : 0,
    paddingTop: 20,
    backgroundColor: HRColors.white,
  },

  headerTitleStyle: {
    flex: 1,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  msgHeaderViewStyle: {
    borderRadius: 15,
    marginVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    backgroundColor: '#FEE6E6',
  },

  dateTextStyle: {
    paddingVertical: 5,
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(9),
  },

  msgTextInputStyle: {
    flex: 1,
    padding: 10,
    color: HRColors.black,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(14),
  },

  msgTypeViewStyle: {
    bottom: 5,
    maxHeight: 110,
    borderWidth: 0.3,
    borderRadius: 10,
    // position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    backgroundColor: HRColors.white,
    borderColor: HRColors.grayBorder,
  },

  flexRowStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: Platform.OS == 'ios' ? 30 : 0,
    paddingHorizontal: 20,
  },

  chatImgStyle: {
    width: 45,
    height: 45,
    marginEnd: 10,
    marginStart: 20,
    borderRadius: 45 / 2,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
  backBtnStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    marginVertical: 10,
    borderColor: '#D4D9D9',
  },
  imagePicker: {
    marginEnd: 10,
  },
});
