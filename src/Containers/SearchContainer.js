import React, {useEffect, useState, memo} from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  SEARCH_API,
  FILTER_LIST_API,
  VIEW_ALL_SERVICE,
  ADD_REMOVE_FAV_API,
  getProportionalFontSize,
  DATE_WISE_SLOT,
} from '../Utils/HRConstant';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {getApi, postApi} from '../Utils/ServiceManager';
import HRPopupView from '../Components/HRPopView';
import {useSelector, useDispatch} from 'react-redux';
import HRListLoader from '../Components/HRListLoader';
import {saveFavouriteList} from '../redux/Actions/User';
import BaseContainer from '../Components/BaseContainer';
import NoDataComponent from '../Components/NoDataComponent';
import HRFilterComponent from '../Components/HRFilterComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import HRRecommendedComponent from '../Components/HRRecommendedComponent';
var moment = require('moment');
import HRPopView from '../Components/HRPopView';
import HRBannerComponent from '../Components/HRBannerComponent';
import HRDateComponent from '../Components/HRDateComponent';
let endReached = true;
let pageCount = 1;
let filterPageCount = 1;
var selectedDateFilter = '';
var selectedTimeFilter = '';
const ITEM_HEIGHT = 200;
const filterRating = [
  {
    rating: 5,
  },
  {
    rating: 4.5,
  },
  {
    rating: 4,
  },
];
const filterType = [{value: 'freelancer'}, {value: 'company'}, {value: 'both'}];
const filterPrice = [
  {value: 'low to high', icon: 'arrowup'},
  {value: 'high to low', icon: 'arrowdown'},
];
const filterProviderTime = [
  {value: 'old to new', icon: 'arrowup'},
  {value: 'new to old', icon: 'arrowdown'},
];

