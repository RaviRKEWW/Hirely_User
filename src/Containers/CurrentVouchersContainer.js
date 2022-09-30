import React, {useState, useEffect, useCallback} from 'react';
import Assets from '../Assets/index';
import {useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRListLoader from '../Components/HRListLoader';
import BaseContainer from '../Components/BaseContainer';
import {CURRENT_VOUCHER_API} from '../Utils/HRConstant';
import NoDataComponent from '../Components/NoDataComponent';
import HRVoucherComponent from '../Components/HRVoucherComponent';
import {FlatList, BackHandler, StyleSheet, RefreshControl} from 'react-native';
let pageCount = 1;
let endReached = true;
const CurrentVouchersContainer = props => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [voucherData, setVoucherData] = useState([]);
  const [noInternet, setNoInternet] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);

  useEffect(() => {
    pageCount = 1;
    setIsLoading(true);
    getCurrentVoucherList();
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);

  const getCurrentVoucherList = () => {
    let params = {
      page: pageCount,
      user_id: userData.userDetail.id,
    };
    postApi(CURRENT_VOUCHER_API, params, onSuccess, onFailure);
  };

  const onSuccess = success => {
    if (success.status) {
      if (pageCount == 1) {
        setVoucherData(success.data);
        stopAllLoader();
        endReached = success.data?.length < 10 ? false : true;
      } else if (success.data?.length < 10) {
        endReached = false;
        setVoucherData([...voucherData, ...success.data]);
        stopAllLoader();
      } else if (success.data?.length !== 0) {
        setVoucherData([...voucherData, ...success.data]);
        stopAllLoader();
      }
      setNoInternet(false);
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
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
      getCurrentVoucherList();
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
    getCurrentVoucherList();
  };
  const renderVoucherItem = ({item, index}) => {
    return <HRVoucherComponent item={item} isVouchers={true} />;
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      headerText={'Current Vouchers'}>
      {isLoading ? (
        <HRListLoader style={styles.loaderStyle} isList />
      ) : (
        <FlatList
          windowSize={10}
          data={voucherData}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          legacyImplementation={true}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          renderItem={renderVoucherItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index}
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
              getCurrentVoucherList();
            }
          }}
        />
      )}
    </BaseContainer>
  );
};
export default CurrentVouchersContainer;
const styles = StyleSheet.create({
  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
});
