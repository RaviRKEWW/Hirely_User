import React, {memo, useEffect, useState, useCallback} from 'react';
import {
  NOTIFICATION_LIST_API,
  NOTIFICATION_SEEN_API,
} from '../Utils/HRConstant';
import Assets from '../Assets/index';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import HRListLoader from '../Components/HRListLoader';
import {postApi, getApi} from '../Utils/ServiceManager';
import BaseContainer from '../Components/BaseContainer';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import NoDataComponent from '../Components/NoDataComponent';
import {saveNotificationCount} from '../redux/Actions/User';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import HRNotificationComponent from '../Components/HRNotificationComponent';
let pageCount = 1;
let endReached = true;
const NotificationContainer = props => {
  const dispatch = useDispatch();
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getNotificationList();
  }, []);

  const onRefresh = () => {
    setIsRefresh(true);
    pageCount = 1;
    getNotificationList();
  };

  const getNotificationList = () => {
    dispatch(saveNotificationCount(0));
    saveDataInAsync(
      'notificationCount',
      0,
      () => {},
      () => {},
    );
    let notificationParam = {
      user_id: userData?.userDetail?.id,
      page: pageCount,
    };
    postApi(
      NOTIFICATION_LIST_API,
      notificationParam,
      onNotificationSuccess,
      onNotificationFailure,
      userData,
    );
  };

  const onNotificationFailure = error => {
    console.log('onNotificationFailure::', error);
    setIsLoading(false);
    setIsRefresh(false);
  };
  const onNotificationSuccess = successResponse => {
    if (successResponse?.status) {
      if (pageCount == 1) {
        setNotificationData(successResponse?.data);
        stopAllLoader();
        endReached = successResponse?.data?.length < 10 ? false : true;
      } else if (successResponse?.data?.length < 10) {
        endReached = false;
        setNotificationData(oldData => [...oldData, ...successResponse?.data]);
        stopAllLoader();
      } else if (successResponse?.data?.length !== 0) {
        setNotificationData(oldData => [...oldData, ...successResponse?.data]);
        stopAllLoader();
      }
      setNoInternet(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse?.message, Toast.LONG);
      }
      stopAllLoader();
    }
  };

  const stopAllLoader = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const onBackPress = () => {
    pageCount = 1;
    props?.navigation?.goBack();
  };
  const lineSeparator = () => <View style={styles.dividerStyle} />;
  const onPressOnItem = (item, index) => {
    getApi(
      NOTIFICATION_SEEN_API + item.id,
      successResponse => {
        if (successResponse.status) {
          let isSeen = [...notificationData];
          isSeen[index] = {
            ...isSeen[index],
            read_status: (item.read_status = 'seen'),
          };
          setNotificationData(isSeen);
          if (item.type == 'order') {
            props.navigation.navigate('orderDetail', {
              goBack: true,
              orderId: item.order_id,
            });
          }
        } else {
          Toast.show(successResponse.message, Toast.LONG);
        }
      },
      onReadFailure,
      userData,
    );
  };
  const onReadFailure = error => {};

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getNotificationList();
  };
  const renderNotificationItem = ({item, index}) => {
    return (
      <HRNotificationComponent
        item={item}
        index={index}
        onPress={() => onPressOnItem(item, index)}
      />
    );
  };
  const keyExtractor = item => item?.id?.toString();
  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      headerText={'Notifications'}>
      {isLoading ? (
        <View style={styles.flex}>
          <HRListLoader style={styles.loaderStyle} isList />
        </View>
      ) : (
        <FlatList
          windowSize={10}
          data={notificationData}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          legacyImplementation={true}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          renderItem={renderNotificationItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={lineSeparator}
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
          keyExtractor={keyExtractor}
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
              getNotificationList();
            }
          }}
        />
      )}
    </BaseContainer>
  );
};
export default memo(NotificationContainer);
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },

  dividerStyle: {
    borderWidth: 0.2,
    borderColor: HRColors.grayBorder,
  },
});
