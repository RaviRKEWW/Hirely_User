import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  Platform,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import HRListLoader from '../Components/HRListLoader';
import {getApi, postApi} from '../Utils/ServiceManager';
import BaseContainer from '../Components/BaseContainer';
import NoDataComponent from '../Components/NoDataComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {REWARD_LIST_API, VALIDATE_PROMO_CODE_API} from '../Utils/HRConstant';
const RewardContainer = props => {
  const [isRefresh, setIsRefresh] = useState(false);
  const [rewardsData, setRewardData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  let userData = useSelector(state => state.userOperation);

  useEffect(() => {
    setIsLoading(true);
    getRewardList();
  }, []);

  const getRewardList = () => {
    getApi(
      REWARD_LIST_API + userData.userDetail.id,
      onRewardSuccess,
      onRewardFailure,
      userData,
    );
  };

  const onRewardSuccess = successResponse => {
    if (successResponse.status) {
      setRewardData(successResponse.valid_promocodes);
      setNoInternet(false);
      setIsRefresh(false);
      setIsLoading(false);
    } else {
      setIsRefresh(false);
      setIsLoading(false);
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
    }
  };

  const onRewardFailure = error => {
    setIsRefresh(false);
    setIsLoading(false);
  };

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      getRewardList();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getRewardList();
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  const applyOfferClick = (item, index) => {
    let promoBodyParam = {
      promocode: item.code,
      user_id: userData.userDetail.id,
      total_amount: props.route.params.totalAmount,
    };
    postApi(
      VALIDATE_PROMO_CODE_API,
      promoBodyParam,
      successResponse => {
        if (successResponse.status) {
          Toast.show(
            'Promo code ' + item.code + ' applied successfully!',
            Toast.LONG,
          );
          let data = {};
          data['promoCode'] = item.code;
          data['discountAmount'] = successResponse.discount_amount;
          props.route.params.onGoBack(data);
          onBackPress();
        } else {
          Toast.show(successResponse.message, Toast.LONG);
        }
      },
      onValidateFailure,
      userData,
    );
  };

  const onValidateFailure = error => {};
  const rewardRender = ({item, index}) => {
    return (
      <View style={styles.renderViewStyle}>
        <ImageBackground
          source={Assets.rewardImage}
          style={styles.mainBgIconStyle}>
          <View style={styles.upperViewStyle}>
            <Image source={{uri: item.image}} style={styles.cardIconStyle} />
            <Text
              style={[styles.commonTextStyle, {marginTop: 10}]}
              numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          <View style={styles.bottomViewStyle}>
            <View style={styles.offerCodeViewStyle}>
              <Text style={styles.commonTextStyle}>{item.code}</Text>
            </View>

            <TouchableOpacity
              activeOpacity={1.0}
              style={styles.applyOfferViewStyle}
              onPress={() => applyOfferClick(item, index)}>
              <Image
                source={Assets.applyOfferIcon}
                style={styles.applyOfferIconStyle}
              />
              <Text style={styles.applyOfferTxtStyle}>Apply Offer</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <BaseContainer onPress={onBackPress} isLeftIcon headerText="Offers">
      {isLoading ? (
        <View style={styles.flex}>
          <HRListLoader style={styles.loaderStyle} />
        </View>
      ) : (
        <FlatList
          data={rewardsData}
          renderItem={rewardRender}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }
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
        />
      )}
    </BaseContainer>
  );
};

export default RewardContainer;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  loaderStyle: {
    height: 125,
    width: '85%',
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'center',
    marginHorizontal: 10,
  },

  upperViewStyle: {
    paddingVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },

  cardIconStyle: {
    resizeMode: 'contain',
    width: widthPercentageToDP(15),
    height: widthPercentageToDP(8.5),
  },

  renderViewStyle: {
    marginVertical: 7,
  },

  mainBgIconStyle: {
    width: '100%',
    paddingTop: 5,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.2,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 1,
      },
    }),
  },

  bottomViewStyle: {
    marginTop: 7,
    paddingVertical: 7,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  offerCodeViewStyle: {
    borderWidth: 1,
    borderRadius: 5,
    borderWidth: 0.5,
    paddingVertical: 7,
    borderStyle: 'dashed',
    paddingHorizontal: 10,
    borderColor: HRColors.primary,
  },

  commonTextStyle: {
    color: '#232B66',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },

  applyOfferViewStyle: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  applyOfferIconStyle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  applyOfferTxtStyle: {
    marginHorizontal: 5,
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },
});
