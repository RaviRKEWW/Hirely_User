import React, {useState, useEffect} from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRTextInput from '../Components/HRTextInput';
import ValidationHelper from '../Utils/ValidationHelper';
import HRFavComponent from '../Components/HRFavComponent';
import {getProportionalFontSize} from '../Utils/HRConstant';
import HRStarRatingComponent from './HRStarRatingComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';

const HRRatingReviewComponent = props => {
  var validationHelper = new ValidationHelper();
  const [starRating, setStarRating] = useState(1);

  const onSubmitHandler = () => {
    if (props.onSubmitReview !== undefined) {
      props.onSubmitReview();
    }
  };

  const setRatingStar = data => {
    setStarRating(data);
    props.getStarCount(data);
  };
  useEffect(() => {
    return () => {};
  }, [props.isRatingLoading]);

  return (
    <ScrollView
      style={styles.flex}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flex}>
      <KeyboardAwareScrollView
        // contentContainerStyle={styles.mainViewStyle}
        contentContainerStyle={{
          justifyContent: 'flex-end',
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        {/* <View style ={{justifyContent:'flex-end'}}/>  */}
        <View
          style={{
            elevation: 5,
            shadowRadius: 5,
            paddingBottom: 10,
            shadowOpacity: 0.2,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            shadowColor: HRColors.black,
            backgroundColor: HRColors.white,
            shadowOffset: {width: 0, height: -2},
          }}>
          <Image source={Assets.ratingBigStar} style={styles.ratingIconStyle} />
          <Text style={styles.headerTitleStyle}>
            Share your experience with
          </Text>
          <HRFavComponent
            starSize={12}
            showRatingIcons
            item={props.ratingOrderData}
            style={styles.favComponentStyle}
            bottomViewStyle={{display: 'none'}}
            imageStyle={styles.favContainerImgStyle}
          />
          <View style={styles.starRatingViewStyle}>
            <Text style={styles.headerSubTitleStyle}>Rate your Experience</Text>
            <HRStarRatingComponent
              starSize={50}
              animation={'tada'}
              starCount={starRating}
              emptyStarColor={'#F5D759'}
              selectingStar={setRatingStar}
              buttonStyle={styles.starBtnStyle}
              containerStyle={styles.starContainerStyle}
            />
          </View>
          <HRTextInput
            multiline
            numberOfLines={3}
            txtHeader={'Give Feedback'}
            value={props.ratingFeedBack}
            onChangeText={props.onChangeText}
            textInputStyle={styles.feedBackInputStyle}
            errorText={
              props.isError
                ? validationHelper
                    .isEmptyValidation(
                      props.ratingFeedBack,
                      'Please add feedback',
                    )
                    .trim()
                : ''
            }
          />

          <HRThemeBtn
            onPress={onSubmitHandler}
            style={styles.submitBtnStyle}
            isLoading={props.isRatingLoading}
          />

          <HRThemeBtn
            btnText="Cancel"
            style={styles.cancelBtnStyle}
            btnTextStyle={styles.cancelBtnTextStyle}
            onPress={() => props.setIsReviewRateOpen(false)}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};
export default HRRatingReviewComponent;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  // mainViewStyle: {
  //   bottom: 0,
  //   elevation: 5,
  //   shadowRadius: 5,
  //   paddingBottom: 10,
  //   shadowOpacity: 0.2,
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,
  //   justifyContent: 'flex-end',
  //   shadowColor: HRColors.black,
  //   backgroundColor: HRColors.white,
  //   width: widthPercentageToDP('100%'),
  //   shadowOffset: {width: 0, height: -2},

  // },

  ratingIconStyle: {
    marginVertical: 20,
    alignSelf: 'center',
  },

  favComponentStyle: {
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 2,
      },
    }),
  },

  favContainerImgStyle: {
    width: widthPercentageToDP(23.5),
    height: widthPercentageToDP(23.5),
  },

  headerTitleStyle: {
    color: '#36455A',
    textAlign: 'center',
    fontFamily: HRFonts.AirBnB_Medium,
    fontSize: getProportionalFontSize(21),
  },

  headerSubTitleStyle: {
    color: '#9C9C9C',
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  starBtnStyle: {
    marginTop: 15,
  },

  starContainerStyle: {
    marginHorizontal: 20,
  },

  starRatingViewStyle: {
    marginTop: 15,
    paddingHorizontal: 20,
  },

  feedBackInputStyle: {
    // paddingBottom: 20,
  },

  submitBtnStyle: {
    marginTop: 25,
    marginHorizontal: 20,
  },

  cancelBtnStyle: {
    marginBottom: 20,
    borderWidth: 0.5,
    marginHorizontal: 20,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  cancelBtnTextStyle: {
    color: HRColors.primary,
  },
});