const SearchContainer = props => {
  const dispatch = useDispatch();
  const [, setState] = useState(''); //do not remove this
  const [isFilter, setIsFilter] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [isReset, setIsReset] = useState(false);
  const [isResetDate, setIsResetDate] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const [totalService, setTotalService] = useState('');
  const [disableTouch, setDisableTouch] = useState(false);
  let userData = useSelector(state => state?.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);
  const [recommendedData, setRecommendedData] = useState([]); //recommended data and search data are same as the response for two api is same...
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [filterRadius, setFilterRadius] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [filterDateData, setFilterDateData] = useState([]);
  const [selectedProviderTime, setSelectedProviderTime] = useState(''); //basically sort by date on service providers signup
  const [selectedType, setSelectedType] = useState(''); //basically sort by type
  const [todaySlot, setTodaySlot] = useState([]);
  const [tomorrowSlot, setTomorrowSlot] = useState([]);
  const [openImageView, setOpenImageView] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    pageCount = 1;
    for (let i = 0; i < 7; i++) {
      filterDateData?.push({
        date: moment().add(i, 'day')?.format(),
        day: moment().add(i, 'day')?.format('ddd'),
      });
    }
    setState('1'); //do not remove this
    return () => {
      setFilterDateData([]);
    };
  }, []);
  useEffect(() => {
    setCanRefresh(true);
    getSlot();
    if (
      props?.route?.params?.isFromHome ||
      props?.route?.params?.subCategoryId
    ) {
      getAllServices(searchText);
      setIsLoading(true);
    } else {
      if (searchText?.trim()?.length > 2) {
        onSearchApi(searchText);
      }
    }
  }, []);
  useEffect(() => {
    if (
      selectedPrice == '' &&
      selectedRating == '' &&
      selectedProviderTime == '' &&
      selectedType == '' &&
      isReset == true
    ) {
      onApplyFilterClick();
    } else if (
      selectedTime == '' &&
      selectedDate == '' &&
      isResetDate == true
    ) {
      onApplyFilterClick();
    }
  }, [isReset, isResetDate]);

  const onRefresh = () => {
    getSlot();
    pageCount = 1;
    filterPageCount = 1;
    if (
      selectedPrice !== '' ||
      selectedRating !== '' ||
      selectedProviderTime !== '' ||
      selectedType !== '' ||
      selectedTime !== '' ||
      selectedDate !== ''
    ) {
      onApplyFilterClick();
    } else {
      if (props?.route?.params?.isFromHome) {
        setIsRefresh(true);
        getAllServices(searchText);
      } else {
        if (searchText?.trim().length > 2) {
          setIsRefresh(true);
          onSearchApi(searchText);
        }
      }
    }
  };

  const getSlot = () => {
    getApi(DATE_WISE_SLOT, getDateSlotSuccess, getDateSlotFailure);
  };
  const getDateSlotSuccess = onSuccess => {
    if (onSuccess?.status) {
      setTodaySlot(onSuccess?.data?.today);
      setTomorrowSlot(onSuccess?.data?.tomorrow);
    }
  };
  const getDateSlotFailure = error => {
    console.log('getDateSlotFailure::', error);
  };
  const getAllServices = text => {
    let viewServiceParam = {
      text: text,
      page: pageCount,
      lat: props?.route?.params?.lat,
      log: props?.route?.params?.long,
      user_id: userData?.userDetail?.id ?? '',
      category_id: props?.route?.params?.categoryId ?? '',
      sub_category_id: props?.route?.params?.subCategoryId ?? '',
    };
    postApi(VIEW_ALL_SERVICE, viewServiceParam, onSuccess, onFailure);
  };
  const onSuccess = response => {
    if (response?.status) {
      stopAllLoaders();
      if (pageCount == 1) {
        setTotalService(response?.count);
        setRecommendedData(response?.data);
        endReached = response?.data?.length < 10 ? false : true;
      } else if (response?.data?.length < 10) {
        endReached = false;
        setRecommendedData(oldData => [...oldData, ...response?.data]);
      } else if (response?.data?.length !== 0) {
        setRecommendedData(oldData => [...oldData, ...response?.data]);
      }
      setNoInternet(false);
    } else {
      if (response?.message?.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast?.show(response?.message, Toast.LONG);
      }
    }
  };

  const onFailure = error => {
    console.log('onFailure', error);
    stopAllLoaders();
  };

  const onFilterClick = () => {
    filterPageCount = 1;
    setIsFilter(true);
    setIsReset(false);
    setIsLoading(true);
  };
  const onDateClick = () => {
    filterPageCount = 1;
    setIsDate(true);
    setIsResetDate(false);
    setIsLoading(true);
  };

  const onBackPress = () => {
    onResetFilter();
    onResetFilterDate();
    props?.navigation?.goBack();
  };
  const onSearchApi = text => {
    //When coming from search TextInput
    setSearchText(text);
    if (text?.length > 2) {
      setIsLoading(true);
      let searchBodyParam = {
        text: text,
        page: pageCount,
        lat: props?.route?.params?.lat,
        log: props?.route?.params?.long,
        user_id: userData?.userDetail?.id ?? '',
        category_id: props?.route?.params?.categoryId ?? '',
        sub_category_id: props?.route?.params?.subCategoryId ?? '',
      };
      postApi(SEARCH_API, searchBodyParam, onSuccess, onFailure);
    } else if (text?.length == 0) {
      setRecommendedData([]);
    }
  };

  const stopAllLoaders = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };
  const onItemMsgPress = item => {
    if (userData?.userDetail?.id) {
      props?.navigation?.navigate('messageList', {
        senderId: item?.provider?.id,
        name: item?.provider?.name,
        image: item?.provider?.image,
      });
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props?.navigation?.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props?.navigation?.navigate('login')},
      ]);
    }
  };

  const onResetFilter = () => {
    setFilterRadius(0);
    setSelectedPrice('');
    setSelectedRating('');
    setSelectedProviderTime('');
    setSelectedType('');
    setIsFilter(false);
    setIsReset(true);
    // isReset = true;
    pageCount = 1;
    filterPageCount = 1;
  };
  const onResetFilterDate = () => {
    setSelectedDate('');
    setSelectedTime('');
    setIsDate(false);
    setIsResetDate(true);
    // isReset = true;
    selectedDateFilter = '';
    selectedTimeFilter = '';
    pageCount = 1;
    filterPageCount = 1;
  };
  const onApplyFilterClick = () => {
    setIsFilter(false);
    setIsDate(false);
    // setIsLoading(true);
    if (selectedRating == '' && selectedPrice == '' && selectedDate == null) {
      pageCount = 1;
      if (props?.route?.params?.isFromHome) {
        getAllServices(searchText);
      } else {
        if (searchText?.trim().length > 2) {
          onSearchApi(searchText);
        }
      }
    } else {
      var filterBodyParam = {
        category_id: props?.route?.params?.categoryId ?? '',
        sub_category_id: props?.route?.params?.subCategoryId ?? '',
        page: filterPageCount,
        rating: selectedRating,
        lat: props?.route?.params?.lat,
        log: props?.route?.params?.long,
        price: selectedPrice?.split(' ')[0],
        filter_schedule_from: selectedTimeFilter,
        is_provider_time: selectedProviderTime?.split(' ')[0],
        user_type: selectedType,
        filter_schedule_date:
          selectedDateFilter == ''
            ? selectedDateFilter
            : moment(selectedDateFilter)?.format('YYYY-MM-DD'),
      };
      postApi(
        FILTER_LIST_API,
        filterBodyParam,
        onFilterSuccess,
        onFilterFailure,
      );
    }
  };
  const onFilterSuccess = successResponse => {
    if (successResponse?.status) {
      setTotalService(successResponse?.count);
      if (filterPageCount == 1) {
        setRecommendedData(successResponse?.data);
        stopAllLoaders();
        endReached = successResponse?.data?.length < 10 ? false : true;
      } else if (successResponse?.data?.length < 10) {
        endReached = false;
        setRecommendedData(oldData => [...oldData, ...successResponse?.data]);
        stopAllLoaders();
      } else if (successResponse?.data?.length !== 0) {
        setRecommendedData(oldData => [...oldData, ...successResponse?.data]);
        stopAllLoaders();
      }
      setNoInternet(false);
    } else {
      if (successResponse?.message?.match(/network|internet/)) {
        setNoInternet(true);
        setRecommendedData([]);
        stopAllLoaders();
      } else {
        Toast.show(successResponse?.message, Toast.LONG);
        setRecommendedData([]);
        stopAllLoaders();
      }
    }
  };

  const onFilterFailure = error => {
    setRecommendedData([]);
    stopAllLoaders();
  };

  const onSelectDateHandler = (item, index) => {
    setSelectedDate(index);
    selectedDateFilter = item?.date;
  };

  const onSelectTimeHandler = (item, index) => {
    setSelectedTime(index);
    selectedTimeFilter = item?.start;
  };
  const onItemFav = (item, index, str) => {
    if (userData?.userDetail?.id) {
      setDisableTouch(true);
      let addRemoveFavParam = {
        is_wishlist: str,
        service_id: item?.id,
        user_id: userData?.userDetail?.id,
      };
      postApi(
        ADD_REMOVE_FAV_API,
        addRemoveFavParam,
        successResponse => {
          if (successResponse?.status) {
            dispatch(saveFavouriteList(successResponse?.favorite_data));
            let isFav = [...recommendedData];
            isFav[index] = {
              ...isFav[index],
              is_wishlist: item?.is_wishlist == true ? false : true,
            };
            setRecommendedData(isFav);
            setDisableTouch(false);
          } else {
            Toast.show(successResponse?.message, Toast.LONG);
            setDisableTouch(false);
          }
        },
        error => {
          Toast.show(error?.message, Toast.LONG);
        },
        userData,
      );
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props?.navigation?.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props?.navigation?.navigate('login')},
      ]);
    }
  };
  const onChangeSearchText = text => {
    setSearchText(text);
    if (text?.trim()?.length > 2 || text?.trim()?.length == '0') {
      pageCount = 1;
      filterPageCount = 1;
      getAllServices(text);
    }
  };
  const onInternetRefresh = () => {
    setNoInternet(false);
    if (props?.route?.params?.isFromHome) {
      setIsLoading(true);
      getAllServices(searchText);
    } else {
      if (searchText?.trim()?.length > 2) {
        setIsLoading(true);
        onSearchApi(searchText);
      }
    }
  };
  const onPressCarousalHandler = index => {
    setOpenImageView(!openImageView);
    setBannerIndex(index);
  };
  const getItemLayout = (data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });
  console.log('recommendedData::', recommendedData);
  const renderRecommendedData = ({item, index}) => {
    return (
      <HRRecommendedComponent
        autoPlay
        item={item}
        index={index}
        onPressCarousal={() => onPressCarousalHandler(index)}
        disabled={disableTouch}
        navigation={props?.navigation}
        onItemPress={() => onItemPress(item)}
        onMsgPress={() => onItemMsgPress(item)}
        onItemFav={str => onItemFav(item, index, str)}
      />
    );
  };
  const keyExtractor = item => item?.id?.toString();
  const onItemPress = item => {
    props?.navigation?.navigate('details', {
      serviceProviderID: item?.id,
      lat: props?.route?.params?.lat,
      long: props?.route?.params?.long,
    });
  };
  const onCloseHandler = () => {
    setIsFilter(false);
    setIsReset(true);
    // isReset = true;
    pageCount = 1;
    filterPageCount = 1;
    stopAllLoaders();
  };
  const onCloseDateHandler = () => {
    setIsDate(false);
    setIsResetDate(true);
    // isReset = true;
    pageCount = 1;
    filterPageCount = 1;
    stopAllLoaders();
  };
  const renderSliderImages = () => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        onPress={() => setOpenImageView(false)}
        style={styles.sliderViewStyle}>
        <HRBannerComponent
          index={0}
          pageSize={widthPercentageToDP(100)}
          bannerImageStyle={styles.zoomImageStyle}
          arrayItem={recommendedData[bannerIndex]?.service_images}
        />
      </TouchableOpacity>
    );
  };
  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      styles={{backgroundColor: '#F8F8F8'}}
      isTitleComponent={
        !props?.route?.params?.isFromHome ? (
          <Text style={styles.searchHeaderTextStyle}>Search</Text>
        ) : (
          <View style={[styles.mainViewStyle, {marginStart: 10}]}>
            <Icon
              size={20}
              name="search1"
              type="antdesign"
              color={HRColors.black}
              style={styles.searchIcon1Style}
            />
            <TextInput
              value={searchText}
              placeholder={'Search'}
              style={styles.searchTxtInStyle}
              placeholderTextColor={HRColors.black}
              onChangeText={text => onChangeSearchText(text)}
            />
          </View>
        )
      }
      filterComponent={
        <>
          {props?.route?.params?.isFromHome ? (
            <>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={onDateClick}
                style={styles.favFilterIconStyle}>
                <Icon
                  size={22}
                  name={'date-range'}
                  type={'material'}
                  color={'#8B9897'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1.0}
                onPress={onFilterClick}
                style={styles.favFilterIconStyle}>
                <Icon
                  size={22}
                  name={'filter'}
                  type={'feather'}
                  color={'#8B9897'}
                />
              </TouchableOpacity>
            </>
          ) : null}
        </>
      }>
      {!props?.route?.params?.isFromHome ? (
        <View style={styles.flexRow}>
          <View
            style={[styles.mainViewStyle, {marginStart: 20, marginRight: 10}]}>
            <Icon
              size={20}
              name="search1"
              type="antdesign"
              color={HRColors.black}
              style={styles.searchIcon2Style}
            />
            <TextInput
              placeholder={'Search'}
              onChangeText={text => {
                onSearchApi(text);
              }}
              style={styles.searchTxtInStyle}
              placeholderTextColor={HRColors.black}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={onDateClick}
            style={styles.favFilterIconStyle}>
            <Icon
              size={22}
              name={'date-range'}
              type={'material'}
              color={'#8B9897'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={onFilterClick}
            style={styles.favFilterIconStyle}>
            <Icon
              size={22}
              name={'filter'}
              type={'feather'}
              color={'#8B9897'}
            />
          </TouchableOpacity>
        </View>
      ) : null}
      {totalService && !noInternet && recommendedData?.length !== 0 ? (
        <View style={styles.searchCountViewStyle}>
          <Text style={styles.searchCountTextStyle}>{totalService}</Text>
          <Text style={styles.resultTextStyle}>
            {' '}
            {totalService > 1 ? 'Results' : 'Result'} Found!
          </Text>
        </View>
      ) : null}
      {isLoading ? (
        <HRListLoader style={styles.loaderStyle} isList />
      ) : (
        <FlatList
          data={recommendedData}
          onEndReachedThreshold={0.5}
          initialNumToRender={recommendedData?.length}
          removeClippedSubviews={true}
          getItemLayout={getItemLayout}
          style={styles.listStyle}
          renderItem={renderRecommendedData}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            noInternet ? (
              <NoDataComponent
                onPress={onInternetRefresh}
                text={'No internet connection'}
                noDataImage={Assets.noInternetIcon}
              />
            ) : (
              <NoDataComponent text={'COMING SOON'} />
            )
          }
          refreshControl={
            canRefresh ? (
              <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
            ) : null //if location not granted Refresh won't work
          }
          ListFooterComponent={() => {
            return isLastLoading ? (
              <ActivityIndicator color={HRColors.primary} size={'large'} />
            ) : null;
          }}
          onEndReached={() => {
            if (endReached) {
              setIsLastLoading(true);
              pageCount = pageCount + 1;
              filterPageCount = filterPageCount + 1;
              if (
                props?.route?.params?.isFromHome &&
                isReset != false &&
                isResetDate != false
              ) {
                getAllServices(searchText);
              } else if (isReset == false || isResetDate == false) {
                onApplyFilterClick();
              } else {
                onSearchApi(searchText);
              }
            }
          }}
        />
      )}
      <ScrollView>
        {isFilter ? (
          <HRPopupView
            visible={isFilter}
            animationType={'slide'}
            onRequestClose={onCloseHandler}>
            <View style={styles.filterPopViewStyle}>
              <HRFilterComponent
                isFilterOn={isFilter}
                filterRating={filterRating}
                selectedRatingFilter={selectedRating}
                setSelectedRatingFilter={data => setSelectedRating(data)}
                filterPrice={filterPrice}
                selectedPriceFilter={selectedPrice}
                setSelectedPriceFilter={data => setSelectedPrice(data)}
                filterLocation={filterRadius}
                setFilterLocation={setFilterRadius}
                filterDateData={filterDateData}
                selectedDate={selectedDate}
                onSelectDateHandler={(item, index) => {
                  onSelectDateHandler(item, index);
                }}
                selectedTime={selectedTime}
                filterTimeData={selectedDate == 0 ? todaySlot : tomorrowSlot}
                onSelectTimeHandler={(item, index) => {
                  onSelectTimeHandler(item, index);
                }}
                onReset={onResetFilter}
                onApplyFilter={onApplyFilterClick}
                onCancel={onCloseHandler}
                filterProviderTime={filterProviderTime}
                selectedProviderTime={selectedProviderTime}
                setSelectedProvider={data => setSelectedProviderTime(data)}
                filterType={filterType}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </View>
          </HRPopupView>
        ) : null}
        {isDate ? (
          <HRPopupView
            visible={isDate}
            animationType={'slide'}
            onRequestClose={onCloseDateHandler}>
            <View style={styles.filterPopViewStyle}>
              <HRDateComponent
                isFilterOn={isDate}
                filterDateData={filterDateData}
                selectedDate={selectedDate}
                onSelectDateHandler={(item, index) => {
                  onSelectDateHandler(item, index);
                }}
                selectedTime={selectedTime}
                filterTimeData={selectedDate == 0 ? todaySlot : tomorrowSlot}
                onSelectTimeHandler={(item, index) => {
                  onSelectTimeHandler(item, index);
                }}
                onReset={onResetFilterDate}
                onApplyFilter={onApplyFilterClick}
                onCancel={onCloseDateHandler}
                filterProviderTime={filterProviderTime}
                selectedProviderTime={selectedProviderTime}
                setSelectedProvider={data => setSelectedProviderTime(data)}
              />
            </View>
          </HRPopupView>
        ) : null}
      </ScrollView>
      {recommendedData?.length > 0 ? (
        <HRPopView
          animationType={'fade'}
          isVisible={openImageView}
          onRequestClose={() => setOpenImageView(false)}>
          {renderSliderImages()}
        </HRPopView>
      ) : null}
    </BaseContainer>
  );
};
export default memo(SearchContainer);
const styles = StyleSheet.create({
  sliderViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  zoomImageStyle: {
    alignSelf: 'center',
    width: widthPercentageToDP(85),
    height: widthPercentageToDP(85),
  },

  mainViewStyle: {
    flex: 1,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#D4D9D9',
  },

  flexRow: {
    flexDirection: 'row',
  },

  searchIcon1Style: {
    paddingHorizontal: 7,
  },

  searchIcon2Style: {
    paddingStart: 7,
  },

  searchTxtInStyle: {
    flex: 1,
    height: 45,
    marginEnd: 15,
    paddingLeft: 5,
    color: HRColors.black,
  },

  searchCountViewStyle: {
    marginTop: 5,
    paddingVertical: 7,
    flexDirection: 'row',
    marginHorizontal: 20,
  },

  searchCountTextStyle: {
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(13),
  },

  resultTextStyle: {
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  listStyle: {
    marginHorizontal: 10,
  },

  favFilterIconStyle: {
    height: 45,
    marginEnd: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#D4D9D9',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },

  searchHeaderTextStyle: {
    flex: 0.5,
    textAlign: 'right',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  loaderStyle: {
    margin: 10,
    marginTop: 10,
    borderRadius: 15,
    alignSelf: 'center',
    width: widthPercentageToDP(90),
    height: widthPercentageToDP(90),
  },

  filterPopViewStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
