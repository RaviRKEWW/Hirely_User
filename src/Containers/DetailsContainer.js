import React, {useState, useEffect} from 'react';
import Assets from '../Assets/index';
import {Alert} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import FastImage from 'react-native-fast-image';
import {postApi} from '../Utils/ServiceManager';
import HRPopView from '../Components/HRPopView';
import HRThemeBtn from '../Components/HRThemeBtn';
import {useSelector, useDispatch} from 'react-redux';
import BaseContainer from '../Components/BaseContainer';
import {saveFavouriteList} from '../redux/Actions/User';
import HRFavComponent from '../Components/HRFavComponent';
import NoDataComponent from '../Components/NoDataComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import OrderDetailLoader from '../Components/OrderDetailLoader';
import HRBannerComponent from '../Components/HRBannerComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {SERVICE_DETAILS_API, ADD_REMOVE_FAV_API} from '../Utils/HRConstant';
import HRReviewDetailsComponent from '../Components/HRReviewDetailsComponent';
import HRDropDownPickerComponent from '../Components/HRDropDownPickerComponent';
import {Text, View, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import HRDateNTimeScheduleComponent from '../Components/HRTimeScheduleComponent';
let schema = {
  value: 'start_end',
  label: 'start_end',
};
const DetailsContainer = props => {
  const dispatch = useDispatch();
  const [isFav, setIsFav] = useState(false);

  const [ratingData, setRatingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [noInternet, setNoInternet] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);
  const [ratingLength, setRatingLength] = useState([]);
  const [openTimeSlot, setOpenTimeSlot] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [openImageView, setOpenImageView] = useState(false);
  const [showServerError, setShowServerError] = useState(false);
  const [serviceDetailsData, setServiceDetailsData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getServiceDetails();
  }, []);

  const getServiceDetails = () => {
    let serviceDetailParam = {
      lat: props.route.params?.lat,
      log: props.route.params?.long,
      service_id: props.route.params?.serviceProviderID,
      user_id: userData.userDetail.id ? userData.userDetail.id : '',
    };
    postApi(SERVICE_DETAILS_API, serviceDetailParam, onSuccess, onFailure);
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      if (successResponse.data.length !== 0) {
        setServiceDetailsData(successResponse.data);
        setIsFav(successResponse.data.is_wishlist);
        /* { removing more than 5 data and showing 3 data object } */
        setRatingLength(successResponse.data.service?.ratings?.length);
        setRatingData(
          successResponse.data.service?.ratings?.length >= 5
            ? successResponse.data.service.ratings.splice(0, 3)
            : successResponse.data.service.ratings,
        );
        setIsLoading(false);
        setNoInternet(false);
        setShowServerError(false);
      } else {
        setIsLoading(false);
        setNoInternet(false);
        setShowServerError(true);
      }
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      setIsLoading(false);
    }
  };

  const onFailure = error => {
    setIsLoading(false);
  };
  const renderDateItem = ({item, index}) => {
    return (
      <HRDateNTimeScheduleComponent
        item={item}
        isMonthDate
        index={index}
        selectedSchedule={selectedDate}
        onSelect={() => {
          onSelectDate(item, index);
          setOpenTimeSlot(false);
        }}
      />
    );
  };

  const onSelectDate = (item, index) => {
    setSelectedDate(index);
    setSelectedTime(0);
  };
  const renderSliderImages = () => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={() => setOpenImageView(false)}
        style={styles.sliderViewStyle}>
        <HRBannerComponent
          index={bannerIndex}
          pageSize={widthPercentageToDP(100)}
          bannerImageStyle={styles.zoomImageStyle}
          arrayItem={serviceDetailsData.service.service_images}
        />
      </TouchableOpacity>
    );
  };
  const onMsgClick = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('messageList', {
        senderId: serviceDetailsData.service.provider.id,
        name: serviceDetailsData.service.provider.name,
        image: serviceDetailsData.service.provider.image,
      });
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('login')},
      ]);
    }
  };
  const onHireClick = () => {
    //passing selected date and selected time slots for start time and end time
    if (userData.userDetail.id) {
      if (serviceDetailsData.is_hire) {
        if (selectedTime != 0) {
          let orderData = {};
          orderData.lat = props.route.params.lat;
          orderData.long = props.route.params.long;
          orderData.selectedDate =
            serviceDetailsData.service.availability[selectedDate].date;
          orderData.selectedTime =
            selectedTime.split('-')[0] + '-' + selectedTime.split('-')[1];
          let fix = serviceDetailsData.service.fixed_price + '';
          let book = serviceDetailsData.service.booking_price + '';
          if (fix.includes(',')) {
            orderData.fixed_price = Number(
              serviceDetailsData.service.fixed_price.replace(/,/g, ''),
            ).toFixed(2);
          } else {
            orderData.fixed_price = Number(
              serviceDetailsData.service.fixed_price,
            ).toFixed(2);
          }
          if (book.includes(',')) {
            orderData.booking_price =
              serviceDetailsData.service.booking_price.replace(/,/g, '');
          } else {
            orderData.booking_price = serviceDetailsData.service.booking_price;
          }
          orderData.service = serviceDetailsData.service;
          props.navigation.navigate('orderPreview', {
            orderPreviewData: orderData,
          });
        } else {
          Toast.show('Please select available time slot!', Toast.LONG);
        }
      } else {
        Toast.show('This service is provided in your location!', Toast.LONG);
      }
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('login')},
      ]);
    }
  };
  const onFavClick = () => {
    if (userData.userDetail.id) {
      let addRemoveFavParam = {
        user_id: userData.userDetail.id,
        service_id: serviceDetailsData?.service?.id,
        is_wishlist: isFav ? 'remove' : 'add',
      };
      postApi(
        ADD_REMOVE_FAV_API,
        addRemoveFavParam,
        onFavSuccess,
        onFavFailure,
        userData,
      );
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('login')},
      ]);
    }
  };
  const onFavSuccess = response => {
    if (response.status) {
      dispatch(saveFavouriteList(response.favorite_data));
      setIsFav(!isFav);
    } else {
      Toast.show(response.message, Toast.LONG);
      setIsFav(isFav);
    }
  };

  const onFavFailure = error => {
    setIsFav(isFav);
  };

  const viewAllRating = () => {
    props.navigation.navigate('viewAllRating', {
      providerId: serviceDetailsData.service.provider.id,
    });
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getServiceDetails();
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };
  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      onFavPress={onFavClick}
      noInternet={noInternet}
      onInternetRefresh={onInternetRefresh}
      filterComponent={
        !showServerError ? (
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={onFavClick}
            style={styles.backBtnStyle}>
            <FastImage
              resizeMode={'contain'}
              style={styles.heartIconStyle}
              source={isFav ? Assets.heart_Fill : Assets.heart_unFill}
            />
          </TouchableOpacity>
        ) : null
      }>
      {isLoading ? (
        <OrderDetailLoader isOrder />
      ) : showServerError ? (
        <NoDataComponent
          noDataImage={Assets.noServerIcon}
          text={'Connection Failed' + '\n' + '  Please try again!'}
        />
      ) : (
        <>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}>
            <HRFavComponent
              serviceDetails
              autoPlay
              isFromDetails
              item={serviceDetailsData}
              style={styles.favContainerStyle}
              imageStyle={styles.mainImageStyle}
              pageSize={widthPercentageToDP(32)}
              selectedIndex={index => setBannerIndex(index)}
              onPressCarousal={() => setOpenImageView(!openImageView)}
            />

            <View style={styles.dividerStyle} />
            <View style={styles.descriptionViewStyle}>
              <Text style={styles.descriptionTextStyle}>
                {serviceDetailsData?.service?.description}
              </Text>
            </View>
            <View style={styles.dividerStyle} />
            <View style={styles.dateTimeViewStyle}>
              <Text style={styles.commonTitleStyle}>Date</Text>
              <View style={styles.weekDayViewStyle}>
                {serviceDetailsData?.service?.availability.length > 0 ? (
                  <FlatList
                    horizontal
                    bounces={false}
                    renderItem={renderDateItem}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    data={serviceDetailsData?.service?.availability}
                  />
                ) : (
                  <NoDataComponent
                    isFromTimeSlot
                    style={styles.noDataViewStyle}
                    textStyle={styles.noDataTextStyle}
                    text="This provider is not available for this current week!"
                  />
                )}
              </View>
              <Text style={styles.commonTitleStyle}>Time</Text>
              <HRDropDownPickerComponent
                schema={schema}
                value={selectedTime}
                setValue={setSelectedTime}
                placeholder={'select time'}
                openDropDown={openTimeSlot}
                style={styles.dropDownStyle}
                setOpenDropDown={setOpenTimeSlot}
                onChangeHandler={data => setSelectedTime(data)}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                item={
                  serviceDetailsData?.service?.availability[selectedDate].slot
                }
              />
              {ratingData.length > 0 ? (
                <>
                  <View style={styles.flexRowStyle}>
                    <Text style={styles.commonTitleStyle}>
                      Reviews
                      {ratingLength - ratingData.length <= 0 ? null : (
                        <Text
                          style={[
                            styles.commonLabelStyle,
                            {paddingHorizontal: 5},
                          ]}>
                          {' '}
                          ({ratingLength})
                        </Text>
                      )}
                    </Text>
                    {ratingLength - ratingData.length <= 0 ? null : (
                      <TouchableOpacity
                        activeOpacity={1.0}
                        onPress={viewAllRating}>
                        <Text style={styles.viewAllTextStyle}>View All</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <FlatList
                    bounces={false}
                    data={ratingData}
                    style={styles.reviewListStyle}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => (
                      <HRReviewDetailsComponent
                        detailService
                        item={item}
                        index={index}
                      />
                    )}
                    showsHorizontalScrollIndicator={false}
                  />
                </>
              ) : (
                <View style={{height: 125}} />
              )}
            </View>
          </KeyboardAwareScrollView>
          <View style={styles.bottomViewStyle}>
            <TouchableOpacity
              activeOpacity={1.0}
              onPress={onMsgClick}
              style={styles.msgIconStyle}>
              <Icon
                size={25}
                type="ionicon"
                color={'#373737'}
                name="chatbubble-ellipses"
              />
            </TouchableOpacity>
            <HRThemeBtn
              btnText={'Hire me'}
              onPress={onHireClick}
              style={styles.hireMeBtnStyle}
            />
          </View>
          {serviceDetailsData?.service?.service_images?.length > 0 ? (
            <HRPopView
              animationType={'fade'}
              isVisible={openImageView}
              onRequestClose={() => setOpenImageView(false)}>
              {renderSliderImages()}
            </HRPopView>
          ) : null}
        </>
      )}
    </BaseContainer>
  );
};
export default DetailsContainer;
const styles = StyleSheet.create({
  backBtnStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 20,
    alignItems: 'center',
    borderColor: '#D4D9D9',
    justifyContent: 'center',
  },

  favContainerStyle: {
    marginVertical: 10,
    marginHorizontal: 20,
  },

  mainImageStyle: {
    borderRadius: 10,
    resizeMode: 'contain',
    width: widthPercentageToDP(32),
    height: widthPercentageToDP(30),
  },

  descriptionViewStyle: {
    marginVertical: 10,
    marginHorizontal: 20,
  },

  descriptionTextStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  dateTimeViewStyle: {
    paddingHorizontal: 20,
  },

  commonTitleStyle: {
    marginTop: 15,
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(15),
  },

  timeScheduleFlatListStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#8B9897',
  },

  weekDayViewStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#8B9897',
  },

  commonLabelStyle: {
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(12),
  },

  bottomViewStyle: {
    padding: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'rgb(238,238,238)',
  },

  msgIconStyle: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    borderColor: '#373737',
  },

  hireMeBtnStyle: {
    flex: 1,
    borderRadius: 15,
    marginVertical: 0,
    marginHorizontal: 10,
  },

  zoomImageStyle: {
    alignSelf: 'center',
    width: widthPercentageToDP(85),
    height: widthPercentageToDP(85),
  },

  heartIconStyle: {
    width: 20,
    height: 20,
  },

  dividerStyle: {
    borderWidth: 0.3,
    marginHorizontal: 20,
    borderColor: HRColors.grayBorder,
  },

  viewAllTextStyle: {
    marginTop: 15,
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  sliderViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },

  flexRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  noDataViewStyle: {
    height: 65,
  },

  noDataTextStyle: {
    padding: 10,
    marginTop: 0,
  },

  reviewListStyle: {
    marginBottom: 20,
  },

  dropDownStyle: {
    paddingEnd: 5,
    marginStart: 0,
    paddingStart: 5,
    borderRadius: 7,
    borderWidth: 0.5,
    paddingHorizontal: 0,
    borderBottomWidth: 0.5,
    height: widthPercentageToDP(15),
    borderColor: HRColors.grayBorder,
    width: widthPercentageToDP('100') - 40,
  },

  dropDownContainerStyle: {
    borderWidth: 0,
    borderRadius: 0,
    alignSelf: 'center',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: HRColors.grayBorder,
    width: widthPercentageToDP('100') - 40,
  },
});
