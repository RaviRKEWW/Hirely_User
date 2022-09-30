import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  View,
  AppState,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import {
  HOME_API,
  FAV_LIST_API,
  GOOGLE_MAP_KEY,
  ADD_REMOVE_FAV_API,
} from '../Utils/HRConstant';
import {
  saveAddressList,
  saveUserDetails,
  saveMessageCount,
  saveReferralPoint,
  saveNotificationCount,
  saveNotificationSetting,
} from '../redux/Actions/User';
import {
  checkPermission,
  requestLocationPermission,
} from '../Utils/LocationServices';
import Assets from '../Assets/index';
import HRColors from '../Utils/HRColors';
import Geocoder from 'react-native-geocoding';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import DeviceInfo from 'react-native-device-info';
import HRPopupView from '../Components/HRPopView';
import {useDispatch, useSelector} from 'react-redux';
import {saveFavouriteList} from '../redux/Actions/User';
import NoDataComponent from '../Components/NoDataComponent';
import Geolocation from '@react-native-community/geolocation';
import {clearDataFromAsync} from '../Utils/AsyncStorageHelper';
import HRBannerComponent from '../Components/HRBannerComponent';
import HRLocationComponent from '../Components/HRLocationComponent';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import HRHomeSearchComponent from '../Components/HRHomeSearchComponent';
import HRCategoryLisComponent from '../Components/HRCategoryListComponent';
import HRRecommendedListComponent from '../Components/HRRecommendedListComponent';
import {useFocusEffect} from '@react-navigation/native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
let screenHeight = Dimensions.get('window').height;
let lat,
  long = '';
