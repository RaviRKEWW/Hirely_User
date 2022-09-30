import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Text, View, StyleSheet} from 'react-native';
import {getProportionalFontSize} from '../Utils/HRConstant';
const HRSummaryComponent = props => {
  return (
    <View style={styles.mainViewStyle}>
      <Text
        numberOfLines={1}
        style={[
          styles.titleStyle,
          {
            color: props.item.title == 'Total' ? HRColors.black : '#9C9C9C',
            fontFamily:
              props.item.title == 'Total'
                ? HRFonts.AirBnb_Bold
                : HRFonts.AirBnb_Book,
            fontSize:
              props.item.title == 'Total'
                ? getProportionalFontSize(14)
                : getProportionalFontSize(13),
          },
        ]}>
        {props.item.title}
      </Text>
      <Text
        numberOfLines={1}
        style={[
          styles.priceTextStyle,
          {
            fontFamily:
              props.item.title != 'Total'
                ? HRFonts.AirBnB_Bold
                : HRFonts.AirBnB_Medium,
          },
        ]}>
        {props.item.price}
      </Text>
    </View>
  );
};
export default HRSummaryComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    marginTop: 5,
    flexDirection: 'row',
  },

  titleStyle: {
    flex: 1,
  },

  priceTextStyle: {
    fontSize: getProportionalFontSize(14),
  },
});
