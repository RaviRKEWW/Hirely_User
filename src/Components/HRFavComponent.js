import React from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import HRThemeBtn from '../Components/HRThemeBtn';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRBannerComponent from '../Components/HRBannerComponent';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
const HRFavComponent = props => {
  const onPressCarousalHandler = () => {
    if (props.onPressCarousal !== undefined) {
      props.onPressCarousal();
    }
  };

  const onHireMePressHandler = () => {
    if (props.hireMePress !== undefined) {
      props.hireMePress();
    }
  };

  const onPressFavHandler = () => {
    if (props.onFavPress !== undefined) {
      props.onFavPress();
    }
  };

  const getSelectedIndex = index => {
    props.selectedIndex(index);
  };

  return (
    <View style={props.style}>
      <View style={styles.flexRowStyle}>
        {props.isFromDetails ? (
          props.item?.service?.service_images.length >= 1 ? (
            <HRBannerComponent
              index={props.bannerIndex}
              autoplay={props.autoPlay}
              pageSize={props.pageSize}
              onPress={onPressCarousalHandler}
              getIndex={index => getSelectedIndex(index)}
              arrayItem={props.item?.service?.service_images}
              bannerImageStyle={[styles.imageStyle, props.imageStyle]}
            />
          ) : (
            <FastImage
              source={
                props.item?.service?.service_images.length > 0
                  ? {
                      priority: 'high',
                      cache: 'immutable',
                      uri: props.item?.service?.service_images[0].image,
                    }
                  : Assets.noDataImage
              }
              style={[styles.imageStyle, props.imageStyle]}
            />
          )
        ) : (
          <FastImage
            source={
              props.item?.service?.service_images.length > 0
                ? {
                    priority: 'high',
                    cache: 'immutable',
                    uri: props.item?.service?.service_images[0].image,
                  }
                : Assets.noDataImage
            }
            style={[styles.imageStyle, props.imageStyle]}
          />
        )}

        {props.showRatingIcons ? (
          <View style={styles.ratingViewStyle}>
            <Icon
              name={'star'}
              color={'#F5D759'}
              type={'ionicons'}
              size={props.starSize}
            />
            <Text style={styles.rateTextStyle}>
              {props.item?.service?.rating}
            </Text>
          </View>
        ) : null}

        <View style={styles.titleContainerStyle}>
          <View
            style={[
              styles.flexRowStyle,
              {
                marginTop: 5,
              },
            ]}>
            <Text
              style={styles.titleStyle}
              numberOfLines={props?.serviceDetails ? undefined : 2}>
              {props.item?.service?.title}
            </Text>
            {props.isFromFav ? (
              <TouchableOpacity
                activeOpacity={1.0}
                disabled={props.disabled}
                onPress={onPressFavHandler}>
                <Image
                  resizeMode={'contain'}
                  source={
                    props.item?.is_wishlist
                      ? Assets.heart_Fill
                      : Assets.heart_unFill
                  }
                  style={styles.favIconStyle}
                />
              </TouchableOpacity>
            ) : null}
          </View>

          <Text
            style={styles.subTitleStyle}
            numberOfLines={props?.serviceDetails ? undefined : 1}>
            {props.item?.service?.provider?.type}
          </Text>
          <Text
            style={styles.providerNameStyle}
            numberOfLines={props?.serviceDetails ? undefined : 1}>
            By: {props.item?.service?.provider?.name}
          </Text>
          {props.item?.service?.provider?.type == 'company' ? (
            <Text
              style={styles.providerNameStyle}
              numberOfLines={props?.serviceDetails ? undefined : 1}>
              UEN ID: {props.item?.service?.provider?.uen_id}
            </Text>
          ) : null}

          <View style={[props.bottomViewStyle]}>
            <Text style={styles.feeTypeTextStyle}>
              Approx price inclusive of booking:{' '}
              <Text style={styles.feeTextStyle}>
                ${props.item?.service?.approx_price}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      {props.isFromFav ? (
        <HRThemeBtn
          style={styles.hireMeBtnStyle}
          onPress={onHireMePressHandler}
          btnText={
            props.item?.service.booking_price > 0
              ? 'Book for $' +
                Number(props.item.service?.booking_price).toFixed(2)
              : 'Pay Full $' + props.item?.service?.fixed_price
          }
        />
      ) : null}
    </View>
  );
};

export default HRFavComponent;
const styles = StyleSheet.create({
  favIconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },

  flexRowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleContainerStyle: {
    flex: 1,
    paddingStart: 10,
  },

  imageStyle: {
    width: 90,
    height: 90,
    borderRadius: 15,
  },

  providerNameStyle: {
    marginTop: 3,
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(14),
  },

  titleStyle: {
    flex: 1,
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(20),
  },

  subTitleStyle: {
    marginTop: 3,
    textTransform: 'capitalize',
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(15),
  },

  ratingViewStyle: {
    top: 15,
    left: 5,
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 5,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: HRColors.white,
  },

  rateTextStyle: {
    color: '#3C4858',
    textAlign: 'center',
    alignItems: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(9),
  },

  feeTypeTextStyle: {
    flex: 1,
    color: '#0B182A',
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(14),
  },

  feeTextStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(15),
  },

  hireMeBtnStyle: {
    marginBottom: 7,
    borderRadius: 15,
    marginVertical: 15,
    marginHorizontal: 20,
  },
});
