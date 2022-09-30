import React from 'react';
import {View, StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const HRCategoryListLoader = props => {
  return (
    <View style={styles.mainViewStyle}>
      {[1, 2, 3, 4].map(item => {
        return (
          <SkeletonPlaceholder key={item}>
            <View style={styles.categoryImgLoaderStyle} />
            <View style={styles.categoryNameLoaderStyle} />
          </SkeletonPlaceholder>
        );
      })}
    </View>
  );
};
export default HRCategoryListLoader;
const styles = StyleSheet.create({
  mainViewStyle: {
    margin: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },

  categoryNameLoaderStyle: {
    marginTop: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    paddingHorizontal: 3,
  },

  categoryImgLoaderStyle: {
    borderRadius: 50,
    marginHorizontal: 10,
    width: widthPercentageToDP(18),
    height: widthPercentageToDP(18),
    overflow: 'hidden',
  },
});
