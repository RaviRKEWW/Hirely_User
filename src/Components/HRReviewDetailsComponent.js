import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Text, View, StyleSheet} from 'react-native';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRStarRatingComponent from './HRStarRatingComponent';
const HRReviewDetailsComponent = props => {
  return (
    <View style={[styles.mainViewStyle, props.viewStyle]} key={props.index}>
      <View style={styles.flexRowStyle}>
        <Text
          style={styles.titleStyle}
          numberOfLines={props?.detailService ? 1 : undefined}>
          {props.item.user.name}
        </Text>
        <HRStarRatingComponent
          disabled
          starSize={13}
          buttonStyle={styles.starBtnStyle}
          emptyStarColor={HRColors.grayBorder}
          starCount={Number(props.item.rating)}
          containerStyle={styles.starContainerStyle}
        />
      </View>
      <Text style={styles.descriptionStyle}>{props.item.feedback}</Text>
    </View>
  );
};
export default HRReviewDetailsComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    marginVertical: 5,
  },

  flexRowStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  titleStyle: {
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(13),
    maxWidth: '70%',
  },

  starBtnStyle: {
    marginHorizontal: 2,
  },

  starContainerStyle: {
    marginHorizontal: 10,
  },

  descriptionStyle: {
    marginTop: 5,
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(13),
  },
});
