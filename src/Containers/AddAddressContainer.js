import React, {useState} from 'react';
import {
  ADD_ADDRESS_API,
  EDIT_ADDRESS_API,
  getProportionalFontSize,
} from '../Utils/HRConstant';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import BaseContainer from '../Components/BaseContainer';
import ValidationHelper from '../Utils/ValidationHelper';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
let addressType = [
  {
    label: 'home',
  },
  {
    label: 'office',
  },
  {
    label: 'other',
  },
];
const AddAddressContainer = props => {
  var validationHelper = new ValidationHelper();
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState(
    props?.route?.params?.addressItem?.city ?? '',
  );
  const [state, setState] = useState(
    props?.route?.params?.addressItem?.state ?? '',
  );
  const [zipCode, setZipCode] = useState(
    props?.route?.params?.addressItem?.zipcode ?? '',
  );
  const [isError, setIsError] = useState(false);
  const [addressLine, setAddressLine] = useState(
    props?.route?.params?.addressItem?.complete_address ?? '',
  );
  const [selectedType, setSelectedType] = useState(
    props?.route?.params?.addressItem?.address_type ?? 'home',
  );
  let userData = useSelector(state => state.userOperation);

  const onChangeAddressLine = text => {
    setIsError(false);
    setAddressLine(text);
  };

  const onChangeZipCode = text => {
    setIsError(false);
    setZipCode(text);
  };

  const onChangeCity = text => {
    setIsError(false);
    setCity(text);
  };

  const onChangeState = text => {
    setIsError(false);
    setState(text);
  };

  const onSubmitAddress = () => {
    setIsError(true);
    if (addressLine == '' || zipCode == '' || city == '' || state == '') {
      return false;
    } else if (
      validationHelper.isEmptyValidation(addressLine).trim() !== '' ||
      validationHelper.isEmptyValidation(zipCode).trim() !== '' ||
      validationHelper.isEmptyValidation(city).trim() !== '' ||
      validationHelper.isEmptyValidation(state).trim() !== ''
    ) {
      return false;
    } else {
      setIsLoading(true);
      let addAddressParam = {
        log: 0,
        lat: 0,
        city: city,
        state: state,
        zipcode: zipCode,
        address_type: selectedType,
        complete_address: addressLine,
        customer_id: userData.userDetail.id,
        address_id: props?.route?.params?.addressItem
          ? props?.route?.params?.addressItem?.id
          : '',
      };
      postApi(
        props?.route?.params?.addressItem ? EDIT_ADDRESS_API : ADD_ADDRESS_API,
        addAddressParam,
        onAddressSuccess,
        onAddressFailure,
        userData,
      );
    }
  };
  const onAddressSuccess = successResponse => {
    if (successResponse.status) {
      setIsLoading(false);
      Toast.show(successResponse.message, Toast.LONG);
      onBackPress();
    } else {
      setIsLoading(false);
      Toast.show(successResponse.message, Toast.LONG);
    }
  };

  const onAddressFailure = error => {
    setIsLoading(false);
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer isLeftIcon onPress={onBackPress} headerText={'Address'}>
      <HRAddressButton onSelect={setSelectedType} selectedType={selectedType} />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}>
        <HRTextInput
          inputContainerStyle={{
            height: 120,
            alignSelf: 'flex-start',
            overflow: 'hidden',
            paddingBottom: 30,
          }}
          numberOfLines={3}
          multiline
          value={addressLine}
          style={styles.desViewStyle}
          textInputStyle={styles.desTextInputStyle}
          txtHeader={'Full Address'}
          placeHolder={'Enter full address'}
          onChangeText={onChangeAddressLine}
          errorText={
            isError
              ? validationHelper
                  .isEmptyValidation(addressLine, 'Please enter address')
                  .trim()
              : ''
          }
        />
        <HRTextInput
          maxLength={6}
          value={zipCode}
          txtHeader={'Postal Code'}
          keyboardType={'number-pad'}
          onChangeText={onChangeZipCode}
          placeHolder={'Enter postal code'}
          errorText={
            isError ? validationHelper.zipCodeValidation(zipCode).trim() : ''
          }
        />
        <HRTextInput
          value={city}
          txtHeader={'City'}
          placeHolder={'Enter city'}
          onChangeText={onChangeCity}
          errorText={
            isError
              ? validationHelper
                  .isEmptyValidation(city, 'Please enter city')
                  .trim()
              : ''
          }
        />
        <HRTextInput
          value={state}
          txtHeader={'State'}
          placeHolder={'Enter state'}
          onChangeText={onChangeState}
          errorText={
            isError
              ? validationHelper
                  .isEmptyValidation(state, 'Please enter state')
                  .trim()
              : ''
          }
        />
        <HRThemeBtn
          isLoading={isLoading}
          onPress={onSubmitAddress}
          style={styles.submitBtnStyle}
        />
      </KeyboardAwareScrollView>
    </BaseContainer>
  );
};
export default AddAddressContainer;
const HRAddressButton = props => {
  const onSelectHandler = label => {
    if (props.onSelect !== undefined) {
      props.onSelect(label);
    }
  };
  return (
    <View style={styles.radioViewStyle}>
      {addressType?.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1.0}
            style={[
              styles.selectedViewStyle,
              {
                backgroundColor:
                  props.selectedType == item.label
                    ? HRColors.primary
                    : HRColors.white,
              },
            ]}
            onPress={() => onSelectHandler(item.label)}>
            <Icon
              size={18}
              name={item.icon}
              type={'antDesign'}
              color={
                props.selectedType == item.label
                  ? HRColors.white
                  : HRColors.black
              }
            />
            <Text
              style={[
                styles.valueTextStyle,
                {
                  color:
                    props.selectedType == item.label
                      ? HRColors.white
                      : HRColors.black,
                  fontFamily:
                    props.selectedType == item.label
                      ? HRFonts.AirBnB_Medium
                      : HRFonts.AirBnb_Light,
                },
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  desViewStyle: {
    marginHorizontal: 20,
  },

  desTextInputStyle: {
    height: 80,
    paddingTop: 20,
    paddingBottom: 0,
  },
  radioViewStyle: {
    marginVertical: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
  },

  selectedViewStyle: {
    marginEnd: 10,
    borderRadius: 30,
    borderWidth: 0.1,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },

  valueTextStyle: {
    paddingHorizontal: 10,
    textTransform: 'capitalize',
    fontSize: getProportionalFontSize(16),
  },

  submitBtnStyle: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
});
