import React, {useRef, useEffect, useState} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import BaseContainer from '../Components/BaseContainer';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {GOOGLE_MAP_KEY, getProportionalFontSize} from '../Utils/HRConstant';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import KeyboardManager from 'react-native-keyboard-manager';

const AutoCompletePlaceContainer = props => {
  const ref = useRef();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    ref.current?.setAddressText(props?.route?.params?.foundPlaceValue ?? '');
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    if (Platform.OS == 'ios') {
      KeyboardManager.setEnable(false);
    }
  }, []);
  const _keyboardDidShow = e => {
    setKeyboardHeight(e.endCoordinates.height);
  };

  const _keyboardDidHide = e => {
    setKeyboardHeight(0);
  };
  const onClearText = () => {
    ref.current?.setAddressText('');
  };

  const onPlaceSelect = (data, details) => {
    props.route.params.onGoBack(details);
    onBackPress();
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      styles={styles.baseContainerStyle}>
      <View style={styles.mainViewStyle}>
        <GooglePlacesAutocomplete
          textInputProps={{
            clearButtonMode: 'never',
          }}
          ref={ref}
          keepResultsAfterBlur
          debounce={200}
          fetchDetails={true}
          returnKeyType="search"
          listViewDisplayed="auto"
          autoFillOnNotFound={true}
          enablePoweredByContainer={true}
          enableHighAccuracyLocation={true}
          placeholderTextColor={HRColors.black}
          placeholder={'Search Location'}
          onPress={(data, details) => {
            onPlaceSelect(data, details);
          }}
          query={{
            key: GOOGLE_MAP_KEY,
          }}
          renderRightButton={() => (
            <TouchableOpacity
              onPress={onClearText}
              style={styles.cancelBtnStyle}>
              <Icon
                size={25}
                name="cancel"
                color={'#1C2D41'}
                type={'materialicons'}
              />
            </TouchableOpacity>
          )}
          keyboardShouldPersistTaps="handled"
          renderRow={rowData => {
            return (
              <View>
                <Text style={styles.titleStyle}>
                  {rowData.structured_formatting.main_text}
                </Text>
                <Text style={styles.addressStyle}>
                  {rowData.structured_formatting.secondary_text}
                </Text>
              </View>
            );
          }}
          styles={{
            row: styles.rowStyle,
            listView: styles.listStyle,
            separator: {display: 'none'},
            container: styles.containStyle,
            textInput: styles.textInputStyle,
            textInputContainer: styles.textInputContainerStyle,
          }}
        />
      </View>
    </BaseContainer>
  );
};

export default AutoCompletePlaceContainer;
const styles = StyleSheet.create({
  baseContainerStyle: {
    backgroundColor: HRColors.grayBg,
  },

  mainViewStyle: {
    flex: 1,
    marginHorizontal: 20,
  },

  cancelBtnStyle: {
    marginEnd: 5,
  },

  titleStyle: {
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(14),
  },

  addressStyle: {
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(12),
  },

  containStyle: {
    flex: 1,
  },

  textInputContainerStyle: {
    height: 50,
    borderRadius: 5,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: HRColors.white,
  },

  textInputStyle: {
    height: 45,
    marginTop: 5,
    color: HRColors.black,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(14),
  },

  rowStyle: {
    borderRadius: 5,
    marginVertical: 3,
  },

  listStyle: {
    marginTop: 10,
    ...Platform.select({
      ios: {
        height: '45%',
        position: 'absolute',
        flexGrow: 1,
        elevation: 9999,
        top: 50,
      },
    }),
  },
});
