import React, {useState} from 'react';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import FastImage from 'react-native-fast-image';
import HRHomeLoaders from '../Components/HRHomeLoaders';
import {getProportionalFontSize} from '../Utils/HRConstant';
import NoDataComponent from '../Components/NoDataComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';

const HRCategoryLisComponent = props => {
  const [selectedCategory, setSelectedCategory] = useState(0);

  const onPressHandler = (item, index) => {
    setSelectedCategory(index);
    if (props.onCategoryPress !== undefined) {
      props.onCategoryPress(item);
    }
  };

  const viewAllPress = () => {
    if (props.onViewAllCat !== undefined) {
      props.onViewAllCat();
    }
  };
  const renderCategoryData = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.categoryViewStyle}
        onPress={() => onPressHandler(item, index)}>
        <FastImage
          resizeMode={FastImage.resizeMode.contain}
          source={{uri: item?.image, priority: 'high'}}
          style={[
            styles.catImgStyle,
            {
              borderWidth: selectedCategory == index ? 0 : 0.5,
              backgroundColor:
                selectedCategory == index ? HRColors.primary : HRColors.white,
            },
          ]}
        />
        <Text
          numberOfLines={2}
          style={[
            styles.catTitleStyle,
            {
              color:
                selectedCategory == index
                  ? HRColors.primary
                  : HRColors.textTitleColor,
              fontFamily:
                selectedCategory == index
                  ? HRFonts.AirBnB_Medium
                  : HRFonts.AirBnb_Book,
            },
          ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      {props.isLoading ? (
        <HRHomeLoaders isCategory />
      ) : (
        <>
          <View style={styles.categoryRecommendedHeaderStyle}>
            <Text style={styles.catRecTitleStyle}>{'Select Category'}</Text>
            {props.categoryData.length === 5 ? (
              <TouchableOpacity onPress={viewAllPress} activeOpacity={1.0}>
                <Text style={styles.recSubTitleStyle}>View All</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {props.categoryData.length > 0 ? (
            <FlatList
              horizontal
              data={props.categoryData}
              renderItem={renderCategoryData}
              style={styles.categoryListViewStyle}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <NoDataComponent style={styles.noDataViewStyle} />
          )}
        </>
      )}
    </View>
  );
};
export default HRCategoryLisComponent;
const styles = StyleSheet.create({
  categoryRecommendedHeaderStyle: {
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  catRecTitleStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(15),
  },

  categoryViewStyle: {
    // flex: 1,
    // marginRight: 20,
    paddingTop: 5,
    alignItems: 'center',
    // justifyContent: 'center',
    // height: widthPercentageToDP(35),
    width: widthPercentageToDP(28),
    // borderWidth: 1,
  },

  catImgStyle: {
    borderRadius: 50,
    width: widthPercentageToDP(20),
    height: widthPercentageToDP(20),
    borderColor: HRColors.textTitleColor,
    overflow: 'hidden',
  },

  catTitleStyle: {
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 7,
    fontSize: getProportionalFontSize(14),
  },

  recSubTitleStyle: {
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  noDataViewStyle: {
    height: widthPercentageToDP(40),
  },

  categoryListViewStyle: {
    marginTop: 10,
    marginHorizontal: 20,
  },
});
