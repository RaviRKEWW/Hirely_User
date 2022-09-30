import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
var moment = require('moment');
const HRVoucherComponent = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.voucherItemStyle}>
      {props.item?.image ? (
        <Image
          style={styles.imgStyle}
          source={{
            uri: props.item.image,
          }}
        />
      ) : null}

      <View style={styles.flex}>
        <View
          style={[
            styles.titleViewStyle,
            {
              marginTop: props.isVouchers ? 3 : 0,
              flexDirection: props.isVouchers ? 'row' : 'column',
            },
          ]}>
          <Text style={styles.titleStyle}>{props.item?.title?.trim()}</Text>
          <Text
            numberOfLines={1}
            style={[
              styles.pointsTextStyle,
              {
                fontSize: props.isVouchers
                  ? getProportionalFontSize(13)
                  : getProportionalFontSize(14),
                marginTop: props.isVouchers ? 0 : 5,
              },
            ]}>
            {props.item.point} Points
          </Text>
        </View>

        {props.isVouchers ? (
          <View style={styles.ifVoucherViewStyle}>
            <View style={styles.flex}>
              <Text style={styles.expiredStyle}>
                Expires On :{' '}
                <Text style={styles.dateTextStyle} numberOfLines={1}>
                  {moment(props.item.end_date).format('MMM DD,YYYY')}
                </Text>
              </Text>
            </View>
            <View
              style={[
                styles.statusChipStyle,
                {
                  backgroundColor:
                    props.item.status == 'available'
                      ? '#16BE84'
                      : props.item.status == 'expired'
                      ? '#E5AE41'
                      : '#1A8AD4',
                },
              ]}>
              <Text style={styles.statusTextStyle} numberOfLines={1}>
                {props.item.status}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};
export default HRVoucherComponent;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  imgStyle: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
    resizeMode: 'contain',
  },

  voucherItemStyle: {
    borderRadius: 15,
    marginVertical: 7,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 10,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 5,
      },
    }),
  },

  titleViewStyle: {
    paddingLeft: 5,
    justifyContent: 'space-between',
  },

  titleStyle: {
    flex: 1,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  pointsTextStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  ifVoucherViewStyle: {
    marginTop: 5,
    paddingLeft: 5,
    flexDirection: 'row',
  },

  dateTextStyle: {
    flex: 1,
    color: '#9C9C9C',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(12),
  },

  statusChipStyle: {
    right: -10,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    backgroundColor: HRColors.primary,
  },

  statusTextStyle: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    color: HRColors.white,
    textTransform: 'uppercase',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(10),
  },

  expiredStyle: {
    color: '#9C9C9C',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },
});
