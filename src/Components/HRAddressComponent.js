import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import HRStarRatingComponent from './HRStarRatingComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Platform, StyleSheet, TouchableOpacity} from 'react-native';
const HRAddressComponent = props => {
  const onPressHandler = () => {
    if (props.onAddressChangePress !== undefined) {
      props.onAddressChangePress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.mainViewStyle}>
      <View style={styles.headerViewStyle}>
        <Text style={styles.titleStyle}>{props.title}</Text>
        {props.subTitle ? (
          <Text style={styles.subTitleTextStyle}>{props.subTitle}</Text>
        ) : null}
        {props.isStar ? (
          <HRStarRatingComponent
            disabled
            starSize={15}
            emptyStarColor={'#F5D759'}
            starCount={props.starCount}
          />
        ) : null}
      </View>
      {props.addressOrReviewTitle ? (
        <Text style={styles.subTitleStyle}>{props.addressOrReviewTitle}</Text>
      ) : null}
      {props.addressType ? (
        <View style={styles.addressTypeViewStyle}>
          <Text style={styles.addressTypeTextStyle}>{props.addressType}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
export default HRAddressComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
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

  headerViewStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  titleStyle: {
    color: '#2B305E',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  subTitleTextStyle: {
    color: HRColors.grayBorder,
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(12),
  },

  subTitleStyle: {
    color: '#9C9C9C',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  addressTypeViewStyle: {
    right: 0,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 8,
    backgroundColor: HRColors.primary,
  },

  addressTypeTextStyle: {
    paddingVertical: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: HRColors.white,
    textTransform: 'capitalize',
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(14),
  },
});
