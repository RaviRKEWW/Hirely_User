import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Platform, StyleSheet, TouchableOpacity} from 'react-native';
const HROrderChipComponent = props => {
  const onOrderPressHandler = () => {
    if (props.onOrderItemPress !== undefined) {
      props.onOrderItemPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onOrderPressHandler}
      style={[styles.mainItemStyle, props.styles]}>
      <View style={styles.titleViewStyle}>
        <Text style={styles.titleStyle} numberOfLines={1}>
          {props.title}
        </Text>
        <View style={styles.flexRow}>
          <Text style={styles.dateTextStyle} numberOfLines={1}>
            {props.subTitle}
          </Text>
          {props.payType ? (
            <Text style={styles.payTypeTextStyle} numberOfLines={1}>
              {props.payType}
            </Text>
          ) : null}
        </View>

        {props.description || props.total ? (
          <View style={styles.flexRow}>
            <Text style={styles.descriptionTextStyle} numberOfLines={1}>
              {props.item.description}
            </Text>
          </View>
        ) : null}
      </View>
      {props.status ? (
        <View
          style={[
            styles.statusChipStyle,
            {
              backgroundColor:
                props.status == 'in-progress'
                  ? '#1A8AD4'
                  : props.status == 'completed'
                  ? '#16BE84'
                  : props.status == 'requested'
                  ? HRColors.primary
                  : props.status == 'confirm'
                  ? '#FFBB34'
                  : '#D5311E',
            },
          ]}>
          <Text style={styles.statusTextStyle}>{props.status}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

export default HROrderChipComponent;
const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },

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

  dateTextStyle: {
    flex: 1,
    paddingTop: 3,
    color: '#919295',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  descriptionTextStyle: {
    color: '#919295',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  payTypeTextStyle: {
    marginTop: 5,
    color: '#919295',
    fontFamily: HRFonts.AirBnB_Book,
    fontSize: getProportionalFontSize(13),
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
