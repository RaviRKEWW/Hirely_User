import React from 'react';
import HRFonts from '../Utils/HRFonts';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, Image, StyleSheet, TouchableOpacity} from 'react-native';

const HRNotificationComponent = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={[
        styles.notificationItemStyle,
        {
          backgroundColor:
            props.item.read_status == 'unseen' ? '#D3D3D3' : '#FFF',
        },
      ]}>
      <Image
        source={{uri: props.item.image}}
        style={styles.notificationIconStyle}
      />
      <Text style={styles.notificationTitleStyle}>{props.item.body}</Text>
    </TouchableOpacity>
  );
};

export default HRNotificationComponent;
const styles = StyleSheet.create({
  notificationItemStyle: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
  },

  notificationIconStyle: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },

  notificationTitleStyle: {
    marginHorizontal: 15,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },
});
