import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Alert,
  Keyboard,
  FlatList,
  StyleSheet,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  MOBILE_API,
  PAY_HISTORY_API,
  STRIPE_HIRELY_PAY_API,
  STRIPE_PAY_TO_WALLET_API,
} from '../Utils/HRConstant';
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
import ValidationHelper from '../Utils/ValidationHelper';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import NoDataComponent from '../Components/NoDataComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRRequestComponent from '../Components/HRRequestComponent';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import HRBorderBtnComponent from '../Components/HRBorderedBtnComponent';
import HRTransferMoneyComponent from '../Components/HRTransferMoneyComponent';
import {useFocusEffect} from '@react-navigation/native';
const screenHeight = Dimensions.get('window').height;
let pageCount = 1;
let endReached = true;
let msg = 'Payment Request failed \n Please try again later !';
const HirelyPayContainer = props => {
  const dispatch = useDispatch();
  const [payingID, setPayingID] = useState('');
  var validationHelper = new ValidationHelper();
  const [isError, setIsError] = useState(false);
  const [payingName, setPayingName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [description, setDescription] = useState('');
  const [noInternet, setNoInternet] = useState(false);
  const [isNullAmount, setIsNullAmount] = useState('');
  const [amountToTrans, setAmountToTrans] = useState('');
  const [disableTouch, setDisableTouch] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const STRIPE_PUBLISH_KEY = userData.stripePk;
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isLastLoading, setIsLastLoading] = useState(false);
  const [mobileNoToTrans, setMobileNoToTrans] = useState('');
  const [isTransferEnable, setIsTransferEnable] = useState(false);
  const [openPayAmountView, setOpenPayAmountView] = useState(false);
  const [paymentCancelView, setPaymentCancelView] = useState(false);
  const {initPaymentSheet, presentPaymentSheet, retrievePaymentIntent} =
    useStripe();
  useEffect(() => {
    setIsListLoading(true);
    getPaymentHistory();
    props.navigation.addListener('blur', () => {
      setIsTransferEnable(false);
      setOpenPayAmountView(false);
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
  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      pageCount = 1;
      getPaymentHistory();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const getPaymentHistory = () => {
    setDisableTouch(false);
    let params = {
      page: pageCount,
      user_id: userData.userDetail.id,
    };
    postApi(PAY_HISTORY_API, params, onListSuccess, onListFailure, userData);
  };
  const onListSuccess = successResponse => {
    if (successResponse.status) {
      dispatch(saveReferralPoint(successResponse.total_point));
      saveDataInAsync(
        'referralPoint',
        successResponse.total_point,
        () => {},
        () => {},
      );
      if (pageCount == 1) {
        setPaymentHistory(successResponse.data);
        stopListLoaders();
        endReached = successResponse.data?.length < 10 ? false : true;
      } else if (successResponse.data?.length < 10) {
        endReached = false;
        setPaymentHistory([...paymentHistory, ...successResponse.data]);
        stopListLoaders();
      } else if (successResponse.data?.length !== 0) {
        setPaymentHistory([...paymentHistory, ...successResponse.data]);
        stopListLoaders();
      }
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      stopListLoaders();
    }
  };

  const onListFailure = error => {
    stopListLoaders();
  };

  const stopListLoaders = () => {
    setIsListLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const onPressOnItem = () => {};
  const onPressCancel = () => {};

  const onPressPay = () => {
    // payment call here for request
  };

  const onPayUsingPress = () => {
    setIsTransferEnable(true);
  };

  const onPointMallPress = () => {
    props.navigation.navigate('pointmall');
  };
  const onClose = () => {
    setMobileNoToTrans('');
    setIsLoading(false);
    if (openPayAmountView) {
      setOpenPayAmountView(false);
    } else {
      setIsTransferEnable(false);
    }
  };

  const onChangeMobile = text => {
    setMobileNoToTrans(text);
    setIsError(false);
  };

  const onChangeAmount = text => {
    setAmountToTrans(text);
    setIsNullAmount('');
  };
  const onSearchMobile = () => {
    setIsError(true);
    if (mobileNoToTrans == '') {
      return false;
    } else if (validationHelper.mobileValidation(mobileNoToTrans) !== '') {
      return false;
    } else {
      Keyboard.dismiss();
      setIsLoading(true);
      setIsError(false);
      let params = {phone: mobileNoToTrans, user_id: userData.userDetail.id};
      postApi(MOBILE_API, params, onSearchSuccess, onSearchFailure, userData);
    }
  };
  const onSearchSuccess = successResponse => {
    if (successResponse.status) {
      setPayingName(successResponse.data.name);
      setPayingID(successResponse.data.id);
      setOpenPayAmountView(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onSearchFailure = error => {
    setIsLoading(false);
    Toast.show(error.toString(), Toast.LONG);
  };
  const onOpenStripeSheet = () => {
    setIsError(true);
    if (amountToTrans == '') {
      setIsNullAmount('Please enter amount!');
    }
    if (amountToTrans <= 0) {
      setIsNullAmount('Amount should be more than zero!');
    } else if (validationHelper.descriptionValidation(description) !== '') {
      return false;
    } else {
      Keyboard.dismiss();
      setDisableTouch(true);
      setIsLoading(true);
      let params = {
        provider_id: payingID,
        user_id: userData.userDetail.id,
        grand_total: Number(amountToTrans * 100).toFixed(0),
      };
      postApi(
        STRIPE_HIRELY_PAY_API,
        params,
        onSuccessOpenPaymentSheet,
        onFailureOpenPaymentSheet,
        userData,
      );
    }
  };

  const onFailureOpenPaymentSheet = error => {
    setIsLoading(false);
    setOpenPayAmountView(false);
    Toast.show(error.toString(), Toast.LONG);
  };
  const onSuccessOpenPaymentSheet = async successResponse => {
    setIsLoading(false);
    if (successResponse.status) {
      //initialize of sheet
      const {error} = await initPaymentSheet({
        customerId: successResponse.data.customer_id,
        customerEphemeralKeySecret: successResponse.data.ephemeralKey,
        paymentIntentClientSecret: successResponse.data.paymentIntent,
        merchantDisplayName: 'Hirely',
      });
      if (!error) {
        //opening sheet here
        const {error} = await presentPaymentSheet({
          clientSecret: successResponse.data.paymentIntent,
          confirmPayment: true,
        });
        if (error) {
          Alert.alert(`Error code: ${error.code}`, error.message);
          setDisableTouch(false);
        } else {
          const result = await retrievePaymentIntent(
            successResponse.data.paymentIntent,
          );
          if (result.paymentIntent) {
            //adding amount in wallet
            let payToWalletParam = {
              amount: amountToTrans,
              provider_id: payingID,
              description: description,
              user_id: userData.userDetail.id,
              transaction_id: result.paymentIntent.id,
            };
            postApi(
              STRIPE_PAY_TO_WALLET_API,
              payToWalletParam,
              onPaymentDoneSuccess,
              onPaymentFailure,
              userData,
            );
          } else {
            setDisableTouch(false);
            Toast.show(msg, Toast.LONG);
          }
        }
      } else {
        setDisableTouch(false);
        Toast.show(msg, Toast.LONG);
      }
    } else {
      setDisableTouch(false);
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onClosePaymentAlert = () => {
    setPaymentCancelView(false);
    setDisableTouch(false);
  };

  const onPaymentDoneSuccess = response => {
    if (response.status) {
      setOpenPayAmountView(false);
      setAmountToTrans('');
      setIsError(false);
      setIsLoading(false);
      setDescription('');
      setMobileNoToTrans('');
      setIsTransferEnable(false);
      Toast.show(response.message, Toast.LONG);
      getPaymentHistory();
    } else {
      Toast.show(response.message, Toast.LONG);
    }
  };

  const onPaymentFailure = error => {
    Toast.show(error.toString(), Toast.LONG);
    setOpenPayAmountView(false);
    setIsTransferEnable(false);
    setDisableTouch(false);
  };

  const onSearchCancel = () => {
    setIsTransferEnable(false);
    setIsError(false);
    setMobileNoToTrans('');
    setIsLoading(false);
    setDisableTouch(false);
  };

  const onPayCancel = () => {
    setOpenPayAmountView(false);
    setAmountToTrans('');
    setIsError(false);
    setIsLoading(false);
    setDescription('');
    setDisableTouch(false);
    setIsTransferEnable(true);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getPaymentHistory();
  };
  const pointsDataHeader = () => {
    return (
      <View style={styles.headerViewStyle}>
        <Text style={styles.headerTitle2Style}>
          Pay Using Hirelypay and get reward in {`\n`} your Point Mall
        </Text>
        <Text style={styles.pointCountTextStyle}>{userData.point ?? 0}</Text>
        <Text style={styles.headerTitle3Style}>Earned Total Points</Text>
        <HRBorderBtnComponent
          isIcon
          onPress={onPointMallPress}
          btnText={'Go to Point Mall'}
        />
      </View>
    );
  };
  const paymentHistoryRenderItem = ({index, item}) => {
    return (
      <HRRequestComponent
        item={item}
        index={index}
        onPress={onPressOnItem}
        onRequestPay={onPressPay}
        onRequestCancel={onPressCancel}
      />
    );
  };

  return (
    <BaseContainer
      noInternet={noInternet}
      headerText={'Hirelypay'}
      onInternetRefresh={onInternetRefresh}
      styles={{backgroundColor: '#F8F8F8'}}>
      <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}>
        {pointsDataHeader()}
        <View style={styles.flexStyle}>
          {isListLoading ? (
            <HRListLoader style={styles.loaderStyle} isList />
          ) : (
            <FlatList
              windowSize={10}
              data={paymentHistory}
              initialNumToRender={10}
              style={styles.listStyle}
              maxToRenderPerBatch={10}
              legacyImplementation={true}
              onEndReachedThreshold={0.5}
              removeClippedSubviews={true}
              showsVerticalScrollIndicator={false}
              renderItem={paymentHistoryRenderItem}
              refreshControl={
                <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <NoDataComponent style={styles.noDataViewStyle} />
              }
              ListFooterComponent={
                isLastLoading ? (
                  <HRListLoader style={styles.loaderStyle} />
                ) : null
              }
              onEndReached={({distanceFromEnd}) => {
                if (endReached) {
                  setIsLastLoading(true);
                  pageCount = pageCount + 1;
                  getPaymentHistory();
                }
              }}
            />
          )}
        </View>

        {!isTransferEnable && !openPayAmountView && userData.userDetail.id ? (
          <HRThemeBtn
            onPress={onPayUsingPress}
            btnText="Pay Using Hirelypay"
            style={styles.payUsingBtnStyle}
          />
        ) : null}
        <HRPopupView
          animationType={'slide'}
          onRequestClose={onClose}
          isVisible={isTransferEnable}>
          <HRTransferMoneyComponent
            onClose={onClose}
            isError={isError}
            isLoading={isLoading}
            disabled={disableTouch}
            description={description}
            onPayCancel={onPayCancel}
            isNullAmount={isNullAmount}
            amountToTrans={amountToTrans}
            userTransferName={payingName}
            onSearchPress={onSearchMobile}
            onPayPress={onOpenStripeSheet}
            setDescription={setDescription}
            onSearchCancel={onSearchCancel}
            mobileNoToTrans={mobileNoToTrans}
            setAmountToTrans={onChangeAmount}
            setMobileNoToTrans={onChangeMobile}
            openPayAmountView={openPayAmountView}
            setIsTransferEnable={setIsTransferEnable}
            setOpenPayAmountView={setOpenPayAmountView}
          />
        </HRPopupView>
        <HRPopupView
          animationType={'slide'}
          isVisible={paymentCancelView}
          onRequestClose={onClosePaymentAlert}>
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={1.0}
            style={styles.payCancelBlurViewStyle}>
            <View style={styles.commonViewStyle}>
              <View style={styles.cardIconStyle}>
                <Icon
                  size={35}
                  color={HRColors.primary}
                  type="material-community"
                  name="credit-card-remove-outline"
                />
                <Text style={styles.payCancelTitleStyle}>
                  The payment has been cancelled!
                </Text>
                <Text style={styles.payCancelDesStyle}>
                  Don't worry no amount has been deducted from your bank.
                </Text>
              </View>
              <HRThemeBtn
                onPress={onClose}
                btnText={'Close'}
                style={styles.cancelBtnStyle}
                btnTextStyle={styles.cancelTextStyle}
              />
            </View>
          </TouchableOpacity>
        </HRPopupView>
      </StripeProvider>
    </BaseContainer>
  );
};
export default HirelyPayContainer;
const styles = StyleSheet.create({
  flexStyle: {
    flex: 1,
    backgroundColor: HRColors.white,
  },

  loaderStyle: {
    height: 75,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },

  listStyle: {
    marginTop: 15,
  },

  headerViewStyle: {
    paddingBottom: 15,
    backgroundColor: '#F8F8F8',
  },

  headerTitle2Style: {
    paddingTop: 20,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  pointCountTextStyle: {
    marginVertical: 5,
    textAlign: 'center',
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(23),
  },

  headerTitle3Style: {
    textAlign: 'center',
    color: HRColors.black,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(10),
  },

  payUsingBtnStyle: {
    bottom: 0,
    elevation: 5,
    alignSelf: 'center',
    paddingHorizontal: 25,
  },

  noDataViewStyle: {
    height: screenHeight / 2,
  },

  payCancelBlurViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },

  commonViewStyle: {
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 1,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 1,
      },
    }),
  },

  cardIconStyle: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },

  payCancelTitleStyle: {
    marginTop: 10,
    textAlign: 'center',
    color: HRColors.black,
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(16),
  },

  payCancelDesStyle: {
    marginTop: 5,
    textAlign: 'center',
    color: HRColors.grayBorder,
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(14),
  },

  cancelBtnStyle: {
    borderWidth: 0.5,
    marginVertical: 15,
    paddingVertical: 15,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  cancelTextStyle: {
    color: HRColors.primary,
  },
});
