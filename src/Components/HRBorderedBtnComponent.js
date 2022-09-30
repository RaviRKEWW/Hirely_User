import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

const HRBorderBtnComponent = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      style={styles.btnStyle}
      onPress={onPressHandler}>
      <Text style={styles.btnTextStyle}>{props.btnText}</Text>
      {props.isIcon ? (
        <Icon
          size={12}
          name="right"
          type="antdesign"
          color={HRColors.primary}
        />
      ) : null}
    </TouchableOpacity>
  );
};
export default HRBorderBtnComponent;
const styles = StyleSheet.create({
  btnStyle: {
    padding: 5,
    marginTop: 10,
    borderWidth: 0.5,
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FEF0F1',
    borderColor: HRColors.primary,
  },

  btnTextStyle: {
    paddingHorizontal: 7,
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },
});
