import React, {useState} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const HRGenderComponent = props => {
  const [selectedGender, setSelectedGender] = useState(props.gender);

  const onPressHandler = (index, item) => {
    setSelectedGender(item.label);
    props.genderValue(item.label);
  };

  return (
    <>
      <Text style={styles.genderLabelStyle}>Gender</Text>
      <View style={styles.listItemStyle}>
        {props.arrayItem.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.1}
              activeOpacity={1.0}
              style={[
                styles.flex,
                {
                  borderBottomWidth: selectedGender == item.label ? 2 : 0.5,
                  borderColor:
                    selectedGender == item.label ? HRColors.primary : '#D3d3d3',
                },
              ]}
              onPress={() => onPressHandler(index, item)}>
              <Text
                style={[
                  styles.selectedLabelStyle,
                  {
                    color:
                      selectedGender == item.label
                        ? HRColors.primary
                        : HRColors.grayBorder,
                  },
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
};
export default HRGenderComponent;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  listItemStyle: {
    marginVertical: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  genderLabelStyle: {
    marginTop: 15,
    color: '#36455A',
    marginHorizontal: 20,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(12),
  },

  selectedLabelStyle: {
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'capitalize',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },
});
