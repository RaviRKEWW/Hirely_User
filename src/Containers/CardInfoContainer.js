import React, {useState, useEffect} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import BaseContainer from '../Components/BaseContainer';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {Text, View, Platform, StyleSheet} from 'react-native';
import HRDropDownPicker from '../Components/HRDropDownPicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
var moment = require('moment');
const CardInfoContainer = props => {
  const [year, setYear] = useState([]);
  const [cardCVV, setCardCVV] = useState();
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState();
  const [openDropDown, setOpenDropDown] = useState(false);
  const [openDropDown2, setOpenDropDown2] = useState(false);
  const [months, setMonths] = useState([
    {
      label: 'January',
      value: 'January',
    },
    {
      label: 'February',
      value: 'February',
    },
    {
      label: 'March',
      value: 'March',
    },
    {
      label: 'April',
      value: 'April',
    },
    {
      label: 'May',
      value: 'May',
    },
    {
      label: 'June',
      value: 'June',
    },
    {
      label: 'July',
      value: 'July',
    },
    {
      label: 'August',
      value: 'August',
    },
    {
      label: 'September',
      value: 'September',
    },
    {
      label: 'October',
      value: 'October',
    },
    {
      label: 'November',
      value: 'November',
    },
    {
      label: 'December',
      value: 'December',
    },
  ]);

  useEffect(() => {
    for (let i = 0; i < 50; i++) {
      year.push({
        label: moment().add(i, 'year').format('YYYY'),
        value: moment().add(i, 'year').format('YYYY'),
      });
    }
  }, []);

  const onBackPress = () => {
    props.navigation.goBack();
  };

  return (
    <BaseContainer isLeftIcon onPress={onBackPress} headerText={'Card Info'}>
      <KeyboardAwareScrollView contentContainerStyle={styles.flex}>
        <HRTextInput
          value={cardName}
          onChangeText={setCardName}
          txtHeader="Cardholder Name"
          style={styles.textInputStyle}
        />
        <HRTextInput
          maxLength={16}
          value={cardNumber}
          txtHeader="Card Number"
          keyboardType={'number-pad'}
          onChangeText={setCardNumber}
          style={styles.textInputStyle}
        />
        <View style={styles.dropDownViewStyle}>
          <View>
            <Text style={styles.dropDownTitleStyle}>EX Month</Text>
            <HRDropDownPicker
              item={months}
              setItems={setMonths}
              headerText={'EX Month'}
              openDropDown={openDropDown}
              placeholder={'Select month'}
              setOpenDropDown={setOpenDropDown}
            />
          </View>
          <View>
            <Text style={styles.dropDownTitleStyle}>EX Year</Text>
            <HRDropDownPicker
              item={year}
              setItems={setYear}
              headerText={'EX Year'}
              placeholder={'Select year'}
              openDropDown={openDropDown2}
              setOpenDropDown={setOpenDropDown2}
            />
          </View>
        </View>
        <HRTextInput
          maxLength={4}
          txtHeader="CVV"
          value={cardCVV}
          onChangeText={setCardCVV}
          keyboardType={'number-pad'}
          style={styles.textInputStyle}
        />
      </KeyboardAwareScrollView>
      <HRThemeBtn btnText={'Make Payment'} style={styles.btnStyle} />
    </BaseContainer>
  );
};
export default CardInfoContainer;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  textInputStyle: {
    flex: 0,
  },

  dropDownViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    zIndex: Platform.OS == 'ios' ? 10 : undefined,
  },

  dropDownTitleStyle: {
    color: '#36455A',
    fontFamily: HRFonts.Work_SansRegular,
    fontSize: getProportionalFontSize(10),
  },

  btnStyle: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
});
