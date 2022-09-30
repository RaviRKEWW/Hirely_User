import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  BackHandler,
  TouchableOpacity,
} from 'react-native';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import HRThemeBtn from '../Components/HRThemeBtn';
import BaseContainer from '../Components/BaseContainer';
import {getProportionalFontSize} from '../Utils/HRConstant';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const introData = [
  {
    btnText: 'Next',
    description:
      'Choose from our endless list of categories. Book any service at your convenience. Sit back and relax.',
    image: require('../Assets/IntroSlider1.png'),
    title: 'All the services you need!',
  },
  {
    btnText: 'Next',
    description:
      'Select a service that fits your budget, and pick a date and time slot according to your convenience.',
    image: require('../Assets/IntroSlider2.png'),
    title: 'Easy Service Booking',
  },
  {
    btnText: 'Next',
    description: 'Payment made quick, easy, and safe through Hirelypay.',
    image: require('../Assets/IntroSlider3.png'),
    title: 'Hirelypay',
  },
  {
    btnText: 'Get Started',
    description:
      'Earn points by paying through our app to get discount vouchers for our services.',
    image: require('../Assets/IntroSlider4.png'),
    title: 'Point mall',
  },
];
const IntroSliderContainer = props => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef(null);
  const clickOnNext = () => {
    if (introData.length - 1 > selectedIndex) {
      scrollRef.current.scrollToIndex({
        animated: true,
        index: selectedIndex + 1,
      });
      setSelectedIndex(selectedIndex + 1);
    } else {
      saveDataInAsync(
        'isIntroViewed',
        true,
        () => {},
        () => {},
      );
      props.navigation.reset({
        index: 0,
        routes: [{name: 'login'}],
      });
    }
  };

  const skipIntro = () => {
    saveDataInAsync(
      'isIntroViewed',
      true,
      () => {},
      () => {},
    );
    props.navigation.reset({
      index: 0,
      routes: [{name: 'login'}],
    });
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };
  const introImageRender = ({item, index}) => {
    return (
      <View key={index}>
        <Image
          source={item.image}
          resizeMode={'center'}
          style={styles.introImgStyle}
        />
      </View>
    );
  };

  return (
    <BaseContainer styles={{backgroundColor: HRColors.grayBg}}>
      <View style={styles.skipViewStyle}>
        {selectedIndex == 3 ? null : (
          <TouchableOpacity onPress={skipIntro} activeOpacity={1.0}>
            <Text style={styles.skipTxtStyle}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        ref={scrollRef}
        data={introData}
        scrollEnabled={false}
        renderItem={introImageRender}
        keyExtractor={(item, index) => index}
      />
      <View style={styles.bottomSheetStyle}>
        <View style={styles.innerViewStyle}>
          <View style={styles.bottomInnerViewStyle}>
            <Text style={styles.titleStyle}>
              {introData[selectedIndex]?.title}
            </Text>
            <Text style={styles.descriptionTextStyle}>
              {introData[selectedIndex]?.description}
            </Text>
          </View>
          <HRThemeBtn
            onPress={clickOnNext}
            btnText={introData[selectedIndex]?.btnText}
          />
        </View>
      </View>
    </BaseContainer>
  );
};
export default IntroSliderContainer;
const styles = StyleSheet.create({
  skipViewStyle: {
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },

  skipTxtStyle: {
    color: HRColors.primary,
    textDecorationLine: 'underline',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(16),
  },

  introImgStyle: {
    flex: 1,
    width: widthPercentageToDP(100),
    height: widthPercentageToDP(100),
  },

  bottomSheetStyle: {
    flex: 1,
    bottom: 0,
    elevation: 1,
    shadowRadius: 5,
    shadowOpacity: 0.2,
    position: 'absolute',
    backgroundColor: null,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    shadowColor: HRColors.black,
    width: widthPercentageToDP('100%'),
    shadowOffset: {width: 0, height: -2},
  },

  innerViewStyle: {
    marginTop: 2,
    paddingBottom: 25,
    paddingHorizontal: 25,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: HRColors.white,
  },

  bottomInnerViewStyle: {
    paddingVertical: 10,
    alignItems: 'center',
  },

  titleStyle: {
    color: '#36455A',
    paddingVertical: 7,
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(21),
  },

  descriptionTextStyle: {
    color: '#CBCFD4',
    paddingVertical: 10,
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(17),
  },
});
