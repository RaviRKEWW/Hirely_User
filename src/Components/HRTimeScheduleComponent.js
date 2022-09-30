import React from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
var moment = require('moment');
const HRDateNTimeScheduleComponent = props => {
  return (
    <TouchableOpacity
      key={props.index}
      activeOpacity={1.0}
      onPress={() => props.onSelect(props.index)}
      style={[
        {
          borderWidth:
            props.selectedSchedule !== '' &&
            props.selectedSchedule == props.index
              ? 0.9
              : 0,
          backgroundColor:
            props.selectedSchedule !== '' &&
            props.selectedSchedule == props.index
              ? '#FDD6D3'
              : 'transparent',
        },
        styles.mainViewStyle,
      ]}>
      <Text
        style={[
          styles.dateTextStyle,
          {
            color:
              props.selectedSchedule !== '' &&
              props.selectedSchedule == props.index
                ? '#1C2D41'
                : HRColors.textTitleColor,
          },
        ]}>
        {props.isMonthDate
          ? moment(props.item.date).format('D')
          : props.item.start}
      </Text>
      {props.isMonthDate ? (
        <Text
          style={[
            styles.timeTextStyle,
            {
              color:
                props.selectedSchedule !== '' &&
                props.selectedSchedule == props.index
                  ? '#1C2D41'
                  : HRColors.textTitleColor,
            },
          ]}>
          {props.item.day.substring(0, 3)}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};
export default HRDateNTimeScheduleComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    padding: 10,
    marginStart: 2,
    borderRadius: 7,
    marginRight: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    borderColor: HRColors.primary,
  },

  dateTextStyle: {
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(14),
  },

  timeTextStyle: {
    paddingHorizontal: 5,
    textTransform: 'uppercase',
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(14),
  },
});
