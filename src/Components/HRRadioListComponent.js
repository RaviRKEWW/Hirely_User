import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
const HRRadioListComponent = props => {
  const onPressHandler = (item, index) => {
    if (props.onPress !== undefined) {
      props.onPress(item, index);
    }
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {props.arrayItem.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1.0}
            onPress={() => onPressHandler(item, index)}
            style={{
              borderBottomWidth: props.selectedIndex == index ? 2 : 0.5,
              borderColor:
                props.selectedIndex == index ? HRColors.primary : '#D3d3d3',
            }}>
            <Text
              style={[
                styles.textStyle,
                {
                  color:
                    props.selectedIndex == index
                      ? HRColors.primary
                      : HRColors.grayBorder,
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
export default HRRadioListComponent;
const styles = StyleSheet.create({
  textStyle: {
    marginBottom: 10,
    marginHorizontal: 20,
    textTransform: 'capitalize',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },
});
