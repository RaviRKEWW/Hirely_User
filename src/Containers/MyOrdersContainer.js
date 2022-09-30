import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  BackHandler,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import Assets from '../Assets/index';
import {useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRListLoader from '../Components/HRListLoader';
import {ORDER_HISTORY_API} from '../Utils/HRConstant';
import BaseContainer from '../Components/BaseContainer';
import NoDataComponent from '../Components/NoDataComponent';
import HROrderListComponent from '../Components/HROrderListComponent';
import HRRadioListComponent from '../Components/HRRadioListComponent';
import {useFocusEffect} from '@react-navigation/native';
import HRThemeBtn from '../Components/HRThemeBtn';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

let endReached = true;
let pageCount = 1;
const orderTypeArray = [
  {
    //1
    label: 'all',
  },
  {
    //2
    label: 'in-progress',
  },
  {
    //3
    label: 'requested',
  },
  {
    //4
    label: 'confirm',
  },

  {
    //5
    label: 'rejected',
  },
  {
    //6
    label: 'completed',
  },
  {
    //7
    label: 'cancelled',
  },
  {
    //8
    label: 'claimed',
  },
];
const MyOrdersContainer = props => {
  const [isFilter, setIsFilter] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(0);
  const [noInternet, setNoInternet] = useState(false);
  const [orderListData, setOrderListData] = useState([]);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);
  const [filterOrderListData, setFilterOrderListData] = useState([]);

  useEffect(() => {
    if (userData?.userDetail?.id) {
      setIsLoading(true);
      props.navigation.addListener('focus', () => {
        pageCount = 1;
        getOrderList();
      });
    }
  }, []);
  useEffect(() => {
    const foregroundMessage = messaging().onMessage(async remoteMessage => {
      pageCount = 1;
      getOrderList();
      filterOrderList(orderTypeArray[selectedType], selectedType);
    });
    return foregroundMessage;
  }, []);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const onRefresh = () => {
    pageCount = 1;
    setIsRefresh(true);
    getOrderList();
    filterOrderList(orderTypeArray[selectedType], selectedType);
  };
  useFocusEffect(
    useCallback(() => {
      if (!userData?.userDetail?.id) {
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
      } else {
        onRefresh();
      }
    }, []),
  );
  const getOrderList = () => {
    let orderListParam = {
      page: pageCount,
      user_id: userData.userDetail.id,
    };
    postApi(ORDER_HISTORY_API, orderListParam, onSuccess, onFailure, userData);
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      Platform.OS === 'ios'
        ? PushNotificationIOS?.removeAllDeliveredNotifications()
        : PushNotification?.cancelAllLocalNotifications();
      if (pageCount == 1) {
        setOrderListData(successResponse.data);
        stopAllLoaders();
        endReached = successResponse.data?.length < 10 ? false : true;
      } else if (successResponse.data?.length < 10) {
        endReached = false;
        setOrderListData([...orderListData, ...successResponse.data]);
        stopAllLoaders();
      } else if (successResponse.data?.length !== 0) {
        setOrderListData([...orderListData, ...successResponse.data]);
        stopAllLoaders();
      }
      setNoInternet(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      console.log(successResponse); //do not remove ths
      stopAllLoaders();
    }
  };

  const onFailure = error => {
    Toast.show(error.toString(), Toast.LONG);
    stopAllLoaders();
  };

  const onBackPress = () => {
    props.navigation.navigate('profile');
    return true;
  };

  const stopAllLoaders = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const filterOrderList = (orderItem, index) => {
    console.log('filterOrderList::', orderItem, index);
    setSelectedType(index);
    if (index == 0) {
      setIsFilter(false);
      setOrderListData(orderListData);
    } else {
      setIsFilter(true);
      const filteredData = orderListData.filter(item =>
        item.status.includes(orderItem.label),
      );
      setFilterOrderListData(filteredData);
    }
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getOrderList();
  };
  const orderRenderItem = ({item, index}) => {
    return <HROrderListComponent item={item} navigation={props.navigation} />;
  };

  return (
    <BaseContainer headerText={'Orders'} styles={{backgroundColor: '#F8F8F8'}}>
      <View style={styles.flex}>
        <View style={styles.marginTop}>
          <HRRadioListComponent
            arrayItem={orderTypeArray}
            selectedIndex={selectedType}
            onPress={(item, index) => filterOrderList(item, index)}
          />
        </View>
        {isLoading ? (
          <View style={styles.flex}>
            <HRListLoader style={styles.loaderStyle} isList />
          </View>
        ) : (
          <FlatList
            windowSize={10}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            style={styles.marginTop}
            legacyImplementation={true}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            renderItem={orderRenderItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              noInternet ? (
                <NoDataComponent
                  onPress={onInternetRefresh}
                  text={'No internet connection'}
                  noDataImage={Assets.noInternetIcon}
                />
              ) : (
                <NoDataComponent />
              )
            }
            data={isFilter ? filterOrderListData : orderListData}
            refreshControl={
              <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
            }
            ListFooterComponent={() => {
              return isLastLoading ? (
                <HRListLoader style={styles.loaderStyle} />
              ) : null;
            }}
            onEndReached={({distanceFromEnd}) => {
              if (endReached) {
                setIsLastLoading(true);
                pageCount = pageCount + 1;
                getOrderList();
              }
            }}
          />
        )}
      </View>
      <HRThemeBtn
        onPress={() => props?.navigation.navigate('help')}
        btnText="Help"
        isLoading={isLoading}
        style={styles.submitBtnStyle}
      />
    </BaseContainer>
  );
};
export default MyOrdersContainer;
const styles = StyleSheet.create({
  submitBtnStyle: {
    marginBottom: 25,
    marginHorizontal: 20,
  },
  flex: {
    flex: 1,
  },

  marginTop: {
    marginTop: 15,
  },

  loaderStyle: {
    height: 50,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
