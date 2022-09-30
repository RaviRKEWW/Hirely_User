import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {TextField} from 'rn-material-ui-textfield';
import {Text, View, StyleSheet} from 'react-native';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const HRTextInput = props => {
  return (
    <View style={[styles.mainViewStyle, props.style]}>
      <TextField
        value={props.value}
        activeLineWidth={0.5}
        returnKeyType={'done'}
        label={props?.txtHeader}
        contentInset={{label: 12}}
        tintColor={HRColors.primary}
        onChangeText={props.onChangeText}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline ?? false}
        labelTextStyle={styles.labelTextStyle}
        maxLength={props.maxLength ?? undefined}
        inputContainerStyle={[
          styles.containerStyle,
          props?.inputContainerStyle,
        ]}
        keyboardType={props.keyboardType ?? 'default'}
        renderLeftAccessory={props.renderLeftAccessory}
        style={[styles.textInputStyle, props.textInputStyle]}
      />
      {props.errorText ? (
        <Text style={styles.errorTextStyle}>{props.errorText}</Text>
      ) : null}
    </View>
  );
};
export default HRTextInput;
const styles = StyleSheet.create({
  mainViewStyle: {
    overflow: 'hidden',
    marginHorizontal: 20,
    maxHeight: widthPercentageToDP(30),
  },

  containerStyle: {
    backgroundColor: HRColors.white,
    maxHeight: widthPercentageToDP(30),
    borderBottomWidth: 0.2,
    borderBottomColor: HRColors.textInputHeaderColor,
  },

  textInputStyle: {
    maxHeight: widthPercentageToDP(25),
    color: HRColors.textInputHeaderColor,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  labelTextStyle: {
    color: '#36455A',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(12),
  },

  errorTextStyle: {
    color: 'red',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },
});
