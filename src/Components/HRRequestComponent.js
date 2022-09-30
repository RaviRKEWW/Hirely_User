import React from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
var moment = require('moment');
const HRRequestComponent = props => {
  const onPressHandler = () => {
    if (props.onPressOnItem !== undefined) {
      props.onPressOnItem();
    }
  };

  const onPressCancelHandler = () => {
    if (props.onPressCancel !== undefined) {
      props.onPressCancel();
    }
  };

  const onPressPayHandler = () => {
    if (props.onPressPay !== undefined) {
      props.onPressPay();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.mainItemStyle}>
      <View style={styles.flexRowStyle}>
        <Image source={Assets.payDeposit} style={styles.iconStyle} />
        <View style={styles.titleViewStyle}>
          <View style={styles.flexRowStyle}>
            {/* <Text numberOfLines={1} style={styles.titleStyle}>
              {props.item.type == 'Request'
                ? 'Payment Requested'
                : props.item.type == 'Withdrawn'
                ? 'Withdrawn'
                : props.item.type == 'Deposit'
                ? 'Deposit'
                : 'Payment Done'}
            </Text> */}
            <Text numberOfLines={1} style={styles.titleStyle}>
              {props.item.description}
            </Text>
            <Text numberOfLines={1} style={styles.amountTxtStyle}>
              {props.item.type} ${props.item.amount}
            </Text>
          </View>
          <View
            style={[
              styles.dateViewStyle,
              {
                flexDirection:
                  props.item.type == 'Request' ? 'row-reverse' : 'row',
              },
            ]}>
            <Text numberOfLines={1} style={styles.dateTextStyle}>
              {moment(props.item.updated_date).format('MMMM DD, YYYY - HH:MM')}
            </Text>
            <Text
              numberOfLines={1}
              style={[
                styles.itemTypeStyle,
                {
                  color: props.item.type == '-' ? '#FC3638' : '#46B92A',
                },
              ]}>
              {props.item.type == '-' ? 'Deduct' : 'Added'}
            </Text>
          </View>
        </View>
      </View>
      {props.item.type == 'Request' ? (
        <View style={styles.reqBtnViewStyle}>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={onPressCancelHandler}
            style={[
              styles.requestBtnStyle,
              {backgroundColor: '#FEF0F1', marginEnd: 10},
            ]}>
            <Text
              numberOfLines={1}
              style={[styles.denyPayTextStyle, {color: HRColors.primary}]}>
              Deny Request
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1.0}
            onPress={onPressPayHandler}
            style={[
              styles.requestBtnStyle,
              {backgroundColor: '#DCF2D7', marginHorizontal: 5},
            ]}>
            <Text
              numberOfLines={1}
              style={[
                styles.denyPayTextStyle,
                {
                  color: '#46B92A',
                },
              ]}>
              Pay {props.item.amount}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default HRRequestComponent;
const styles = StyleSheet.create({
  mainItemStyle: {
    padding: 15,
    borderRadius: 15,
    marginVertical: 5,
    marginHorizontal: 20,
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

  flexRowStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  iconStyle: {
    resizeMode: 'contain',
  },

  titleViewStyle: {
    flex: 1,
    paddingStart: 10,
  },

  titleStyle: {
    flex: 1,
    color: HRColors.black,
    textTransform: 'capitalize',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  amountTxtStyle: {
    color: HRColors.black,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  dateViewStyle: {
    marginVertical: 7,
    justifyContent: 'space-between',
  },

  dateTextStyle: {
    color: '#718096',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  itemTypeStyle: {
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  reqBtnViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
  },

  requestBtnStyle: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  denyPayTextStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },
});
