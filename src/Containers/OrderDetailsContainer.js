import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  Alert,
  Platform,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Keyboard,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {
  ADD_RATING_API,
  ORDER_DETAILS_API,
  PAY_REMAINING_API,
  STRIPE_PAY_REMAINING,
  ORDER_COMPLETE_API
} from '../Utils/HRConstant';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import { postApi } from '../Utils/ServiceManager';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRPopupView from '../Components/HRPopView';
import { useDispatch, useSelector } from 'react-redux';
import { saveReferralPoint } from '../redux/Actions/User';
import BaseContainer from '../Components/BaseContainer';
import ValidationHelper from '../Utils/ValidationHelper';
import HRFavComponent from '../Components/HRFavComponent';
import { getProportionalFontSize } from '../Utils/HRConstant';
import { saveDataInAsync } from '../Utils/AsyncStorageHelper';
import OrderDetailLoader from '../Components/OrderDetailLoader';
import HRAddressComponent from '../Components/HRAddressComponent';
import HRSummaryComponent from '../Components/HRSummaryComponent';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import HROrderChipComponent from '../Components/HROrderChipComponent';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import HRRatingReviewComponent from '../Components/HRRatingReviewComponent';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
var moment = require('moment');
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
let ratingStar = '1';
let payRemainingStripeParam = {};
const OrderDetailsContainer = props => {
  const dispatch = useDispatch();
  var validationHelper = new ValidationHelper();
  const [isError, setIsError] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompletedLoading, setIsCompletedLoading] = useState(false);
  const [ratingFeedBack, setFeedBack] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [customerOrderStatus, setCustomerOrderStatus] = useState('');
  const [noInternet, setNoInternet] = useState(false);
  const [payRemaining, setPayRemaining] = useState('');
  const [isBtnLoader, setIsBtnLoader] = useState(false);
  const [headerText, setHeaderText] = useState('Order ');
  let userData = useSelector(state => state.userOperation);
  const STRIPE_PUBLISH_KEY = userData.stripePk;
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [isReviewRateOpen, setIsReviewRateOpen] = useState(false);
  const [bookingSummaryData, setBookingSummaryData] = useState([]);
  const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } =
    useStripe();

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      getOrderDetails();
    });
  }, [props]);

  useEffect(() => {
    console.log("!!!!!!!!!!!!!! --",props.route?.params?.reload)
    console.log("!!!!!!!!!!!!!! --",props.route?.params?.orderId)
    if (props.route?.params?.reload) {
      getOrderDetails();
      console.log("reloading via notification---")
    }
  }, [props.route?.params?.reload]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const getOrderDetails = () => {
    setIsLoading(true);
    let orderDetailParam = {
      user_id: userData.userDetail.id,
      order_id: props.route?.params?.orderId,
    };
    postApi(
      ORDER_DETAILS_API,
      orderDetailParam,
      onOrderDataSuccess,
      onOrderDataFailure,
      userData,
    );
  };
  const onOrderDataSuccess = successResponse => {
    // console.log(successResponse);
    if (successResponse.status) {
      Platform.OS === 'ios'
        ? PushNotificationIOS?.removeAllDeliveredNotifications()
        : PushNotification?.cancelAllLocalNotifications();
      console.log(successResponse.data.status, '---', successResponse.data.customer_status, '---', successResponse.data.is_user_order_review);
      setIsReviewRateOpen(
        successResponse.data.status == 'completed' && successResponse.data.customer_status == 'completed' &&
          !successResponse.data.is_user_order_review
          ? true
          : false,
      );
      setOrderData(successResponse.data);
      dispatch(saveReferralPoint(successResponse.total_point));
      saveDataInAsync(
        'referralPoint',
        successResponse.total_point,
        () => { },
        () => { },
      );
      if (headerText == 'Order ') {
        setHeaderText(headerText + '#' + successResponse.data.id);
      }

      setOrderStatus(successResponse.data.status);
      setCustomerOrderStatus(successResponse.data.customer_status)
      let bookingData = [];
      bookingData.splice(0, 1, {
        title: 'Paid',
        price: '$' + Number(successResponse.data.subtotal).toFixed(2),
      });
      if (successResponse.data.discount > 0) {
        bookingData.splice(1, 0, {
          title: 'Discount',
          price: '$' + Number(successResponse.data.discount).toFixed(2),
        });
      }
      bookingData.splice(2, 0, {
        title: 'Total',
        price:
          '$' +
          (
            Number(successResponse.data.total) +
            Number(successResponse.data.remaining)
          ).toFixed(2),
      });
      if (successResponse.data.remaining > 0) {
        setPayRemaining(successResponse.data.remaining);
        bookingData.splice(3, 0, {
          title: 'Remaining',
          price: '$' + Number(successResponse.data.remaining).toFixed(2),
        });
      } else {
        setPayRemaining('');
      }
      setBookingSummaryData(bookingData);
      setIsLoading(false);
      setNoInternet(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      setIsLoading(false);
    }
  };

  const onOrderDataFailure = error => {
    setIsLoading(false);
    onBackPress();
    Toast.show(error, Toast.LONG);
  };
  const bookingSummaryView = () => {
    return (
      <View style={styles.commonViewStyle}>
        <Text style={styles.bookingSummaryTextStyle}>Booking Summary</Text>
        <FlatList
          data={bookingSummaryData}
          renderItem={({ item, index }) => (
            <HRSummaryComponent item={item} index={index} />
          )}
        />
      </View>
    );
  };

  const onCancelClaim = headerText => {
    if (headerText == 'claim') {
      props.navigation.navigate('claimCancel', {
        headerText: 'claim',
        orderId: orderData.id,
      });
    } else {
      props.navigation.navigate('claimCancel', {
        headerText: 'cancel',
        orderId: orderData.id,
      });
    }
  };

  const onBackPress = () => {
    props.navigation.goBack();
    // props.navigation.navigate('myOrders');
    return true;
  };
  const ratingReviewView = () => {
    return (
      <>
        {orderStatus == 'completed' && orderData.is_user_order_review ? (
          <HRAddressComponent
            isStar={true}
            title={'Rating'}
            starCount={Number(orderData.customer_rating.rating)}
            addressOrReviewTitle={orderData.customer_rating.feedback}
          />
        ) : null}
      </>
    );
  };

  const onChangeFeedBack = text => {
    setFeedBack(text);
    setIsError(false);
  };
  const onSubmitReview = () => {
    setIsError(true);
    if (ratingFeedBack == '') {
      return false;
    } else if (
      validationHelper.isEmptyValidation(
        ratingFeedBack,
        'Please add feedback',
      ) !== ''
    ) {
      return false;
    } else {
      Keyboard.dismiss();
      setIsRatingLoading(true);
      let ratingBodyParam = {
        rating: ratingStar,
        order_id: orderData.id,
        feedback: ratingFeedBack,
        sender_id: userData.userDetail.id,
        receiver_id: orderData.provider_id,
      };
      postApi(
        ADD_RATING_API,
        ratingBodyParam,
        onRatingSuccess,
        onRatingFailure,
      );
    }
  };
  const onRatingSuccess = successResponse => {
    if (successResponse.status) {
      getOrderDetails();
      Toast.show(successResponse.message, Toast.LONG);
      setIsRatingLoading(false);
      setFeedBack('');
      setIsError(false);
    } else {
      Toast.show(successResponse.message, Toast.LONG);
      setIsRatingLoading(false);
    }
  };

  const onRatingFailure = error => {
    setIsRatingLoading(false);
    Toast.show(error.toString(), Toast.LONG);
    setIsReviewRateOpen(false);
    setFeedBack('');
    setIsError(false);
  };

  const onPayRemaining = () => {
    setIsBtnLoader(true);
    payRemainingStripeParam = {
      order_id: orderData.id,
      user_id: userData.userDetail.id,
      provider_id: orderData.provider.id,
      remaining: Number(orderData.remaining * 100).toFixed(0),
    };
    postApi(
      STRIPE_PAY_REMAINING,
      payRemainingStripeParam,
      onPaymentSheetSuccess,
      onPaymentSheetFailure,
      userData,
    );
  };

  const onPaymentSheetFailure = error => {
    console.log(error);
  };
  const onPaymentSheetSuccess = async successResponse => {
    if (successResponse.status) {
      //initialize of sheet
      const { error } = await initPaymentSheet({
        customerId: successResponse.data.customer_id,
        customerEphemeralKeySecret: successResponse.data.ephemeralKey,
        paymentIntentClientSecret: successResponse.data.paymentIntent,
        merchantDisplayName: 'Hirely',
        merchantCountryCode: 'SG',
      });
      if (!error) {
        //opening sheet here
        const { error } = await presentPaymentSheet({
          clientSecret: successResponse.data.paymentIntent,
          confirmPayment: true,
        });
        if (error) {
          setIsBtnLoader(false);
          Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
          // getting payment details
          const result = await retrievePaymentIntent(
            successResponse.data.paymentIntent,
          );
          if (result.paymentIntent) {
            payRemainingStripeParam.transaction_id = result.paymentIntent?.id;
            setIsBtnLoader(false);
            postApi(
              PAY_REMAINING_API,
              payRemainingStripeParam,
              onPayRemainSuccess,
              onPayRemainFailure,
              userData,
            );
          } else {
            setIsBtnLoader(false);
            Toast.show(
              'Payment Request failed \n Please try again later !',
              Toast.LONG,
            );
          }
        }
      } else {
        //issue while opening payment page
        setIsBtnLoader(false);
        Toast.show(
          'Payment Request failed \n Please try again later !',
          Toast.LONG,
        );
      }
    } else {
      setIsBtnLoader(false);
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onPayRemainSuccess = successResponse => {
    if (successResponse.status) {
      getOrderDetails();
    } else {
      getOrderDetails();
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onPayRemainFailure = error => {
    console.log(error);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getOrderDetails();
  };
  // console.log('orderData::', orderData.provider);

  const onChatPress = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('messageList', {
        senderId: orderData.provider.id,
        name: orderData.provider.name,
        image: orderData.provider.image,
      });
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => props.navigation.navigate('login') },
      ]);
    }
  };

  const onOrderComplete = () => {
    setIsCompletedLoading(true)
    let completeParam = {
      order_id: orderData.id
    }
    // setIsLoading(true)
    postApi(
      ORDER_COMPLETE_API,
      completeParam,
      onCompletionSuccess,
      onCompletionFailure,
    );
  }

  const onCompletionSuccess = successResponse => {
    if (successResponse.status) {
      getOrderDetails();
      setIsReviewRateOpen(true);
      Toast.show(successResponse.message, Toast.LONG);
      // setIsLoading(false);
      setIsCompletedLoading(false);
    } else {
      Toast.show(successResponse.message, Toast.LONG);
      // setIsLoading(false);
      setIsCompletedLoading(false);
    }
  };

  const onCompletionFailure = error => {
    // setIsLoading(false);
    setIsCompletedLoading(false);
    Toast.show(error.toString(), Toast.LONG);
  };

  return (
    <BaseContainer
      isLeftIcon
      isChatIcon
      onChatPress={onChatPress}
      onPress={onBackPress}
      noInternet={noInternet}
      headerText={headerText}
      onInternetRefresh={onInternetRefresh}
      styles={{ backgroundColor: '#F7F8F8' }}>
      <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}>
        {isLoading ? (
          <OrderDetailLoader isOrder />
        ) : (
          <>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
              <HRFavComponent
                item={orderData}
                starSize={12}
                showRatingIcons={true}
                style={styles.detailViewStyle}
                imageStyle={styles.detailImgStyle}
                bottomViewStyle={styles.viewRowStyle}
              />

              <View style={styles.dividerStyle} />
              <HROrderChipComponent
                title={'Booking Date & Time -'}
                status={orderStatus}
                subTitle={
                  moment(orderData.date).format('MMM DD YYYY') +
                  ' | ' +
                  orderData.schedule_from +
                  ' -' +
                  orderData.schedule_to
                }
              />

              <HROrderChipComponent
                payType={'Card'}
                title={'Payment Method'}
                subTitle={'Payment Type'}
              />

              <HRAddressComponent
                title={'Address'}
                addressOrReviewTitle={orderData.address}
              />
              {ratingReviewView()}
              {bookingSummaryData.length > 0 ? bookingSummaryView() : null}

              {orderStatus == 'confirm' || orderStatus == 'requested' ? (
                <View style={styles.inProgressBtnViewStyle}>
                  <HRThemeBtn
                    btnText={'Cancel'}
                    style={styles.cancelBtnStyle}
                    btnTextStyle={styles.cancelTextStyle}
                    onPress={() => onCancelClaim('cancel')}
                  />
                  <HRThemeBtn
                    btnText={'Help'}
                    onPress={() => props?.navigation.navigate('help')}
                    style={styles.payRemainingORClaimBtnStyle}
                  />
                </View>
              ) : null}
              {orderStatus == 'in-progress' ? (
                <View style={styles.inProgressBtnViewStyle}>
                  <HRThemeBtn
                    btnText={'Cancel'}
                    style={styles.cancelBtnStyle}
                    btnTextStyle={styles.cancelTextStyle}
                    onPress={() => onCancelClaim('cancel')}
                  />
                  <HRThemeBtn
                    btnText={'Refund'}
                    onPress={() => onCancelClaim('claim')}
                    style={styles.payRemainingORClaimBtnStyle}
                  />
                </View>
              ) : null}
              {orderStatus == 'completed' && customerOrderStatus == 'pending' ? (
                <View style={styles.inProgressBtnViewStyle}>
                  {isCompletedLoading ? <ActivityIndicator
                    size={'small'}
                    animating={true}
                    color={HRColors.primary}
                    hidesWhenStopped={false}
                    // style={{ alignSelf: 'center' }}
                    style={styles.indicatorStyle}
                  /> :
                    <HRThemeBtn
                      btnText={'Complete'}
                      // isLoading={isCompletedLoading ? HRColors.primary : HRColors.white}
                      style={styles.cancelBtnStyle}
                      btnTextStyle={styles.cancelTextStyle}
                      onPress={() => onOrderComplete()}
                    />
                  }
                </View>
              ) : null}
              <HRPopupView isVisible={isReviewRateOpen}>
                <HRRatingReviewComponent
                  getStarCount={data => {
                    ratingStar = data;
                  }}
                  isError={isError}
                  ratingOrderData={orderData}
                  onChangeText={onChangeFeedBack}
                  onSubmitReview={onSubmitReview}
                  ratingFeedBack={ratingFeedBack}
                  isRatingLoading={isRatingLoading}
                  setIsReviewRateOpen={setIsReviewRateOpen}
                />
              </HRPopupView>
            </KeyboardAwareScrollView>

            {/* {payRemaining > 0 && orderStatus === 'in-progress' ? (
              <HRThemeBtn
                isLoading={isBtnLoader}
                onPress={onPayRemaining}
                btnText={'Pay Remaining $' + payRemaining}
                style={[
                  styles.payRemainingORClaimBtnStyle,
                  {marginVertical: 10},
                ]}
              />
            ) : null} */}
          </>
        )}
      </StripeProvider>
    </BaseContainer>
  );
};
export default OrderDetailsContainer;
const styles = StyleSheet.create({
  dividerStyle: {
    borderWidth: 0.3,
    marginVertical: 5,
    marginHorizontal: 20,
    borderColor: HRColors.grayBorder,
  },

  detailImgStyle: {
    width: widthPercentageToDP(24),
    height: widthPercentageToDP(24),
  },

  detailViewStyle: {
    marginVertical: 0,
    paddingHorizontal: 20,
  },

  viewRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookingSummaryTextStyle: {
    color: '#2B305E',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  payRemainingORClaimBtnStyle: {
    marginVertical: 0,
    marginHorizontal: 20,
  },

  inProgressBtnViewStyle: {
    marginBottom: 10,
  },

  cancelTextStyle: {
    color: HRColors.primary,
  },

  indicatorStyle: {
    borderWidth: 0.5,
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  cancelBtnStyle: {
    borderWidth: 0.5,
    marginVertical: 15,
    marginHorizontal: 20,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
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
        shadowOffset: { width: 0, height: 0 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
});
