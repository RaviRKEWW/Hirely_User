import React, {memo} from 'react';
import HRColors from '../Utils/HRColors';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import {View, Dimensions, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Image from 'react-native-image-progress';
const screenWidth = Dimensions.get('window').width;
const HRBannerComponent = props => {
  const onPressHandler = (item, index) => {
    if (props?.onPress !== undefined) {
      props?.onPress(item);
      props?.getIndex(index);
    }
  };

  return (
    <>
      {props?.isLoading ? (
        <SkeletonPlaceholder>
          <View style={styles.bannerLoaderStyle} />
        </SkeletonPlaceholder>
      ) : (
        <Carousel
          loop={false}
          autoplay={false}
          index={props?.index}
          pageSize={props?.pageSize ?? screenWidth}
          activePageIndicatorStyle={styles.activePageIStyle}
          showsPageIndicator={props?.arrayItem?.length > 1 ? true : false}>
          {props?.arrayItem?.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1.0}
              onPress={() => onPressHandler(item, index)}>
              <Image
                indicator={() => (
                  <ActivityIndicator size={'small'} color={HRColors.primary} />
                )}
                style={[styles.bannerImageStyle, props?.bannerImageStyle]}
                source={{
                  uri: item?.image,
                }}
                onLoadEnd={() => console.log('Image was loaded!')}
              />
            </TouchableOpacity>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default memo(HRBannerComponent);
const styles = StyleSheet.create({
  activePageIStyle: {
    backgroundColor: HRColors.primary,
  },

  bannerImageStyle: {
    width: '90%',
    borderRadius: 15,
    resizeMode: 'cover',
    alignSelf: 'center',
    height: heightPercentageToDP('18'),
  },

  bannerLoaderStyle: {
    width: '90%',
    marginTop: 15,
    borderRadius: 15,
    resizeMode: 'cover',
    alignSelf: 'center',
    height: heightPercentageToDP('18'),
  },
});
