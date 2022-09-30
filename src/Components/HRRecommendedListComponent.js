import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import {useSelector} from 'react-redux';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import HRHomeLoaders from '../Components/HRHomeLoaders';
import {getProportionalFontSize} from '../Utils/HRConstant';
import NoDataComponent from '../Components/NoDataComponent';
import {widthPercentageToDP} from 'react-native-responsive-screen';
const HRRecommendedListComponent = props => {
  let userData = useSelector(state => state.userOperation);
  const [favListRedux, setFavListRedux] = useState([]);

  useEffect(() => {
    let favIds = [];
    userData?.favouriteList?.map(item => {
      favIds.push(item.service_id);
    });
    setFavListRedux(favIds);
  }, [userData.favouriteList]);

  const onFavHandler = (item, index, string) => {
    if (props.onItemFav !== undefined) {
      props.onItemFav(item, index, string);
    }
  };

  const viewAllPress = () => {
    if (props.viewAllRec !== undefined) {
      props.viewAllRec();
    }
  };

  const onItemPressHandler = (item, index) => {
    if (props.onRecItemPress !== undefined) {
      props.onRecItemPress(item, index);
    }
  };
  const renderRecommendedData = ({item, index}) => {
    return (
      <TouchableOpacity
        key={item.id}
        activeOpacity={1.0}
        style={styles.itemStyle}
        onPress={() => onItemPressHandler(item, index)}>
        <FastImage
          style={styles.imageStyle}
          source={
            item.service_images.length > 0
              ? {
                  priority: 'high',
                  cache: 'immutable',
                  uri: item.service_images[0]?.image,
                }
              : Assets.noDataImage
          }
        />

        <View style={styles.ratingViewStyle}>
          <Icon name={'star'} color={'#F5D759'} type={'ionicons'} size={15} />
          <Text style={styles.rateTextStyle}>{item.rating}</Text>
        </View>
        {userData.userDetail.id ? (
          <TouchableOpacity
            activeOpacity={1.0}
            style={styles.favViewStyle}
            onPress={() =>
              onFavHandler(
                item,
                index,
                favListRedux.includes(item.id) ? 'remove' : 'add',
              )
            }>
            <Image
              source={
                favListRedux.includes(item.id)
                  ? Assets.heart_Fill
                  : Assets.heart_unFill
              }
              style={styles.favIconStyle}
            />
          </TouchableOpacity>
        ) : (
          <View activeOpacity={1.0} style={styles.favViewStyle}>
            <Image source={Assets.heart_unFill} style={styles.favIconStyle} />
          </View>
        )}

        <Text style={styles.titleStyle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.providerNameStyle} numberOfLines={1}>
          By: {item?.provider?.name}
        </Text>
        <Text style={styles.feeTypeTextStyle}>
          Approx price inclusive of booking:{' '}
          <Text style={styles.fixedPriceStyle}>${item.approx_price}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      {props.isLoading ? (
        <HRHomeLoaders />
      ) : (
        <>
          <View style={styles.categoryRecommendedHeaderStyle}>
            <View>
              <Text style={styles.catRecTitleStyle}>{'Recommended'}</Text>
              {props.arrayItem.length > 0 ? (
                <Text style={styles.recSubTitleStyle}>
                  {'( ' + props.serviceCount + ' Items )'}
                </Text>
              ) : null}
            </View>
            {props.serviceCount > 5 ? (
              <TouchableOpacity activeOpacity={1.0} onPress={viewAllPress}>
                <Text style={styles.recSubTitleStyle}>View All</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {props.arrayItem.length > 0 ? (
            <FlatList
              horizontal
              data={props.arrayItem}
              style={styles.listStyle}
              renderItem={renderRecommendedData}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index + item?.id.toString()}
            />
          ) : (
            <NoDataComponent style={styles.noDataViewStyle} />
          )}
        </>
      )}
    </View>
  );
};

export default HRRecommendedListComponent;
const styles = StyleSheet.create({
  listStyle: {
    margin: 10,
    ...Platform.select({
      ios: {paddingHorizontal: 7, paddingVertical: 7},
    }),
  },

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

  recSubTitleStyle: {
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(13),
  },

  itemStyle: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        marginRight: 15,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        elevation: 2,
        marginRight: 10,
        marginVertical: 5,
        marginHorizontal: 5,
      },
    }),
    width: widthPercentageToDP('40'),
    height: widthPercentageToDP('55'),
  },

  imageStyle: {
    padding: 15,
    borderRadius: 10,
    height: widthPercentageToDP('32'),
  },

  ratingViewStyle: {
    top: 15,
    left: 15,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    backgroundColor: HRColors.white,
  },

  favViewStyle: {
    top: 15,
    right: 15,
    padding: 5,
    borderRadius: 15,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: HRColors.white,
  },

  titleStyle: {
    marginTop: 5,
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(14),
  },

  providerNameStyle: {
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(12),
  },

  rateTextStyle: {
    textAlign: 'center',
    alignItems: 'center',
    color: HRColors.textTitleColor,
    fontFamily: HRFonts.AirBnb_Book,
    fontSize: getProportionalFontSize(10),
  },

  favIconStyle: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },

  feeTypeTextStyle: {
    color: '#0B182A',
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(9),
  },

  fixedPriceStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(10),
  },

  noDataViewStyle: {
    marginVertical: 10,
    marginHorizontal: 7,
    height: widthPercentageToDP('48'),
  },
});
