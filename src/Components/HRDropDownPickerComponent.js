import React, {useState, useEffect} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Text, StyleSheet} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const HRDropDownPickerComponent = props => {
  const [value, setValue] = useState(props.value);

  const onChangeHandler = newValue => {
    if (props.onChangeDropDownValue !== undefined) {
      props.onChangeDropDownValue(newValue);
    }
  };

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  return (
    <>
      <Text style={styles.dropDownTitleStyle}>{props.headerText}</Text>
      <DropDownPicker
        labelProps={{
          numberOfLines: 1,
        }}
        zIndex={3000}
        value={value}
        key={props.item}
        items={props.item}
        showTickIcon={false}
        showArrowIcon={true}
        zIndexInverse={1000}
        open={props.openDropDown}
        setItems={props.setItems}
        setValue={props.setValue}
        setOpen={props.setOpenDropDown}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        schema={props.schema ?? undefined}
        style={[styles.style, props.style]}
        onChangeValue={newValue => onChangeHandler(newValue)}
        dropDownContainerStyle={[
          styles.dropDownContainerStyle,
          props.dropDownContainerStyle,
        ]}
        textStyle={[styles.dropDownTextStyle, props.dropDownTextStyle]}
        arrowIconStyle={{
          tintColor: props.value == '' ? HRColors.black : HRColors.primary,
        }}
      />
    </>
  );
};
export default HRDropDownPickerComponent;
const styles = StyleSheet.create({
  dropDownContainerStyle: {
    borderWidth: 0,
    alignSelf: 'center',
    borderTopWidth: 0.5,
    borderColor: HRColors.grayBorder,
    width: widthPercentageToDP('100') - 35,
  },

  dropDownTextStyle: {
    marginHorizontal: 0,
    textTransform: 'capitalize',
    color: HRColors.textInputHeaderColor,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  style: {
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomWidth: 0.5,
    height: widthPercentageToDP(10),
    borderBottomColor: HRColors.grayBorder,
    width: widthPercentageToDP('100') - 40,
  },

  dropDownTitleStyle: {
    color: '#36455A',
    paddingHorizontal: 20,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(12),
  },
});
