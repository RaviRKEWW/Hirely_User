import React from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';

const HRHeaderComponent = props => {
  const onPressHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };

  const onChatPressHandler = () => {
    if (props.onChatPress !== undefined) {
      props.onChatPress();
    }
  };

  const onFavPressHandler = () => {
    if (props.onFavPress !== undefined) {
      props.onFavPress();
    }
  };

  return (
    <View style={styles.flexRowStyle}>
      {props.isLeftIcon ? (
        <TouchableOpacity
          activeOpacity={1.0}
          onPress={onPressHandler}
          style={styles.backBtnStyle}>
          <Icon
            size={25}
            name="arrowleft"
            color={'#1C2D41'}
            type={'antdesign'}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.extraViewStyle} />
      )}
      {props.isTitleComponent ? (
        props.isTitleComponent
      ) : (
        <Text
          style={[
            styles.headerTitleStyle,
            {
              textTransform: props.headerText == 'FAQs' ? 'none' : 'capitalize',
            },
          ]}>
          {props.headerText ?? ''}
        </Text>
      )}

      {props.isRightIcon ? (
        <View style={styles.flexRowStyle}>
          <TouchableOpacity
            activeOpacity={1.0}
            style={styles.marginEnd}
            onPress={onChatPressHandler}>
            <Icon
              size={25}
              type="ionicon"
              color={HRColors.primary}
              name="chatbubble-ellipses"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1.0}
            style={styles.marginEnd}
            onPress={onFavPressHandler}>
            <Image source={Assets.heart_Fill} style={styles.heartIconStyle} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {props.filterComponent ? (
            props.filterComponent
          ) : (
            <View style={props.isChatIcon ? null : styles.extraViewStyle} />
          )}
        </>
      )}
      {props.isChatIcon && (
        <TouchableOpacity
          style={{
            marginEnd: 20,
            padding: 10,
            borderWidth: 1,
            borderRadius: 25,
            marginVertical: 10,
            borderColor: '#D4D9D9',
          }}
          activeOpacity={1.0}
          onPress={onChatPressHandler}>
          <Icon
            size={25}
            type="ionicon"
            color={HRColors.primary}
            name="chatbubble-ellipses"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HRHeaderComponent;
const styles = StyleSheet.create({
  flexRowStyle: {
    alignItems: 'center',
    flexDirection: 'row',
  },

  marginEnd: {
    marginEnd: 20,
  },

  backBtnStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    marginVertical: 10,
    marginLeft: 20,
    borderColor: '#D4D9D9',
  },

  headerTitleStyle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(20),
  },

  extraViewStyle: {
    width: 25,
    padding: 5,
    marginVertical: 15,
    marginHorizontal: 20,
  },

  heartIconStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
