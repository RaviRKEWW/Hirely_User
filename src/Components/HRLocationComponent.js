import React from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import HRThemeBtn from '../Components/HRThemeBtn';
import {openSettings} from 'react-native-permissions';
import {Text, View, Image, StyleSheet, Platform} from 'react-native';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const HRLocationComponent = props => {
  const onAllowPress = () => {
    openSettings();
  };

  const onDenyHandler = () => {
    if (props.onDenyPress !== undefined) {
      props.onDenyPress();
    }
  };

  return (
    <View
      style={
        props.isBottom
          ? styles.locationBottomViewStyle
          : styles.locationViewStyle
      }>
      <Image source={Assets.locationBig} style={styles.iconStyle} />
      <Text style={styles.locationHeaderTitleStyle}>
        Allow to use Location?
      </Text>
      <Text style={styles.locationDesTextStyle}>
        App will use your device's location to provide the best service
        providers near you!
      </Text>
      <HRThemeBtn btnText={'Allow'} onPress={onAllowPress} />
      {props.isBottom ? (
        <HRThemeBtn
          btnText={'Deny'}
          onPress={onDenyHandler}
          style={styles.denyBtnStyle}
          btnTextStyle={styles.denyTextStyle}
        />
      ) : null}
    </View>
  );
};

export default HRLocationComponent;
const styles = StyleSheet.create({
  iconStyle: {
    marginVertical: 15,
    alignSelf: 'center',
  },

  locationViewStyle: {
    padding: 10,
    marginTop: 35,
    borderRadius: 10,
    marginHorizontal: 20,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        marginRight: 15,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 2,
      },
    }),
  },

  locationHeaderTitleStyle: {
    marginTop: 10,
    color: '#36455A',
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(21),
  },

  locationDesTextStyle: {
    marginTop: 10,
    marginBottom: 20,
    color: '#CBCFD4',
    textAlign: 'center',
    paddingHorizontal: 7,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(16),
  },

  locationBottomViewStyle: {
    flex: 1,
    bottom: 0,
    elevation: 5,
    paddingTop: 10,
    shadowRadius: 5,
    paddingBottom: 25,
    shadowOpacity: 0.2,
    position: 'absolute',
    paddingHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    shadowColor: HRColors.black,
    backgroundColor: HRColors.white,
    width: widthPercentageToDP('100%'),
    shadowOffset: {width: 0, height: -2},
  },

  denyBtnStyle: {
    borderWidth: 1,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  denyTextStyle: {
    color: HRColors.primary,
  },
});
