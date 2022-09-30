import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';

const HRThemeBtn = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      disabled={props.disabled}
      style={[styles.btnTouchStyle, props.style]}>
      {props.isLoading ? (
        <ActivityIndicator
          size={'small'}
          animating={true}
          color={HRColors.white}
          hidesWhenStopped={false}
        />
      ) : (
        <Text style={[styles.btnTextStyle, props.btnTextStyle]}>
          {props.btnText ?? 'Submit'}
        </Text>
      )}
    </TouchableOpacity>
  );
};
export default HRThemeBtn;
const styles = StyleSheet.create({
  btnTextStyle: {
    color: HRColors.white,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  btnTouchStyle: {
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: HRColors.primary,
  },
});
