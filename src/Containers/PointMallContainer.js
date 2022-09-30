import React, {useEffect, useState, useCallback} from 'react';
import {
  Text,
  View,
  Share,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRPopupView from '../Components/HRPopView';
import HRThemeBtn from '../Components/HRThemeBtn';
import {useDispatch, useSelector} from 'react-redux';
import HRListLoader from '../Components/HRListLoader';
import BaseContainer from '../Components/BaseContainer';
import {saveReferralPoint} from '../redux/Actions/User';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import NoDataComponent from '../Components/NoDataComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRVoucherComponent from '../Components/HRVoucherComponent';
import {APPLY_VOUCHER_API, POINT_MALL_ONE_API} from '../Utils/HRConstant';
import {useFocusEffect} from '@react-navigation/native';
const screenHeight = Dimensions.get('window').height;
let pageCount = 1;
let endReached = true;

const PointMallContainer = props => {
  const dispatch = useDispatch();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [noInternet, setNoInternet] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);
  const [selectedVoucherIndex, setVoucherIndex] = useState('');
  const [openVoucherModel, setOpenVoucherModel] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    props.navigation.addListener('focus', () => {
      getVouchers();
    });
  }, [props.navigation]);
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
  const getVouchers = () => {
    let vouchersParam = {
      page: pageCount,
      user_id: userData.userDetail.id,
    };
    postApi(POINT_MALL_ONE_API, vouchersParam, onSuccess, onFailure, userData);
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      dispatch(saveReferralPoint(successResponse.total_point));
      saveDataInAsync(
        'referralPoint',
        successResponse.total_point,
        () => {},
        () => {},
      );
      if (pageCount == 1) {
        setVoucherData(successResponse.data);
        stopAllLoader();
        endReached = successResponse.data?.length < 10 ? false : true;
      } else if (successResponse.data?.length < 10) {
        endReached = false;
        setVoucherData([...voucherData, ...successResponse.data]);
        stopAllLoader();
      } else if (successResponse.data?.length !== 0) {
        setVoucherData([...voucherData, ...successResponse.data]);
        stopAllLoader();
      }
      setNoInternet(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      stopAllLoader();
    }
  };

  const onFailure = error => {
    stopAllLoader();
  };

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      pageCount = 1;
      getVouchers();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const stopAllLoader = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getVouchers();
  };

  const navigateToCurrentVouchers = () => {
    props.navigation.navigate('currentVouchers');
  };
  const onVoucherPress = (item, index) => {
    if (item?.is_voucher) {
      setVoucherIndex(index);
      setOpenVoucherModel(true);
    } else {
      Toast.show(
        'Your usage limit for this voucher has already reached. Please try another one.',
        Toast.LONG,
      );
    }
  };
  const openShareSheet = async () => {
    try {
      const result = await Share.share({
        message: `Hey, Hirely is the latest app for affordable home services! Please download and use my referral code ${userData?.userDetail?.referral_code} to get a 10% discount on your order. 
Play Store: http://play.google.com/store/apps/details?id=com.hirely
App Store: https://apps.apple.com/sg/app/app-name/id1594362715`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const onClose = () => {
    setOpenVoucherModel(false);
  };

  const onRedeemPress = () => {
    let redeemVoucherParam = {
      user_id: userData.userDetail.id,
      voucher_id: voucherData[selectedVoucherIndex].id,
    };
    postApi(
      APPLY_VOUCHER_API,
      redeemVoucherParam,
      onRedeemSuccess,
      onRedeemFailure,
      userData,
    );
  };
  const onRedeemSuccess = success => {
    if (success.status) {
      Toast.show(success.message, Toast.LONG);
      setOpenVoucherModel(false);
      navigateToCurrentVouchers();
    } else {
      Toast.show(success.message, Toast.LONG);
    }
  };

  const onRedeemFailure = error => {
    console.log(error);
  };
  const renderVoucherItem = ({item, index}) => {
    return (
      <HRVoucherComponent
        item={item}
        onPress={() => onVoucherPress(item, index)}
      />
    );
  };
  console.log(userData.point);
  return (
    <BaseContainer headerText={'Point Mall'}>
      <View style={styles.upperViewStyle}>
        <Text style={styles.pointTextStyle}>{userData.point ?? 0}</Text>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={openShareSheet}
          style={styles.pointIconViewStyle}>
          <Icon
            size={18}
            name="groups"
            type="materialicons"
            color={HRColors.primary}
            style={styles.groupIconStyle}
          />
          <Text style={styles.pointLabelStyle}> Refer a friend</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={navigateToCurrentVouchers}
        style={styles.currentVoucherViewStyle}>
        <Text style={styles.currentTextStyle}>Current Vouchers</Text>
        <Icon size={20} name="right" type="antdesign" />
      </TouchableOpacity>
      {isLoading ? (
        <HRListLoader style={styles.loaderStyle} isList />
      ) : (
        <FlatList
          windowSize={10}
          data={voucherData}
          style={{marginTop: 10}}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          legacyImplementation={true}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          renderItem={renderVoucherItem}
          ListEmptyComponent={
            noInternet ? (
              <NoDataComponent
                onPress={onInternetRefresh}
                style={styles.noDataViewStyle}
                text={'No internet connection'}
                noDataImage={Assets.noInternetIcon}
              />
            ) : (
              <NoDataComponent style={styles.noDataViewStyle} />
            )
          }
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            isLastLoading ? <HRListLoader style={styles.loaderStyle} /> : null
          }
          onEndReached={({distanceFromEnd}) => {
            if (endReached) {
              setIsLastLoading(true);
              pageCount = pageCount + 1;
              getVouchers();
            }
          }}
        />
      )}
      <HRPopupView isVisible={openVoucherModel} onRequestClose={onClose}>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={1.0}
          style={styles.redeemViewStyle}>
          <View style={styles.commonViewStyle}>
            {voucherData[selectedVoucherIndex]?.image ? (
              <Image
                style={styles.redeemIconStyle}
                source={{uri: voucherData[selectedVoucherIndex].image}}
              />
            ) : null}

            <Text style={styles.redeemText1Style}>
              Redeem voucher to get {voucherData[selectedVoucherIndex]?.title}{' '}
              on your orders!
            </Text>
            <Text style={styles.redeemText2Style}>
              Your{' '}
              <Text style={styles.redeemText3Style}>
                {voucherData[selectedVoucherIndex]?.point}
              </Text>{' '}
              points will be deduct when you redeem this voucher.
            </Text>

            <View style={styles.btnViewStyle}>
              <HRThemeBtn
                onPress={onClose}
                btnText={'Cancel'}
                style={styles.cancelBtnStyle}
                btnTextStyle={styles.bookTxtStyle}
              />
              <HRThemeBtn
                btnText={'Redeem'}
                onPress={onRedeemPress}
                style={styles.redeemBtnStyle}
              />
            </View>
          </View>
        </TouchableOpacity>
      </HRPopupView>
    </BaseContainer>
  );
};

export default PointMallContainer;
const styles = StyleSheet.create({
  upperViewStyle: {
    padding: 20,
    marginTop: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#FFF6F6',
  },

  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },

  pointIconViewStyle: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  pointTextStyle: {
    color: '#232B66',
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(52),
  },

  pointLabelStyle: {
    color: '#36455A',
    marginHorizontal: 2.5,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(18),
  },

  currentVoucherViewStyle: {
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.3,
    justifyContent: 'space-between',
  },

  currentTextStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  groupIconStyle: {
    padding: 3,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: HRColors.primary,
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

  cancelBtnStyle: {
    borderWidth: 0.5,
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  btnViewStyle: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  noDataViewStyle: {
    height: screenHeight / 2,
  },

  redeemViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },

  redeemIconStyle: {
    width: 50,
    height: 50,
    marginVertical: 10,
    resizeMode: 'contain',
  },

  redeemText1Style: {
    textAlign: 'center',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  redeemText2Style: {
    marginTop: 7,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(16),
  },

  redeemText3Style: {
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },
});
