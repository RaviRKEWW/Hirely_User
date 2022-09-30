import React from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import { useSelector } from 'react-redux';
import HRColors from '../Utils/HRColors';
import { Icon, Badge } from 'react-native-elements';
import { getProportionalFontSize } from '../Utils/HRConstant';
const HRHomeSearchComponent = props => {
  let userData = useSelector(state => state.userOperation);

  const onClickOnFavIcon = () => {
    if (props.onFavListPress !== undefined) {
      props.onFavListPress();
    }
  };
  const clickOnHelp = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('help');
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => props.navigation.navigate('login') },
      ]);
    }
  };

  const clickOnChatIcon = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('chatList');
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => props.navigation.navigate('login') },
      ]);
    }
  };
  const clickOnNotificationIcon = () => {
    if (userData.userDetail.id) {
      props.navigation.navigate('notifications');
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => props.navigation.navigate('login') },
      ]);
    }
  };

  const onFocusHandler = () => {
    if (props.onFocusAutoComplete !== undefined) {
      props.onFocusAutoComplete();
    }
  };

  const onFocusSearchHandler = () => {
    if (props.onFocusSearch !== undefined) {
      props.onFocusSearch();
    }
  };

  return (
    <View style={styles.upperViewStyle}>
      <View style={styles.searchPlaceViewStyle}>
        <View style={styles.searchPlaceTxtInViewStyle}>
          <Icon
            size={20}
            type="evilIcons"
            name="location-pin"
            color={HRColors.white}
            style={styles.locationIconStyle}
          />
          <TextInput
            numberOfLines={1}
            onFocus={onFocusHandler}
            value={props.foundPlaceValue}
            placeholderTextColor={HRColors.white}
            style={styles.searchPlaceTxtInputStyle}
            placeholder={'Finding your location...'}
          />
        </View>

        <TouchableOpacity
          activeOpacity={1.0}
          onPress={clickOnChatIcon}
          style={styles.msgNotificationIconStyle}>
          <Icon
            size={25}
            type="ionicon"
            color={HRColors.white}
            name="chatbubble-ellipses"
          />
          {userData.messageCount > 0 ? (
            <Badge
              badgeStyle={styles.badgeStyle}
              containerStyle={styles.badgeContainerStyle}
            />
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={clickOnNotificationIcon}
          style={styles.msgNotificationIconStyle}>
          <Icon
            size={25}
            type={'ionicon'}
            name={'notifications'}
            color={HRColors.white}
          />
          {userData.notificationCount > 0 ? (
            <Badge
              badgeStyle={styles.badgeStyle}
              containerStyle={styles.badgeContainerStyle}
            />
          ) : null}
        </TouchableOpacity>
      </View>
      <Text style={styles.happyTextStyle} numberOfLines={1}>
        Hi {userData?.userDetail?.id ? userData.userDetail.name : 'Guest'} !
      </Text>
      <View style={styles.TextAboveSearchComponent}>
        <Text style={styles.assistTextStyle}>Happy To Assist You!</Text>
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={clickOnHelp}
          style={styles.helpIconStyle}>
          <Icon
            size={23}
            name={'help'}
            type={'antdesign'}
            color={HRColors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.searchComponentStyle}>
        <View style={styles.mainViewStyle}>
          <Icon
            size={20}
            name="search1"
            type="antdesign"
            color={HRColors.white}
            style={styles.searchIconStyle}
          />

          <TextInput
            placeholder={'Search...'}
            onFocus={onFocusSearchHandler}
            style={styles.searchTxtInStyle}
            placeholderTextColor={HRColors.white}
            onChangeText={() => props.onChangeText}
          />
        </View>

        <TouchableOpacity
          activeOpacity={1.0}
          onPress={onClickOnFavIcon}
          style={styles.favFilterIconStyle}>
          <Icon
            size={22}
            name={'heart'}
            type={'antdesign'}
            color={HRColors.white}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HRHomeSearchComponent;
const styles = StyleSheet.create({
  upperViewStyle: {
    padding: 20,
    paddingTop: 10,
    justifyContent: 'center',
  },

  msgNotificationIconStyle: {
    marginTop: 15,
    marginStart: 10,
  },

  locationIconStyle: {
    paddingBottom: 5,
  },

  searchPlaceViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchPlaceTxtInViewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderBottomWidth: 0.5,
    borderBottomColor: HRColors.white,
  },

  searchPlaceTxtInputStyle: {
    flex: 1,
    height: 40,
    paddingTop: 10,
    paddingBottom: 0,
    color: HRColors.white,
    backgroundColor: 'transparent',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(14),
  },

  happyTextStyle: {
    marginTop: 10,
    color: HRColors.white,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(16),
  },

  assistTextStyle: {
    marginTop: 5,
    color: HRColors.white,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(24),
  },

  searchComponentStyle: {
    marginTop: 10,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  TextAboveSearchComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  mainViewStyle: {
    flex: 1,
    marginRight: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: HRColors.white,
  },

  searchTxtInStyle: {
    flex: 1,
    height: 45,
    paddingLeft: 10,
    color: HRColors.white,
  },

  favFilterIconStyle: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderColor: HRColors.white,
  },

  helpIconStyle: {
    height: 45,
    borderWidth: 0.5,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    justifyContent: 'center',
    borderColor: HRColors.white,
  },

  badgeContainerStyle: {
    top: 0,
    right: 3,
    position: 'absolute',
  },

  searchIconStyle: {
    padding: 7,
  },

  badgeStyle: {
    backgroundColor: HRColors.notificationBadgeColor,
  },
});
