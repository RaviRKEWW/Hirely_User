import React, {useState, useEffect} from 'react';
import HRFonts from '../Utils/HRFonts';
import {StyleSheet} from 'react-native';
import HRColors from '../Utils/HRColors';
import DropDownPicker from 'react-native-dropdown-picker';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const HRDropDownPicker = props => {
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(props.value);
  }, [props.value]);
  return (
    <DropDownPicker
      labelProps={{
        numberOfLines: 1,
      }}
      value={value}
      items={props.item}
      setValue={setValue}
      showTickIcon={false}
      setItems={props.item}
      zIndex={props.zIndex}
      onOpen={props.onOpen}
      schema={props.schema}
      listMode={'SCROLLVIEW'}
      open={props.openDropDown}
      setOpen={props.setOpenDropDown}
      placeholder={props.placeholder}
      style={[styles.style, props.style]}
      zIndexInverse={props.zIndexInverse}
      textStyle={styles.dropDownTextStyle}
      arrowIconStyle={{
        tintColor: value == '' ? HRColors.black : HRColors.primary,
      }}
      dropDownContainerStyle={[
        styles.dropDownContainerStyle,
        props.dropDownContainerStyle,
      ]}
    />
  );
};
export default HRDropDownPicker;
const styles = StyleSheet.create({
  dropDownContainerStyle: {
    borderWidth: 0,
    alignSelf: 'center',
    borderTopWidth: 0.3,
    borderColor: HRColors.grayBorder,
    width: widthPercentageToDP('50') - 35,
  },

  dropDownTextStyle: {
    color: HRColors.textInputHeaderColor,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  style: {
    borderWidth: 0,
    borderRadius: 0,
    alignSelf: 'center',
    paddingHorizontal: 0,
    borderBottomWidth: 0.3,
    borderColor: HRColors.grayBorder,
    width: widthPercentageToDP('50') - 35,
  },
});
