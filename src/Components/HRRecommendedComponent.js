import React, {memo, useEffect, useState} from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image as RNImage,
} from 'react-native';
import Assets from '../Assets/index';
import HRThemeBtn from './HRThemeBtn';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRBannerComponent from '../Components/HRBannerComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import Image from 'react-native-image-progress';
const HRRecommendedComponent = props => {
  let userData = useSelector(state => state.userOperation);
  const [favListRedux, setFavListRedux] = useState([]);
  useEffect(() => {
    let favIds = [];
    userData?.favouriteList?.map(item => {
      favIds?.push(item?.service_id);
    });
    setFavListRedux(favIds);
  }, [userData?.favouriteList]);

  const onPressHandler = item => {
    if (props?.onItemPress !== undefined) {
      props?.onItemPress(item);
    }
  };

  const onPressMsgHandler = () => {
    if (props?.onMsgPress !== undefined) {
      props?.onMsgPress();
    }
  };

  const onFavHandler = str => {
    if (props?.onItemFav !== undefined) {
      props?.onItemFav(str);
    }
  };
  const onPressCarousalHandler = () => {
    if (props?.onPressCarousal !== undefined) {
      props?.onPressCarousal();
    }
  };

  return (
    <TouchableOpacity
      key={props?.index}
      activeOpacity={1.0}
      style={styles.itemStyle}
      onPress={() => onPressHandler(props?.item)}>
      {props?.item?.service_images?.length >= 1 ? (
        <HRBannerComponent
          getIndex={index => {}}
          onPress={onPressCarousalHandler}
          autoplay={props?.autoPlay}
          pageSize={widthPercentageToDP(80)}
          bannerImageStyle={styles.imageStyle}
          arrayItem={props?.item?.service_images}
        />
      ) : (
        <>
          {props?.item?.service_images?.length > 0 ? (
            <Image
              indicator={() => (
                <ActivityIndicator size={'small'} color={HRColors.primary} />
              )}
              style={styles.imageStyle}
              source={{
                uri: props?.item?.service_images[0]?.image,
              }}
              onLoadEnd={() => console.log('Image was loaded!')}
            />
          ) : (
            <RNImage source={Assets.noDataImage} style={styles.imageStyle} />
          )}
        </>
      )}

      <View style={styles.ratingViewStyle}>
        <Icon name={'star'} color={'#F5D759'} type={'ionicons'} size={20} />
        <Text style={styles.rateTextStyle}>{props?.item?.rating}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={1.0}
        disabled={props?.disabled}
        style={styles.favViewStyle}
        onPress={() =>
          onFavHandler(
            favListRedux?.includes(props?.item?.id) ? 'remove' : 'add',
          )
        }>
        <Image
          style={styles.favIconStyle}
          source={
            favListRedux?.includes(props.item.id)
              ? Assets.heart_Fill
              : Assets.heart_unFill
          }
        />
      </TouchableOpacity>

      <View style={styles.titleViewStyle}>
        <Text style={styles.titleStyle} numberOfLines={2}>
          {props?.item?.title}
        </Text>
        <Text style={styles.subTitleStyle} numberOfLines={1}>
          {props?.item?.provider?.type}
        </Text>
      </View>

      <Text style={styles.providerNameStyle} numberOfLines={2}>
        By: {props?.item?.provider?.name}
      </Text>
      <View style={styles.bottomViewStyle}>
        <Text style={styles.feeTypeTextStyle}>
          Approx price inclusive of booking:{' '}
          <Text style={styles.priceTextStyle}>
            ${props?.item?.approx_price}
          </Text>
        </Text>
      </View>

      <View style={styles.btnViewStyle}>
        <HRThemeBtn
          style={styles.hireMeBtnStyle}
          onPress={() => onPressHandler(props?.item)}
          btnText={
            props?.item?.booking_price > 0
              ? 'Book for $' + Number(props?.item?.booking_price)?.toFixed(2)
              : 'Pay Full $' + props?.item?.fixed_price
          }
        />
        <TouchableOpacity
          activeOpacity={1.0}
          style={styles.msgBtnStyle}
          onPress={onPressMsgHandler}>
          <Icon
            size={30}
            type="ionicon"
            color={HRColors.white}
            name="chatbubble-ellipses"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default memo(HRRecommendedComponent);
const styles = StyleSheet.create({
  itemStyle: {
    margin: 10,
    marginTop: 5,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: widthPercentageToDP(90),
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 3,
      },
    }),
  },

  imageStyle: {
    overflow: 'hidden',
    borderRadius: 15,
    resizeMode: 'contain',
    width: widthPercentageToDP(80),
    height: widthPercentageToDP(70),
  },

  ratingViewStyle: {
    top: 30,
    left: 30,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: HRColors.white,
  },

  favViewStyle: {
    top: 30,
    right: 30,
    padding: 10,
    borderRadius: 10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HRColors.white,
  },

  bottomViewStyle: {
    marginTop: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
  },

  titleStyle: {
    flex: 1,
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(20),
  },

  subTitleStyle: {
    textAlign: 'right',
    textTransform: 'capitalize',
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.Aileron_Book,
    fontSize: getProportionalFontSize(15),
  },

  providerNameStyle: {
    marginTop: 2,
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(15),
  },

  rateTextStyle: {
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(21),
  },

  favIconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  feeTypeTextStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  priceTextStyle: {
    color: HRColors.primary,
    fontSize: getProportionalFontSize(15),
    fontFamily: HRFonts.Poppins_SemiBold,
  },

  btnViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  hireMeBtnStyle: {
    flex: 1,
    borderRadius: 15,
    marginVertical: 5,
  },

  msgBtnStyle: {
    marginStart: 10,
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: HRColors.primary,
  },
});
