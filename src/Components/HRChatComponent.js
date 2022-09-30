import React from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import FastImage from 'react-native-fast-image';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
var moment = require('moment');
const HRChatComponent = props => {
  const today = moment().utc().utcOffset(8).format('YYYY-MM-DD');

  const onPressHandler = () => {
    if (props?.onPress !== undefined) {
      props?.onPress();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.mainViewStyle}>
      <FastImage
        style={styles.imageStyle}
        source={
          props?.item?.image == null
            ? Assets.noImage
            : {
                uri: props?.item?.image,
              }
        }
      />
      <View style={styles.titleMgsViewStyle}>
        <Text style={styles.titleStyle} numberOfLines={1}>
          {props?.item?.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            styles.messageTextStyle,
            {
              fontFamily:
                props?.item?.unread_messages >= 1
                  ? HRFonts.AirBnB_Medium
                  : HRFonts.AirBnb_Book,
              color:
                props?.item?.unread_messages >= 1
                  ? HRColors.primary
                  : 'rgb(127,142,162)',
            },
          ]}>
          {props?.item?.last_message}
        </Text>
      </View>
      <Text style={styles.timeTextStyle}>
        {moment(props?.item?.last_message_date_time).format('YYYY-MM-DD') ==
        today
          ? moment(props?.item?.last_message_date_time).format('hh:mm A')
          : moment(props?.item?.last_message_date_time).format('DD MMM')}
      </Text>
    </TouchableOpacity>
  );
};
export default HRChatComponent;
const styles = StyleSheet.create({
  titleMgsViewStyle: {
    flex: 1,
    padding: 10,
  },

  mainViewStyle: {
    paddingVertical: 15,
    marginHorizontal: 20,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
    borderColor: HRColors.textTitleColor,
  },

  imageStyle: {
    borderRadius: 15,
    resizeMode: 'contain',
    width: widthPercentageToDP(18),
    height: widthPercentageToDP(18),
  },

  titleStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  timeTextStyle: {
    marginVertical: 10,
    color: HRColors.grayBorder,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(14),
  },

  messageTextStyle: {
    marginTop: 5,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(15),
  },
});
