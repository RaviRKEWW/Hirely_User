import React from 'react';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
const NoDataComponent = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };
  return (
    <View style={[styles.mainViewStyle, props.style]}>
      <TouchableOpacity onPress={onPressHandler} activeOpacity={1.0}>
        {props.isFromTimeSlot ? null : (
          <Image
            style={styles.noImgStyle}
            source={props.noDataImage ?? Assets.noDataListIcon}
          />
        )}
        {props.text?.match('internet') ? (
          <Text style={styles.tapTextStyle}>Tap to refresh</Text>
        ) : null}
        <Text style={[styles.textStyle, props.textStyle]}>
          {props.text ?? 'No data to show!'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoDataComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPercentageToDP(65),
  },

  textStyle: {
    marginTop: 5,
    alignSelf: 'center',
    color: HRColors.grayBorder,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  noImgStyle: {
    resizeMode: 'contain',
    width: widthPercentageToDP(40),
    height: widthPercentageToDP(40),
  },

  tapTextStyle: {
    marginTop: 10,
    alignSelf: 'center',
    color: HRColors.grayBorder,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },
});
