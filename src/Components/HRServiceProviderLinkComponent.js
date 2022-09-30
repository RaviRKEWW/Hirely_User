import React from 'react';
import {
  Text,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import {getProportionalFontSize} from '../Utils/HRConstant';

const HRServiceProviderLinkComponent = props => {
  const onClick = () => {
    if (Platform.OS == 'android') {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.hirelyprovider',
      );
    } else {
      Linking.openURL(
        'https://apps.apple.com/sg/app/hirely-provider/id1594373453',
      );
    }
  };
  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={1.0}
      style={styles.viewStyle}>
      <Text style={styles.textStyle}>
        Want to become Service Provider?
        <Text
          style={[
            {
              color: HRColors.primary,
            },
            styles.textStyle,
          ]}>
          {' '}
          Click Here{' '}
        </Text>
      </Text>
      <Icon
        size={15}
        type={'ionicon'}
        name="open-outline"
        color={HRColors.primary}
      />
    </TouchableOpacity>
  );
};
export default HRServiceProviderLinkComponent;
const styles = StyleSheet.create({
  viewStyle: {
    paddingVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textStyle: {
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(11),
  },
});
