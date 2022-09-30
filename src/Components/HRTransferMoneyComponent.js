import React, {useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Assets from '../Assets/index';
import HRThemeBtn from './HRThemeBtn';
import HRFonts from '../Utils/HRFonts';
import HRTextInput from './HRTextInput';
import HRColors from '../Utils/HRColors';
import ValidationHelper from '../Utils/ValidationHelper';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const HRTransferMoneyComponent = props => {
  var validationHelper = new ValidationHelper();
  const onSearchHandler = () => {
    if (props.onSearchPress !== undefined) {
      props.onSearchPress();
    }
  };

  const onPayHandler = () => {
    if (props.onPayPress !== undefined) {
      props.onPayPress();
    }
  };

  const onCancelSearchHandler = () => {
    if (props.onSearchCancel !== undefined) {
      props.onSearchCancel();
    }
  };

  const onCancelPayHandler = () => {
    if (props.onPayCancel !== undefined) {
      props.onPayCancel();
    }
  };
  useEffect(() => {
    return () => {};
  }, [props.isLoading]);

  return (
    <>
      {Platform.OS === 'ios' && (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          keyboardShouldPersistTaps={'always'}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View>
            <View style={styles.bottomViewStyle}>
              <Image
                source={Assets.transferBig}
                style={styles.transferIconStyle}
              />
              <Text style={styles.headerTitleStyle}>
                {!props.openPayAmountView ? 'Transfer Money' : 'Enter Amount'}
              </Text>
              {props.openPayAmountView ? (
                <View style={{alignSelf: 'center', alignItems: 'center'}}>
                  <Text style={styles.payingTextStyle}>
                    Paying to{' '}
                    <Text style={styles.userTransferNameStyle}>
                      {props.userTransferName}
                    </Text>
                  </Text>
                  <View style={styles.dollarAmountViewStyle}>
                    <Text style={styles.dollarStyle}>$</Text>
                    <TextInput
                      maxLength={4}
                      placeholder={'0.00'}
                      keyboardType={'number-pad'}
                      value={props.amountToTrans}
                      style={styles.amountTextInputStyle}
                      onChangeText={props.setAmountToTrans}
                      placeholderTextColor={HRColors.textInputHeaderColor}
                    />
                  </View>
                  {props.isNullAmount ? (
                    <Text style={styles.errorTextStyle}>
                      {props.isNullAmount}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              {!props.openPayAmountView ? (
                <HRTextInput
                  maxLength={10}
                  keyboardType={'numeric'}
                  txtHeader={'Transfer To'}
                  value={props.mobileNoToTrans}
                  onChangeText={props.setMobileNoToTrans}
                  errorText={
                    props.isError
                      ? validationHelper
                          .mobileValidation(props.mobileNoToTrans)
                          .trim()
                      : ''
                  }
                />
              ) : (
                <HRTextInput
                  maxLength={100}
                  multiline
                  numberOfLines={3}
                  txtHeader={'Description'}
                  value={props.description}
                  onChangeText={props.setDescription}
                  errorText={
                    props.isError
                      ? validationHelper
                          .descriptionValidation(props.description)
                          .trim()
                      : ''
                  }
                />
              )}

              {props.openPayAmountView ? (
                <HRThemeBtn
                  btnText={'Pay Now'}
                  onPress={onPayHandler}
                  disabled={props.disabled}
                  isLoading={props.isLoading}
                  style={styles.paySearchBtnStyle}
                />
              ) : (
                <HRThemeBtn
                  btnText={'Search'}
                  onPress={onSearchHandler}
                  isLoading={props.isLoading}
                  style={styles.paySearchBtnStyle}
                />
              )}

              {props.openPayAmountView ? (
                //cancel payment
                <HRThemeBtn
                  btnText="Cancel"
                  onPress={onCancelPayHandler}
                  style={styles.cancelBtnStyle}
                  btnTextStyle={styles.cancelBtnTextStyle}
                />
              ) : (
                //cancel search
                <HRThemeBtn
                  btnText="Cancel"
                  style={styles.cancelBtnStyle}
                  onPress={onCancelSearchHandler}
                  btnTextStyle={styles.cancelBtnTextStyle}
                />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      )}
      {Platform.OS === 'android' && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flex: 1,
            justifyContent: 'flex-end',
          }}>
          <View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.bottomViewStyle}>
                <Image
                  source={Assets.transferBig}
                  style={styles.transferIconStyle}
                />
                <Text style={styles.headerTitleStyle}>
                  {!props.openPayAmountView ? 'Transfer Money' : 'Enter Amount'}
                </Text>
                {props.openPayAmountView ? (
                  <View style={{alignSelf: 'center', alignItems: 'center'}}>
                    <Text style={styles.payingTextStyle}>
                      Paying to{' '}
                      <Text style={styles.userTransferNameStyle}>
                        {props.userTransferName}
                      </Text>
                    </Text>
                    <View style={styles.dollarAmountViewStyle}>
                      <Text style={styles.dollarStyle}>$</Text>
                      <TextInput
                        maxLength={4}
                        placeholder={'0.00'}
                        keyboardType={'number-pad'}
                        value={props.amountToTrans}
                        style={styles.amountTextInputStyle}
                        onChangeText={props.setAmountToTrans}
                        placeholderTextColor={HRColors.textInputHeaderColor}
                      />
                    </View>
                    {props.isNullAmount ? (
                      <Text style={styles.errorTextStyle}>
                        {props.isNullAmount}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                {!props.openPayAmountView ? (
                  <HRTextInput
                    maxLength={10}
                    keyboardType={'numeric'}
                    txtHeader={'Transfer To'}
                    value={props.mobileNoToTrans}
                    onChangeText={props.setMobileNoToTrans}
                    errorText={
                      props.isError
                        ? validationHelper
                            .mobileValidation(props.mobileNoToTrans)
                            .trim()
                        : ''
                    }
                  />
                ) : (
                  <HRTextInput
                    multiline
                    numberOfLines={3}
                    txtHeader={'Description'}
                    value={props.description}
                    onChangeText={props.setDescription}
                    errorText={
                      props.isError
                        ? validationHelper
                            .descriptionValidation(props.description)
                            .trim()
                        : ''
                    }
                  />
                )}

                {props.openPayAmountView ? (
                  <HRThemeBtn
                    btnText={'Pay Now'}
                    onPress={onPayHandler}
                    disabled={props.disabled}
                    isLoading={props.isLoading}
                    style={styles.paySearchBtnStyle}
                  />
                ) : (
                  <HRThemeBtn
                    btnText={'Search'}
                    onPress={onSearchHandler}
                    isLoading={props.isLoading}
                    style={styles.paySearchBtnStyle}
                  />
                )}

                {props.openPayAmountView ? (
                  //cancel payment
                  <HRThemeBtn
                    btnText="Cancel"
                    onPress={onCancelPayHandler}
                    style={styles.cancelBtnStyle}
                    btnTextStyle={styles.cancelBtnTextStyle}
                  />
                ) : (
                  //cancel search
                  <HRThemeBtn
                    btnText="Cancel"
                    style={styles.cancelBtnStyle}
                    onPress={onCancelSearchHandler}
                    btnTextStyle={styles.cancelBtnTextStyle}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </>
  );
};

export default HRTransferMoneyComponent;
const styles = StyleSheet.create({
  transferIconStyle: {
    marginVertical: 10,
    alignSelf: 'center',
  },

  bottomViewStyle: {
    // bottom: 0,
    // flex:1,
    // alignSelf:'flex-end',
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    paddingVertical: 10,
    // position: 'absolute',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    shadowColor: HRColors.black,
    backgroundColor: HRColors.white,
    width: widthPercentageToDP('100%'),

    shadowOffset: {width: 0, height: -2},
  },

  headerTitleStyle: {
    color: '#36455A',
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(21),
  },

  payingTextStyle: {
    paddingTop: 15,
    color: '#9C9C9C',
    textAlign: 'center',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(17),
  },

  userTransferNameStyle: {
    fontFamily: HRFonts.AirBnb_Book,
    color: HRColors.textInputHeaderColor,
    fontSize: getProportionalFontSize(17),
  },

  dollarAmountViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: widthPercentageToDP(35),
  },

  dollarStyle: {
    marginStart: 5,
    color: HRColors.textInputHeaderColor,
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(40),
  },

  amountTextInputStyle: {
    marginLeft: 10,
    width: widthPercentageToDP(35),
    fontFamily: HRFonts.AirBnB_Medium,
    color: HRColors.textInputHeaderColor,
    fontSize: getProportionalFontSize(45),
  },

  cancelBtnStyle: {
    borderWidth: 0.5,
    marginHorizontal: 20,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  cancelBtnTextStyle: {
    color: HRColors.primary,
  },

  errorTextStyle: {
    color: 'red',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(12),
  },

  paySearchBtnStyle: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
