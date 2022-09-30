import React from 'react';
import {View, StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const HRHomeLoaders = props => {
  return (
    <View style={styles.categoryLoaderViewStyle}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between">
          <View style={styles.categoryHeaderViewStyle} />
          <View style={styles.categoryHeaderViewStyle} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
      <View style={styles.viewStyle}>
        {[1, 2, 3, 4, 5].map(item => {
          return (
            <SkeletonPlaceholder key={item}>
              <View
                style={
                  props.isCategory
                    ? styles.categoryImgLoaderStyle
                    : styles.recommendedViewStyle
                }
              />
              {props.isCategory ? (
                <View style={styles.categoryNameLoaderStyle} />
              ) : (
                <View />
              )}
            </SkeletonPlaceholder>
          );
        })}
      </View>
    </View>
  );
};

export default HRHomeLoaders;
const styles = StyleSheet.create({
  categoryLoaderViewStyle: {
    marginTop: 15,
    overflow: 'hidden',
    marginHorizontal: 20,
  },

  categoryHeaderViewStyle: {
    paddingVertical: 7,
    paddingHorizontal: 25,
  },

  categoryImgLoaderStyle: {
    marginRight: 15,
    borderRadius: 50,
    width: widthPercentageToDP(20),
    height: widthPercentageToDP(20),
    overflow: 'hidden',
  },

  categoryNameLoaderStyle: {
    marginTop: 10,
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 3,
  },

  recommendedViewStyle: {
    padding: 10,
    marginRight: 10,
    borderRadius: 15,
    width: widthPercentageToDP('40'),
    height: widthPercentageToDP('48'),
  },

  viewStyle: {
    marginTop: 15,
    flexDirection: 'row',
  },
});
