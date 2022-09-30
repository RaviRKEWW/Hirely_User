import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const HRListLoader = props => {
  return (
    <>
      {props.isList ? (
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
          return (
            <SkeletonPlaceholder key={index}>
              <View style={[props.style]} />
            </SkeletonPlaceholder>
          );
        })
      ) : (
        <SkeletonPlaceholder>
          <View style={[props.style]} />
        </SkeletonPlaceholder>
      )}
    </>
  );
};
export default HRListLoader;
