import React, {memo, useEffect, useState, useCallback} from 'react';
import Assets from '../Assets/index';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import {useSelector, useDispatch} from 'react-redux';
import {saveFavouriteList} from '../redux/Actions/User';
import BaseContainer from '../Components/BaseContainer';
import HRFavComponent from '../Components/HRFavComponent';
import NoDataComponent from '../Components/NoDataComponent';
import OrderDetailLoader from '../Components/OrderDetailLoader';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {FAVOURITE_API, ADD_REMOVE_FAV_API} from '../Utils/HRConstant';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
let pageCount = 1;
let onEndReach = true;
const FavouriteContainer = props => {
  const dispatch = useDispatch();
  const [FavData, setFavData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  const [disableTouch, setDisableTouch] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);

  useEffect(() => {
    pageCount = 1;
    setIsLoading(true);
    props.navigation.addListener('focus', () => {
      getFavList();
    });
  }, [props.navigation]);

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    pageCount = 1;
    wait(1000).then(() => {
      getFavList();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const getFavList = () => {
    let favParam = {
      page: pageCount,
      user_id: userData.userDetail.id,
    };
    postApi(FAVOURITE_API, favParam, onListSuccess, onListFailure, userData);
  };
  const onListSuccess = success => {
    if (success.status) {
      if (pageCount == 1) {
        setFavData(success.favorite_data);
        stopAllLoaders();
        onEndReach = success.favorite_data.length < 10 ? false : true;
      } else if (success.favorite_data.length < 10) {
        onEndReach = false;
        setFavData([...FavData, ...success.favorite_data]);
        stopAllLoaders();
      } else if (success.favorite_data.length !== 0) {
        setFavData([...FavData, ...success.favorite_data]);
      } else {
        onEndReach = false;
        stopAllLoaders();
      }
      setNoInternet(false);
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
      stopAllLoaders();
    }
  };

  const onListFailure = error => {
    stopAllLoaders();
  };

  const stopAllLoaders = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const clickOnHireMe = (item, index) => {
    props.navigation.navigate('details', {
      serviceProviderID: item?.service_id,
      lat: props?.route?.params?.lat,
      long: props?.route?.params?.long,
    });
  };

  const onPressFav = (item, index) => {
    setDisableTouch(true);
    let addRemoveFavParam = {
      is_wishlist: 'remove',
      service_id: item.service_id,
      user_id: userData.userDetail.id,
    };
    postApi(
      ADD_REMOVE_FAV_API,
      addRemoveFavParam,
      success => {
        if (success.status) {
          if (FavData.length == 1) {
            setFavData([]);
            setDisableTouch(false);
          } else {
            let removedData = FavData;
            removedData.splice(index, 1);
            setFavData(removedData);
            setDisableTouch(false);
          }
          dispatch(saveFavouriteList(success.favorite_data));
        } else {
          Toast.show(success.message, Toast.LONG);
        }
      },
      onFailure => {},
      userData,
    );
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getFavList();
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };
  // const lineSeparator = () => {
  //   return <View style={styles.dividerStyle} />;
  // };
  const renderFavData = ({item, index}) => {
    return (
      <HRFavComponent
        item={item}
        starSize={12}
        isFromFav={true}
        showRatingIcons={true}
        disabled={disableTouch}
        style={styles.favViewStyle}
        imageStyle={styles.favImgStyle}
        onFavPress={() => onPressFav(item, index)}
        bottomViewStyle={styles.favBottomViewStyle}
        hireMePress={() => clickOnHireMe(item, index)}
      />
    );
  };

  return (
    <BaseContainer isLeftIcon onPress={onBackPress} headerText={'Favourites'}>
      {isLoading ? (
        <View style={styles.flex}>
          {[1, 2, 3, 4, 5].map((item, index) => {
            return <OrderDetailLoader keyEx={item + index} />;
          })}
        </View>
      ) : (
        <FlatList
          data={FavData}
          windowSize={10}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          style={styles.flatStyle}
          renderItem={renderFavData}
          legacyImplementation={true}
          onEndReachedThreshold={0.5}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={lineSeparator}
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
          keyExtractor={(item, index) => index}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }
          ListFooterComponent={isLastLoading ? <OrderDetailLoader /> : null}
          onEndReached={({distanceFromEnd}) => {
            if (onEndReach) {
              setIsLastLoading(true);
              pageCount = pageCount + 1;
              getFavList();
            }
          }}
        />
      )}
    </BaseContainer>
  );
};

export default memo(FavouriteContainer);
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  favImgStyle: {
    width: widthPercentageToDP(25),
    height: widthPercentageToDP(26.5),
  },

  favViewStyle: {
    marginVertical: 0,
    paddingVertical: 7,
  },

  favBottomViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // dividerStyle: {
  //   borderWidth: 0.3,
  //   borderColor: HRColors.grayBorder,
  // },

  flatStyle: {
    marginHorizontal: 20,
  },
});
