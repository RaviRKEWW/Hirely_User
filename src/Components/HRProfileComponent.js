import React from 'react';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon, Badge} from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';

const HRProfileComponent = props => {
  let userData = useSelector(state => state.userOperation);

  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      key={props.index}
      activeOpacity={1.0}
      onPress={onPressHandler}
      style={styles.mainViewStyle}>
      <View style={styles.iconViewStyle2}>
        <View
          style={[
            styles.iconViewStyle,
            {
              backgroundColor: props.item.bgColor,
            },
          ]}>
          <Icon
            size={18}
            name={props.item.iconName}
            type={props.item.iconType}
            color={props.item.iconColor}
          />
          {props.index == 3 && userData.notificationCount > 0 ? (
            <Badge
              badgeStyle={styles.badgeStyle}
              containerStyle={styles.badgeContainerStyle}
            />
          ) : null}
        </View>
        <Text style={styles.titleStyle}>{props.item.title}</Text>
      </View>
      {props.isProfile ? (
        <>
          {props.index == 3 ? (
            <ToggleSwitch
              size="small"
              onColor="#E8FBF5"
              offColor="#EFEFEF"
              isOn={props.notificationToggle}
              circleColor={props.notificationToggle ? '#1DD1A1' : '#B9B9B9'}
              onToggle={() =>
                props.setNotificationToggle(!props.notificationToggle)
              }
            />
          ) : props.index == 4 ? (
            <Text style={styles.pointTextStyle}>
              Earned: {userData?.point} Points
            </Text>
          ) : (
            <Icon size={15} name="right" type="antdesign" />
          )}
        </>
      ) : (
        <Icon size={15} name="right" type="antdesign" />
      )}
    </TouchableOpacity>
  );
};
export default HRProfileComponent;
const styles = StyleSheet.create({
  mainViewStyle: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iconViewStyle2: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconViewStyle: {
    padding: 7,
    borderRadius: 10,
  },

  titleStyle: {
    marginHorizontal: 10,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  pointTextStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  badgeStyle: {
    backgroundColor: '#FF3C2F',
  },

  badgeContainerStyle: {
    top: 7,
    right: 7,
    position: 'absolute',
  },
});
