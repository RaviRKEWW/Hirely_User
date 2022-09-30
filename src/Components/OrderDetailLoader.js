import React from 'react';
import {View, StyleSheet} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const OrderDetailLoader = props => {
  return (
    <View style={styles.mainViewStyle} key={props.keyEx}>
      <SkeletonPlaceholder key={props.keyEx}>
        <SkeletonPlaceholder.Item flexDirection="row">
          <View style={styles.mainImageStyle} />
          <SkeletonPlaceholder.Item>
            <View style={[styles.mainLine1Style, styles.mainLineStyle]} />
            <View style={[styles.mainLine2Style, styles.mainLineStyle]} />
            <View style={[styles.mainLine3Style, styles.mainLineStyle]} />
            <View style={[styles.mainLine4Style, styles.mainLineStyle]} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {props.isOrder ? (
          <>
            <View style={[styles.desLine1Style, styles.desLineStyle]} />
            <View style={[styles.desLine2Style, styles.desLineStyle]} />
            <View style={[styles.desLine3Style, styles.desLineStyle]} />
            <View style={[styles.desLine4Style, styles.desLineStyle]} />
            <View style={[styles.desLine5Style, styles.desLineStyle]} />
          </>
        ) : (
          <View />
        )}
      </SkeletonPlaceholder>
    </View>
  );
};
export default OrderDetailLoader;
const styles = StyleSheet.create({
  mainViewStyle: {
    marginTop: 10,
    marginHorizontal: 20,
  },

  mainImageStyle: {
    borderRadius: 10,
    width: widthPercentageToDP(32),
    height: widthPercentageToDP(30),
  },

  mainLineStyle: {
    marginStart: 15,
    marginBottom: 10,
    paddingVertical: 7,
  },

  mainLine1Style: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 60,
  },

  mainLine2Style: {
    width: '80%',
    paddingHorizontal: 40,
  },

  mainLine3Style: {
    width: '60%',
    paddingHorizontal: 30,
  },

  mainLine4Style: {
    width: '40%',
    paddingHorizontal: 15,
  },

  desLineStyle: {
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 60,
  },

  desLine1Style: {
    marginTop: 20,
    width: '100%',
  },

  desLine2Style: {
    width: '80%',
    marginTop: 10,
  },

  desLine3Style: {
    marginTop: 7,
    width: '70%',
  },

  desLine4Style: {
    marginTop: 5,
    width: '60%',
  },

  desLine5Style: {
    marginTop: 5,
    width: '50%',
  },
});
