import React from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import HRThemeBtn from '../Components/HRThemeBtn';
import {getProportionalFontSize} from '../Utils/HRConstant';
const HRFilterComponent = props => {
  const onResetHandler = () => {
    if (props?.onReset !== undefined && props?.onApplyFilter !== undefined) {
      if (
        props?.selectedRatingFilter !== '' ||
        props?.selectedPriceFilter !== '' ||
        props?.selectedType !== '' ||
        props?.selectedProviderTime !== ''
      ) {
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
      if (
        props?.selectedRatingFilter !== '' ||
        props?.selectedPriceFilter !== '' ||
        props?.selectedType !== '' ||
        props?.selectedProviderTime !== ''
      ) {
        props?.onApplyFilter();
      } else {
        //no api call
      }
    }
  };

  return (
    <View style={styles.mainViewStyle}>
      <View style={styles.headerViewStyle}>
        <TouchableOpacity onPress={onResetHandler}>
          <Text
            style={[
              styles.headerTitleStyle,
              {
                color:
                  props?.selectedRatingFilter !== '' ||
                  props?.selectedPriceFilter !== '' ||
                  props?.selectedType !== '' ||
                  props?.selectedProviderTime !== ''
                    ? HRColors.black
                    : '#D3D3D3',
              },
            ]}>
            Reset
          </Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle1style}> Filters</Text>
        <TouchableOpacity onPress={onCancelHandler}>
          <Text style={styles.headerTitleStyle}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.cardStyle}>
          <View style={styles.itemContainerStyle}>
            <Icon
              size={18}
              name={'star'}
              color={'gray'}
              type={'ionicons'}
              style={styles.commonViewStyle}
            />
            <Text style={styles.byTextStyle}>By Ratings</Text>
          </View>
          <View style={styles.radioContainerStyle}>
            {props?.filterRating?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1.0}
                  style={[
                    styles.selectedViewStyle,
                    {
                      backgroundColor:
                        props?.selectedRatingFilter == item?.rating
                          ? HRColors.primary
                          : HRColors.white,
                    },
                  ]}
                  onPress={() => props?.setSelectedRatingFilter(item?.rating)}>
                  <Icon
                    size={18}
                    name={'star'}
                    color={
                      props?.selectedRatingFilter == item?.rating
                        ? HRColors.white
                        : '#FAB620'
                    }
                    type={'ionicons'}
                  />
                  <Text
                    style={[
                      styles.ratingTextStyle,
                      {
                        color:
                          props?.selectedRatingFilter == item?.rating
                            ? HRColors.white
                            : HRColors.black,
                        fontFamily:
                          props?.selectedRatingFilter == item?.rating
                            ? HRFonts.AirBnB_Medium
                            : HRFonts.AirBnb_Light,
                      },
                    ]}>
                    {item?.rating}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardStyle}>
          <View style={styles.itemContainerStyle}>
            <Icon
              size={18}
              color={'gray'}
              name={'dollar'}
              type={'fontisto'}
              style={styles.commonViewStyle}
            />
            <Text style={styles.byTextStyle}>By Price</Text>
          </View>
          <View style={styles.radioContainerStyle}>
            {props?.filterPrice?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1.0}
                  style={[
                    styles.selectedViewStyle,
                    {
                      backgroundColor:
                        props?.selectedPriceFilter == item?.value
                          ? HRColors.primary
                          : HRColors.white,
                    },
                  ]}
                  onPress={() => props?.setSelectedPriceFilter(item?.value)}>
                  <Icon
                    size={18}
                    color={
                      props?.selectedPriceFilter == item?.value
                        ? HRColors.white
                        : HRColors.black
                    }
                    name={item?.icon}
                    type={'antdesign'}
                  />
                  <Text
                    style={[
                      styles.valueTextStyle,
                      {
                        color:
                          props?.selectedPriceFilter == item?.value
                            ? HRColors.white
                            : HRColors.black,
                        fontFamily:
                          props?.selectedPriceFilter == item?.value
                            ? HRFonts.AirBnB_Medium
                            : HRFonts.AirBnb_Light,
                      },
                    ]}>
                    {item?.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.cardStyle}>
          <View style={styles.itemContainerStyle}>
            <Icon
              size={18}
              color={'gray'}
              name={'date'}
              type={'fontisto'}
              style={styles.commonViewStyle}
            />
            <Text style={styles.byTextStyle}>
              By Service Provider Created Date
            </Text>
          </View>
          <View style={styles.radioContainerStyle}>
            {props?.filterProviderTime?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1.0}
                  style={[
                    styles.selectedViewStyle,
                    {
                      backgroundColor:
                        props?.selectedProviderTime == item?.value
                          ? HRColors.primary
                          : HRColors.white,
                    },
                  ]}
                  onPress={() => props?.setSelectedProvider(item?.value)}>
                  <Icon
                    size={18}
                    color={
                      props?.selectedProviderTime == item?.value
                        ? HRColors.white
                        : HRColors.black
                    }
                    name={item?.icon}
                    type={'antdesign'}
                  />
                  <Text
                    style={[
                      styles.valueTextStyle,
                      {
                        color:
                          props?.selectedProviderTime == item?.value
                            ? HRColors.white
                            : HRColors.black,
                        fontFamily:
                          props?.selectedProviderTime == item?.value
                            ? HRFonts.AirBnB_Medium
                            : HRFonts.AirBnb_Light,
                      },
                    ]}>
                    {item?.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.cardStyle}>
          <View style={styles.itemContainerStyle}>
            <Icon
              size={18}
              color={'gray'}
              name={'human'}
              type={'material-community'}
              style={styles.commonViewStyle}
            />
            <Text style={styles.byTextStyle}>By Service Provider Type</Text>
          </View>
          <View style={styles.radioContainerStyle}>
            {props?.filterType?.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={1.0}
                  style={[
                    styles.selectedViewStyle,
                    {
                      backgroundColor:
                        props?.selectedType == item?.value
                          ? HRColors.primary
                          : HRColors.white,
                    },
                  ]}
                  onPress={() => props?.setSelectedType(item?.value)}>
                  <Text
                    style={[
                      styles.valueTextStyle,
                      {
                        color:
                          props?.selectedType == item?.value
                            ? HRColors.white
                            : HRColors.black,
                        fontFamily:
                          props?.selectedType == item?.value
                            ? HRFonts.AirBnB_Medium
                            : HRFonts.AirBnb_Light,
                      },
                    ]}>
                    {item?.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <HRThemeBtn
        btnText={'Apply'}
        style={[
          styles.applyBtnStyle,
          {
            backgroundColor:
              props?.selectedRatingFilter !== '' ||
              props?.selectedPriceFilter !== '' ||
              props?.selectedProviderTime !== '' ||
              props?.selectedType !== ''
                ? HRColors.primary
                : HRColors.primaryLight,
          },
        ]}
        onPress={onApplyFilterHandler}
      />
    </View>
  );
};

export default HRFilterComponent;
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
    paddingHorizontal: 10,
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
