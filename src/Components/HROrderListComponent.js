import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Platform, StyleSheet, TouchableOpacity} from 'react-native';
var moment = require('moment');
const HROrderListComponent = props => {
  const onPressHandler = () => {
    props.navigation.navigate('orderDetail', {
      goBack: true,
      orderId: props.item.id,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.mainItemStyle}>
      <View style={styles.titleViewStyle}>
        <Text style={styles.titleStyle} numberOfLines={1}>
          {props.item.service?.title}
        </Text>
        <View style={styles.flexRow}>
          <Text style={styles.dateTextStyle} numberOfLines={1}>
            {moment(props.item.date).format('MMM DD, YYYY')}
          </Text>
          <Text style={styles.amountTextStyle}>
            ${Number(props.item.total).toFixed(2)}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.statusChipStyle,
          {
            backgroundColor:
              props.item.status == 'in-progress'
                ? '#1A8AD4'
                : props.item.status == 'completed'
                ? '#16BE84'
                : props.item.status == 'requested'
                ? HRColors.primary
                : props.item.status == 'confirm'
                ? '#FFBB34'
                : '#D5311E',
          },
        ]}>
        <Text style={styles.statusTextStyle}>{props.item.status}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default HROrderListComponent;
const styles = StyleSheet.create({
  mainItemStyle: {
    borderRadius: 15,
    marginVertical: 5,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 1,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 1,
      },
    }),
  },

  titleViewStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },

  titleStyle: {
    color: '#2B305E',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  flexRow: {
    flexDirection: 'row',
  },

  dateTextStyle: {
    paddingTop: 3,
    marginEnd: 10,
    color: '#919295',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  amountTextStyle: {
    color: '#FAB620',
    marginHorizontal: 5,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  statusChipStyle: {
    right: 0,
    paddingHorizontal: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  statusTextStyle: {
    paddingVertical: 3,
    paddingHorizontal: 3,
    color: HRColors.white,
    textTransform: 'capitalize',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(10),
  },
});
