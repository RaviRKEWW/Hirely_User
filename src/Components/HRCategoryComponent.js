import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Image from 'react-native-image-progress';
const HRCategoryComponent = props => {
  const selectCategoryHandler = () => {
    if (props.selectCategory !== undefined) {
      props.selectCategory(props.index);
    }
  };
  return (
    <TouchableOpacity
      key={props?.index}
      activeOpacity={1.0}
      onPress={selectCategoryHandler}
      style={[styles.categoryViewStyle, props?.style]}>
      <Image
        indicator={() => (
          <ActivityIndicator size={'small'} color={HRColors.primary} />
        )}
        source={{uri: props?.item?.image}}
        style={[
          styles.catImgStyle,
          {
            backgroundColor:
              props?.selectedCategoryIndex == props?.index
                ? HRColors.primary
                : HRColors.white,
            borderWidth: props?.selectedCategoryIndex == props?.index ? 0 : 0.5,
          },
        ]}
      />
      <Text
        numberOfLines={2}
        textBreakStrategy={'highQuality'}
        style={[
          styles.catTitleStyle,
          {
            color:
              props.selectedCategoryIndex == props.index
                ? HRColors.primary
                : HRColors.textTitleColor,
            fontFamily:
              props.selectedCategoryIndex == props.index
                ? HRFonts.AirBnB_Medium
                : HRFonts.AirBnb_Book,
          },
        ]}>
        {props.item.name}
      </Text>
    </TouchableOpacity>
  );
};
export default HRCategoryComponent;
const styles = StyleSheet.create({
  categoryViewStyle: {
    marginTop: 10,
    alignItems: 'center',
    width: '33%',
  },

  catImgStyle: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderColor: HRColors.textTitleColor,
    overflow: 'hidden',
  },

  catTitleStyle: {
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 7,
    fontSize: getProportionalFontSize(14),
  },
});