Geocoder.init(GOOGLE_MAP_KEY);
const HomeContainer = props => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  const [serviceCount, setServiceCount] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  let userData = useSelector(state => state.userOperation);
  const [recommendedData, setRecommendedData] = useState([]);
  const [foundPlaceValue, setFoundPlaceValue] = useState('');
  const [isLocationView, setIsLocationView] = useState(false);
  const [isLocationSheet, setIsLocationSheet] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    requestLocationPermission(onLocationSuccess, onLocationFailure);
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (lat && long) {
        // setIsLoading(true);
        getHomeData(lat, long);
      }
    }, []),
  );
  const _handleAppStateChange = nextAppState => {
    if (appState != nextAppState) {
      checkPermission(onLocationSuccess, onCheckFailure);
    }
  };

  const onCheckFailure = error => {
    if (error == 'blocked') {
      setIsLocationSheet(false);
      setIsLocationView(true);
    }
  };
  const onLocationSuccess = success => {
    setIsLocationSheet(false);
    setIsLocationView(false);
    DeviceInfo?.isLocationEnabled().then(enabled => {
      if (enabled) {
        Geolocation.getCurrentPosition(
          info => {
            lat = info?.coords?.latitude;
            long = info?.coords?.longitude;
            setCanRefresh(true);
            setIsLoading(true);
            getHomeData(lat, long);
            Geocoder.from(info?.coords?.latitude, info?.coords?.longitude)
              .then(json => {
                var addressComponent = json.results[0].formatted_address;
                setFoundPlaceValue(addressComponent);
              })
              .catch(error => console.warn(error));
          },
          error => {
            setIsLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 200000,
            maximumAge: 1000,
          },
        );
      } else {
        setIsLoading(false);
        Toast.show('Please enable location from system settings!', Toast.LONG);
      }
    });
  };
  const onLocationFailure = error => {
    if (error == 'denied' || error == 'blocked') {
      if (isLocationView) {
        setIsLocationSheet(false);
      } else {
        setIsLocationSheet(true);
        setIsLoading(false);
      }
    }
  };
  const getHomeData = (lats, logs) => {
    let homeBodyParam = {
      lat: lats,
      log: logs,
      user_id: userData?.userDetail?.id ? userData.userDetail.id : '',
    };
    postApi(HOME_API, homeBodyParam, onSuccess, onFailure);
    if (userData.userDetail.id) {
      let params = {user_id: userData.userDetail.id};
      postApi(FAV_LIST_API, params, onListSuccess, onListFailure, userData);
    }
  };
  const onListSuccess = successResponse => {
    if (successResponse.status) {
      Platform.OS === 'ios'
        ? PushNotificationIOS?.removeAllDeliveredNotifications()
        : PushNotification?.cancelAllLocalNotifications();
      dispatch(saveFavouriteList(successResponse.favorite_data));
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  const onListFailure = error => {
    setIsLoading(false);
    setIsRefresh(false);
    if (error?.toString().match(/403/)) {
      accountDeletedByAdmin();
    }
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      setServiceCount(successResponse.data.service_count);
      setBannerData(successResponse.data.advertisement);
      setCategoryData(successResponse.data.category);
      setRecommendedData(successResponse.data.service);
      setIsLoading(false);
      setIsRefresh(false);
      setNoInternet(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      setIsLoading(false);
      setIsRefresh(false);
    }
  };

  const onFailure = error => {
    setIsLoading(false);
    setIsRefresh(false);
  };

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      getHomeData(lat, long);
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const bannerPress = item => {
    console.log('item::', item);
    if (item?.type === 'category') {
      console.log('category');
      props.navigation.navigate('search', {
        isFromHome: true,
        categoryId: item.redirect_ids,
        lat: lat,
        long: long,
      });
    } else if (item?.type === 'sub_category') {
      console.log('sub_category');
      props.navigation.navigate('search', {
        isFromHome: false,
        subCategoryId: item?.redirect_ids,
        lat: lat,
        long: long,
      });
    } else if (item?.type === 'service') {
      console.log('service');
      props.navigation.navigate('details', {
        serviceProviderID: item?.redirect_ids,
        lat: lat,
        long: long,
      });
    } else {
      console.log('point_mall');
      props.navigation.navigate('pointmall');
    }
  };

  const onFocusAutoComplete = () => {
    props.navigation.navigate('autocompletePlace', {
      foundPlaceValue: foundPlaceValue,
      onGoBack: details => findPlace(details),
    });
  };

  const findPlace = details => {
    lat = details.geometry.location.lat;
    long = details.geometry.location.lng;
    setFoundPlaceValue(details.formatted_address);
    if (!isLocationView) {
      setIsLoading(true);
      getHomeData(
        details?.geometry?.location?.lat,
        details?.geometry?.location?.lng,
      );
    }
  };
  const onItemFav = (item, index, string) => {
    if (userData.userDetail.id) {
      let param = {
        service_id: item.id,
        is_wishlist: string,
        user_id: userData.userDetail.id,
      };
      postApi(
        ADD_REMOVE_FAV_API,
        param,
        success => {
          if (success.status) {
            dispatch(saveFavouriteList(success.favorite_data));
          } else {
            Toast.show(success.message, Toast.LONG);
          }
        },
        onFailure => {},
        userData,
      );
    }
  };

  const onDenyPress = () => {
    setIsLocationSheet(false);
    setIsLocationView(true);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getHomeData(lat, long);
  };
  const onFocusSearch = () => {
    if (!isLocationView && !isLocationSheet) {
      props.navigation.navigate('search', {
        isFromHome: false,
        lat: lat,
        long: long,
      });
    }
  };

  const onPressCategory = item => {
    props.navigation.navigate('subCategory', {
      isFromHome: true,
      categoryName: item.name,
      subCategoryArray: item.sub_category,
      lat: lat,
      long: long,
    });
  };

  const onViewAllCPress = () => {
    props.navigation.navigate('category', {
      lat: lat,
      long: long,
    });
  };

  const onViewAllRPress = () => {
    props.navigation.navigate('search', {
      isFromHome: true,
      lat: lat,
      long: long,
    });
  };

  const onPressRecommendedItem = (item, index) => {
    props.navigation.navigate('details', {
      serviceProviderID: item?.id,
      lat: lat,
      long: long,
    });
  };
  const onFavIconClick = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('favorite', {
        lat: lat,
        long: long,
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
  const accountDeletedByAdmin = () => {
    clearDataFromAsync(
      'UserData',
      () => {
        dispatch(saveUserDetails({}));
      },
      () => {},
    );
    clearDataFromAsync(
      'isNotification',
      () => {
        dispatch(saveNotificationSetting(true));
      },
      () => {},
    );
    clearDataFromAsync(
      'referralPoint',
      () => {
        dispatch(saveReferralPoint(0));
      },
      () => {},
    );
    clearDataFromAsync(
      'messageCount',
      () => {
        dispatch(saveMessageCount(0));
      },
      () => {},
    );
    clearDataFromAsync(
      'notificationCount',
      () => {
        dispatch(saveNotificationCount(0));
      },
      () => {},
    );
    clearDataFromAsync(
      'addressList',
      () => {
        dispatch(saveAddressList([]));
      },
      () => {},
    );
    Toast.show('Session logout!', Toast.LONG);
    props.navigation.reset({
      index: 0,
      routes: [{name: 'login'}],
    });
  };
  return (
    <ImageBackground style={styles.bgImgStyle1} source={Assets.homeSplashBg}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.scrollStyle, {marginTop: 25}]}
        refreshControl={
          canRefresh ? (
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          ) : null //if location not granted Refresh won't work
        }>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={'transparent'}
        />
        <HRHomeSearchComponent
          onFocusSearch={onFocusSearch}
          navigation={props.navigation}
          onFavListPress={onFavIconClick}
          foundPlaceValue={foundPlaceValue}
          onFocusAutoComplete={onFocusAutoComplete}
        />
        <View style={styles.lowerViewStyle}>
          {isLocationView ? (
            <View style={styles.noLocationViewStyle}>
              <HRLocationComponent />
            </View>
          ) : (
            <View
              style={[
                styles.scrollStyle,
                {marginBottom: bannerData.length > 0 ? 0 : 25},
              ]}>
              {noInternet ? (
                <NoDataComponent
                  onPress={onInternetRefresh}
                  text={'No internet connection'}
                  noDataImage={Assets.noInternetIcon}
                />
              ) : (
                <View
                  style={{
                    height:
                      categoryData.length > 0
                        ? recommendedData.length > 0
                          ? screenHeight - 75
                          : screenHeight - 200
                        : screenHeight - 125,
                  }}>
                  <HRBannerComponent
                    isLoading={isLoading}
                    onPress={bannerPress}
                    arrayItem={bannerData}
                    getIndex={index => {}}
                    bannerImageStyle={styles.bannerStyle}
                  />

                  {isLoading ? (
                    //consider this as loader do not remove
                    <>
                      <HRCategoryLisComponent
                        isLoading={isLoading}
                        categoryData={categoryData}
                        navigation={props.navigation}
                        onViewAllCat={onViewAllCPress}
                        onCategoryPress={item => onPressCategory(item)}
                      />
                      <HRRecommendedListComponent
                        isLoading={isLoading}
                        onItemFav={onItemFav}
                        serviceCount={serviceCount}
                        arrayItem={recommendedData}
                        viewAllRec={onViewAllRPress}
                        navigation={props.navigation}
                        onRecItemPress={(item, index) =>
                          onPressRecommendedItem(item, index)
                        }
                      />
                    </>
                  ) : (
                    <>
                      {categoryData.length == 0 &&
                      recommendedData.length == 0 ? (
                        <NoDataComponent style={styles.noDataViewStyle} />
                      ) : (
                        <>
                          {categoryData.length > 0 ? (
                            <HRCategoryLisComponent
                              isLoading={isLoading}
                              categoryData={categoryData}
                              navigation={props.navigation}
                              onViewAllCat={onViewAllCPress}
                              onCategoryPress={item => onPressCategory(item)}
                            />
                          ) : null}
                          {recommendedData.length > 0 ? (
                            <HRRecommendedListComponent
                              isLoading={isLoading}
                              onItemFav={onItemFav}
                              serviceCount={serviceCount}
                              arrayItem={recommendedData}
                              viewAllRec={onViewAllRPress}
                              navigation={props.navigation}
                              onRecItemPress={(item, index) =>
                                onPressRecommendedItem(item, index)
                              }
                            />
                          ) : null}
                        </>
                      )}
                    </>
                  )}
                </View>
              )}
            </View>
          )}
          <HRPopupView isVisible={isLocationSheet} animationType={'fade'}>
            <HRLocationComponent onDenyPress={onDenyPress} isBottom />
          </HRPopupView>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
export default HomeContainer;
const styles = StyleSheet.create({
  bgImgStyle1: {
    width: '100%',
    height: '100%',
  },

  scrollStyle: {
    flex: 1,
  },

  noLocationViewStyle: {
    height: heightPercentageToDP(65.5),
  },

  lowerViewStyle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: HRColors.white,
  },

  bannerStyle: {
    marginTop: 15,
  },

  noDataViewStyle: {
    height: heightPercentageToDP(45),
  },
});
