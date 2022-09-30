import React, {Fragment} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Image from 'react-native-image-progress';
var moment = require('moment');
const HRMsgComponent = props => {
  const today = moment().utc().utcOffset(8).format('YYYY-MM-DD');

  return (
    <>
      {!props?.isPaid ? (
        <View
          style={[
            styles.mainViewStyle,
            {
              flexDirection: props?.item?.type === 1 ? 'column' : 'row',
              backgroundColor:
                props?.item?.sender_id == props?.userId
                  ? HRColors.primary
                  : '#EFEFEF',
              alignSelf:
                props?.item?.sender_id == props?.userId
                  ? 'flex-end'
                  : 'flex-start',
              borderBottomLeftRadius:
                props?.item?.sender_id == props?.userId ? 25 : 0,
              borderBottomRightRadius:
                props?.item?.sender_id == props?.userId ? 0 : 25,
              marginEnd: props?.item?.sender_id == props?.userId ? 10 : 90,
              marginStart: props?.item?.sender_id == props?.userId ? 90 : 10,
            },
          ]}>
          {props?.item?.type === 1 && props?.item?.image !== undefined ? (
            <>
              <TouchableWithoutFeedback onPress={props?.onPress}>
                <Image
                  source={{
                    uri: props?.item?.image,
                  }}
                  style={styles.image}
                  indicator={() => (
                    <ActivityIndicator
                      size={'small'}
                      color={
                        props?.item?.sender_id == props?.userId
                          ? HRColors.white
                          : HRColors.primary
                      }
                    />
                  )}
                />
              </TouchableWithoutFeedback>
              {props?.item?.message ? (
                <Text
                  style={[
                    {
                      color:
                        props?.item?.sender_id == props?.userId
                          ? HRColors.white
                          : HRColors.black,
                      paddingStart: 7,
                      paddingTop: 15,
                      fontFamily: HRFonts.book,
                      fontSize: getProportionalFontSize(13),
                    },
                  ]}>
                  {props?.item?.message}
                </Text>
              ) : (
                <></>
              )}
            </>
          ) : (
            <Text
              style={[
                {
                  color:
                    props?.item?.sender_id == props?.userId
                      ? HRColors.white
                      : HRColors.black,
                },
                styles.msgTextStyle,
              ]}>
              {props?.item?.message}
            </Text>
          )}
          <Text
            style={[
              {
                color:
                  props?.item?.sender_id == props?.userId
                    ? HRColors.white
                    : HRColors.black,
              },
              styles.timeTextStyle,
            ]}>
            {moment(props?.item?.created_at).format('YYYY-MM-DD') == today
              ? moment(props?.item?.created_at).format('hh:mm A')
              : moment(props?.item.created_at).format('DD MMM')}
          </Text>
        </View>
      ) : (
        <View style={styles.paidViewStyle}>
          <Text style={styles.dollarTextStyle}>
            $<Text style={styles.amountTextStyle}>{props?.item?.amount}</Text>
          </Text>
          <View style={styles.paidInnerViewStyle}>
            <Icon
              size={16}
              type={'ionicon'}
              color={'#47B92A'}
              name={'checkmark-circle'}
            />
            <Text style={styles.UPaidStyle}>You Paid</Text>
            <TouchableOpacity style={styles.arrowIconStyle} activeOpacity={1.0}>
              <Icon
                size={18}
                color={'#707070'}
                type={'antdesign'}
                name={'arrowright'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
};
export default HRMsgComponent;
const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
    borderRadius: 25,
    overflow: 'hidden',
  },
  mainViewStyle: {
    padding: 5,
    borderRadius: 25,
    marginVertical: 10,
    marginHorizontal: 10,
  },

  msgTextStyle: {
    paddingEnd: 10,
    paddingStart: 7,
    paddingVertical: 15,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  timeTextStyle: {
    padding: 7,
    alignSelf: 'flex-end',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(9),
  },

  paidViewStyle: {
    margin: 10,
    borderRadius: 10,
    borderWidth: 0.5,
    paddingVertical: 15,
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    borderColor: HRColors.grayBorder,
  },

  dollarTextStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  amountTextStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(27),
  },

  paidInnerViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  UPaidStyle: {
    marginStart: 3,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  arrowIconStyle: {
    marginStart: 25,
  },
});
