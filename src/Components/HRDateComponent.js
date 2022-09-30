import React from 'react';
import {
  Text,
  View,
  Platform,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import HRThemeBtn from '../Components/HRThemeBtn';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRDateNTimeScheduleComponent from './HRTimeScheduleComponent';
const HRDateComponent = props => {
  const onResetHandler = () => {
    if (props?.onReset !== undefined && props?.onApplyFilter !== undefined) {
      if (props?.selectedDate !== '' || props?.selectedTime !== '') {
        props?.onReset();
      } else {
        //no api call
      }
    }
  };

  const onCancelHandler = () => {
    if (props?.onCancel !== undefined) {
      props?.onCancel();
    }
  };

  const onApplyFilterHandler = () => {
    if (props?.onApplyFilter !== undefined) {
      if (props?.selectedDate !== '' || props?.selectedTime !== '') {
        props?.onApplyFilter();
      } else {
        //no api call
      }
    }
  };
  const renderDateItem = ({item, index}) => {
    return (
      <HRDateNTimeScheduleComponent
        item={item}
        isMonthDate
        index={index}
        selectedSchedule={props?.selectedDate}
        onSelect={() => props?.onSelectDateHandler(item, index)}
      />
    );
  };
  const renderTimeItem = ({item, index}) => {
    return (
      <HRDateNTimeScheduleComponent
        item={item}
        index={index}
        selectedSchedule={props?.selectedTime}
        onSelect={() => props?.onSelectTimeHandler(item, index)}
      />
    );
  };
  console.log('props.selectedDate:', props?.selectedDate);
  return (
    <View style={styles.mainViewStyle}>
      <View style={styles.headerViewStyle}>
        <TouchableOpacity onPress={onResetHandler}>
          <Text
            style={[
              styles.headerTitleStyle,
              {
                color:
                  props?.selectedProviderTime !== '' ||
                  props?.selectedDate !== ''
                    ? HRColors.black
                    : '#D3D3D3',
              },
            ]}>
            Reset
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle1style}>Filters</Text>
        <TouchableOpacity onPress={onCancelHandler}>
          <Text style={styles.headerTitleStyle}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.cardStyle}>
          <View style={styles.itemContainerStyle}>
            <Icon
              size={18}
              name={'clock'}
              color={'gray'}
              type={'fontisto'}
              style={styles.commonViewStyle}
            />
            <Text style={styles.byTextStyle}>By Date & Time</Text>
          </View>
          <View style={styles.radioContainerStyle}>
            {props?.filterDateData?.length > 0 ? (
              <View style={styles.weekDayViewStyle}>
                <FlatList
                  horizontal
                  data={props?.filterDateData}
                  renderItem={renderDateItem}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            ) : null}
          </View>
          {props?.selectedDate !== '' ? (
            <>
              <Text style={[styles.byTextStyle, {marginTop: 10}]}>From</Text>
              <View style={styles.radioContainerStyle}>
                <View style={styles.weekDayViewStyle}>
                  <FlatList
                    horizontal
                    data={props?.filterTimeData}
                    renderItem={renderTimeItem}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
      <HRThemeBtn
        btnText={'Apply'}
        style={[
          styles.applyBtnStyle,
          {
            backgroundColor:
              props?.selectedProviderTime !== '' ||
              props?.selectedDate !== '' ||
              props?.selectedTime !== ''
                ? HRColors.primary
                : HRColors.primaryLight,
          },
        ]}
        onPress={onApplyFilterHandler}
      />
    </View>
  );
};

export default HRDateComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    elevation: 5,
    paddingTop: 20,
    shadowRadius: 5,
    paddingBottom: 10,
    shadowOpacity: 0.2,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#FFFFFF',
  },

  headerViewStyle: {
    marginBottom: 10,
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 10,
    justifyContent: 'space-between',
  },

  headerTitleStyle: {
    color: HRColors.black,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(16),
  },

  headerTitle1style: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(18),
  },

  cardStyle: {
    paddingVertical: 10,
    marginVertical: 7,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: HRColors.white,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 5,
      },
    }),
  },

  byTextStyle: {
    marginStart: 5,
    fontFamily: HRFonts.Poppins_Medium,
    fontSize: getProportionalFontSize(14),
  },

  itemContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  radioContainerStyle: {
    marginTop: 5,
    flexDirection: 'row',
  },

  weekDayViewStyle: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: '#8B9897',
  },

  applyBtnStyle: {
    marginTop: 15,
    marginVertical: 0,
    paddingVertical: 15,
    marginHorizontal: 10,
  },

  selectedViewStyle: {
    marginEnd: 10,
    borderWidth: 0.1,
    borderRadius: 30,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },

  commonViewStyle: {
    width: 20,
    height: 20,
  },

  valueTextStyle: {
    paddingStart: 5,
    textTransform: 'capitalize',
    fontSize: getProportionalFontSize(16),
  },

  ratingTextStyle: {
    marginStart: 5,
    fontSize: getProportionalFontSize(16),
  },
});
