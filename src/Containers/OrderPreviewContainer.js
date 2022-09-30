import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ORDER_PLACE_API, STRIPE_ORDER_PAY_API} from '../Utils/HRConstant';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRPopupView from '../Components/HRPopView';
import HRThemeBtn from '../Components/HRThemeBtn';
import BaseContainer from '../Components/BaseContainer';
import HRFavComponent from '../Components/HRFavComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRAddressComponent from '../Components/HRAddressComponent';
import HRSummaryComponent from '../Components/HRSummaryComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var moment = require('moment');
let orderParams = {};
let msg = 'Payment Request failed \n Please try again later !';
const OrderPreviewContainer = props => {
  const [orderData, setOrderData] = useState(
    props.route.params.orderPreviewData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');
  const [addressData, setAddressData] = useState('');
  const [isTouchable, setIsTouchable] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  let userData = useSelector(state => state.userOperation);
  const STRIPE_PUBLISH_KEY = userData.stripePk;
  const [paymentCancelView, setPaymentCancelView] = useState(false);
  const {initPaymentSheet, presentPaymentSheet, retrievePaymentIntent} =
    useStripe();
  const [bookingDateTimeData, setBookingDateTimeData] = useState({
    addressOrReviewTitle:
      moment(orderData.selectedDate).format('MMM DD YYYY') +
      ' | ' +
      orderData.selectedTime,
  });
  const [bookingSummaryData, setBookingSummaryData] = useState([
    {
      title: orderData.service.title,
      price: '$' + orderData.fixed_price,
    },
    {
      title: 'Total',
      price: '$' + Number(orderData.fixed_price - discountAmount).toFixed(2),
    },
  ]);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      setAddressData('');
      if (userData?.addressList?.length !== 0 && userData?.addressList) {
        setAddressData({
          addressOrReviewTitle:
            userData?.addressList[0]?.complete_address +
            '\n' +
            userData?.addressList[0]?.city +
            ' ' +
            userData?.addressList[0]?.zipcode +
            '\n' +
            userData?.addressList[0]?.state,
          addressType: userData?.addressList[0]?.address_type,
        });
      }
    });
  }, [userData?.addressList]);

  const clickOnViewOffers = () => {
    props.navigation.navigate('reward', {
      totalAmount: orderData.fixed_price,
      onGoBack: data => applyCode(data),
    });
  };

  const applyCode = data => {
    setAppliedCode(data.promoCode);
    setDiscountAmount(data.discountAmount);
    let newBookingData = [];
    newBookingData.splice(0, 1, {
      title: orderData.service.title,
      price: '$' + orderData.fixed_price,
    });
    newBookingData.splice(1, 0, {
      title: 'Discount',
      price: '$' + Number(data.discountAmount).toFixed(2),
    });
    newBookingData.splice(2, 0, {
      title: 'Total',
      price:
        '$' + Number(orderData.fixed_price - data.discountAmount).toFixed(2),
    });
    setBookingSummaryData(newBookingData);
  };

  const removeAppliedCode = () => {
    setAppliedCode('');
    setDiscountAmount(0);
    let newBookingData = bookingSummaryData;
    bookingSummaryData.splice(2, 1);
    bookingSummaryData.splice(1, 1);
    newBookingData.splice(2, 0, {
      title: 'Total',
      price: '$' + Number(orderData.fixed_price).toFixed(2),
    });
    setBookingSummaryData(newBookingData);
  };

  const onOrderPlace = (str, amount) => {
    if (userData?.addressList?.length > 0) {
      setIsTouchable(true);
      //orderParams for stripe and place order api
      orderParams = {
        lat: orderData.lat,
        lng: orderData.long,
        promocode: appliedCode,
        date: orderData.selectedDate,
        is_fixed: str == 'book' ? 1 : 1,
        user_id: userData.userDetail.id,
        service_id: orderData.service.id,
        grand_total: (amount * 100).toFixed(0),
        address: addressData.addressOrReviewTitle,
        provider_id: orderData.service.provider.id,
        schedule_to: orderData.selectedTime.split('-')[1],
        schedule_from: orderData.selectedTime.split('-')[0],
      };
      setIsLoading(true);
      postApi(
        STRIPE_ORDER_PAY_API,
        orderParams,
        onSuccessOpenPaymentSheet,
        onFailureOpenPaymentSheet,
        userData,
      );
      console.log('orderParams::', orderParams);
    } else {
      Toast.show('Please add address', Toast.LONG);
    }
  };
  const onSuccessOpenPaymentSheet = async successResponse => {
    console.log('successResponse::', successResponse);
    if (successResponse.status) {
      //initialize of sheet
      const {error} = await initPaymentSheet({
        customerId: successResponse.data.customer_id,
        customerEphemeralKeySecret: successResponse.data.ephemeralKey,
        paymentIntentClientSecret: successResponse.data.paymentIntent,
        merchantDisplayName: 'Hirely',
        merchantCountryCode: 'SG',
      });
      if (!error) {
        //opening sheet here
        const {error} = await presentPaymentSheet({
          clientSecret: successResponse.data.paymentIntent,
          confirmPayment: true,
        });
        if (error) {
          setIsLoading(false);
          setIsTouchable(false);
          setPaymentCancelView(true);
        } else {
          // getting payment details
          const result = await retrievePaymentIntent(
            successResponse.data.paymentIntent,
          );
          if (result.paymentIntent) {
            orderParams.transaction_id = result.paymentIntent.id;
            setIsLoading(false);
            console.log(JSON.stringify(orderParams));
            postApi(
              ORDER_PLACE_API,
              orderParams,
              onSuccess,
              onFailure,
              userData,
            );
          } else {
            setIsTouchable(false);
            setIsLoading(false);
            Toast.show(msg, Toast.LONG);
          }
        }
      } else {
        //issue while opening payment page
        setIsLoading(false);
        setIsTouchable(false);
        Toast.show(msg, Toast.LONG);
      }
    } else {
      setIsLoading(false);
      setIsTouchable(false);
      Toast.show(successResponse?.message, Toast.LONG);
    }
  };

  const onFailureOpenPaymentSheet = error => {
    setIsLoading(false);
    setIsTouchable(false);
    Toast.show(msg, Toast.LONG);
  };
  //order place success
  const onSuccess = successResponse => {
    console.log(successResponse);
    if (successResponse.status) {
      // Toast.show(successResponse.message, Toast.LONG);
      setIsTouchable(false);
      props.navigation.navigate('myOrders');
    } else {
      Toast.show(successResponse.message, Toast.LONG);
    }
  };
  //order place failure
  const onFailure = error => {
    setIsLoading(false);
    setIsTouchable(false);
    Toast.show(error.toString(), Toast.LONG);
  };
  const bookingSummaryView = () => {
    return (
      <View style={styles.commonViewStyle}>
        <Text style={styles.bookingSummaryTextStyle}>Booking Summary</Text>
        <FlatList
          data={bookingSummaryData}
          renderItem={({item, index}) => (
            <HRSummaryComponent item={item} index={index} />
          )}
          keyExtractor={(item, index) => index + item?.toString()}
        />
      </View>
    );
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  const onClose = () => {
    setPaymentCancelView(false);
  };

  const onAddressChangePress = () => {
    props.navigation.navigate('myAddress');
  };

  return (
    <BaseContainer
      isLeftIcon
      headerText={'Order'}
      onPress={onBackPress}
      styles={{backgroundColor: '#F7F8F8'}}>
      <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <HRFavComponent
            starSize={12}
            showRatingIcons={true}
            style={styles.detailViewStyle}
            imageStyle={styles.detailImgStyle}
            bottomViewStyle={styles.viewRowStyle}
            item={props?.route?.params?.orderPreviewData}
          />

          <View style={styles.dividerStyle} />
          <HRAddressComponent
            title={'Booking Date & Time -'}
            addressOrReviewTitle={bookingDateTimeData?.addressOrReviewTitle}
          />
          {userData?.addressList?.length > 0 ? (
            <HRAddressComponent
              title={'Address '}
              addressType={addressData.addressType}
              onAddressChangePress={onAddressChangePress}
              subTitle={
                <Icon
                  size={22}
                  type="materialIcons"
                  color={HRColors.primary}
                  name="published-with-changes"
                />
              }
              addressOrReviewTitle={addressData.addressOrReviewTitle}
            />
          ) : (
            <HRAddressComponent
              title={'Address'}
              addressOrReviewTitle={'Address is not added'}
              onAddressChangePress={onAddressChangePress}
              subTitle={
                <Icon
                  size={22}
                  type="materialIcons"
                  color={HRColors.primary}
                  name="published-with-changes"
                />
              }
            />
          )}

          {bookingSummaryView()}
          {appliedCode == '' ? (
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={clickOnViewOffers}
              style={[styles.viewRowStyle, styles.commonViewStyle]}>
              <Image
                source={Assets.applyOfferIcon}
                style={styles.offerIconStyle}
              />
              <Text style={styles.viewOfferTextStyle}>View Offers</Text>
            </TouchableOpacity>
          ) : (
            <>
              <View style={[styles.viewRowStyle, styles.commonViewStyle]}>
                <Image
                  source={Assets.applyOfferIcon}
                  style={[styles.offerIconStyle, {tintColor: '#46B924'}]}
                />
                <Text style={styles.codeTextStyle} numberOfLines={1}>
                  CODE: {appliedCode} Applied
                </Text>
                <TouchableOpacity
                  onPress={removeAppliedCode}
                  activeOpacity={1.0}>
                  <Text style={styles.removeTextStyle}>REMOVE</Text>
                </TouchableOpacity>
              </View>
              {/* {orderData.service.booking_price > 0 ? (
                <Text style={styles.promoLabelStyle}>
                  Promo code will not apply on booking !
                </Text>
              ) : null} */}
            </>
          )}
        </KeyboardAwareScrollView>
        {isLoading ? (
          <View style={styles.payBookBtnViewStyle}>
            <ActivityIndicator color={HRColors.primary} size={'large'} />
          </View>
        ) : (
          <View style={styles.payBookBtnViewStyle}>
            {orderData.service.booking_price > 0 ? (
              <HRThemeBtn
                disabled={isTouchable}
                onPress={() =>
                  onOrderPlace(
                    'book',
                    Number(orderData.booking_price - discountAmount).toFixed(2),
                  )
                }
                btnText={
                  'Book for $' +
                  Number(orderData.booking_price - discountAmount).toFixed(2)
                }
                style={styles.bookBtnStyle}
                btnTextStyle={styles.bookTxtStyle}
              />
            ) : (
              <HRThemeBtn
                disabled={isTouchable}
                style={styles.payBtnStyle}
                onPress={() =>
                  onOrderPlace(
                    'full',
                    Number(orderData.fixed_price - discountAmount).toFixed(2),
                  )
                }
                btnText={
                  'Pay Full $' +
                  Number(orderData.fixed_price - discountAmount).toFixed(2)
                }
              />
            )}
          </View>
        )}
        <HRPopupView
          animationType={'slide'}
          onRequestClose={onClose}
          isVisible={paymentCancelView}>
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
export default OrderPreviewContainer;
const styles = StyleSheet.create({
  dividerStyle: {
    borderWidth: 0.3,
    marginVertical: 5,
    marginHorizontal: 20,
    borderColor: HRColors.grayBorder,
  },

  detailViewStyle: {
    marginVertical: 0,
    paddingHorizontal: 20,
  },

  detailImgStyle: {
    width: widthPercentageToDP(24),
    height: widthPercentageToDP(24),
  },

  viewRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  offerIconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  codeTextStyle: {
    flex: 1,
    color: '#46B92A',
    marginHorizontal: 10,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(14),
  },

  viewOfferTextStyle: {
    marginHorizontal: 10,
    color: HRColors.primary,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(14),
  },

  removeTextStyle: {
    color: '#FF1616',
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(14),
  },

  bookingSummaryTextStyle: {
    color: '#2B305E',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  promoLabelStyle: {
    textAlign: 'center',
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(14),
  },

  payBookBtnViewStyle: {
    marginVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  bookTxtStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  bookBtnStyle: {
    borderWidth: 0.5,
    marginVertical: 0,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  payBtnStyle: {
    marginVertical: 0,
    marginHorizontal: 10,
    paddingHorizontal: 15,
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

  commonViewStyle: {
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
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
        elevation: 1,
      },
    }),
  },

  payCancelBlurViewStyle: {
    flex: 1,
    justifyContent: 'center',
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
});
