import React from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import HRThemeBtn from '../Components/HRThemeBtn';
import {openSettings} from 'react-native-permissions';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Image, Platform, StyleSheet} from 'react-native';

const NoLocationComponent = props => {
  const onAllowPress = () => {
    openSettings();
  };

  return (
    <View style={styles.locationViewStyle}>
      <Image source={Assets.locationBig} style={styles.iconStyle} />
      <Text style={styles.locationHeaderTitleStyle}>
        Allow to use Location?
      </Text>
      <Text style={styles.locationDesTextStyle}>
        App will use your device's location to provide the best service
        providers near you!
      </Text>
      <HRThemeBtn
        btnText={'Allow'}
        onPress={onAllowPress}
        style={styles.btnStyle}
      />
    </View>
  );
};

export default NoLocationComponent;
const styles = StyleSheet.create({
  iconStyle: {
    alignSelf: 'center',
    marginVertical: 15,
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

  btnStyle: {
    marginVertical: 20,
    marginHorizontal: 15,
  },
});
