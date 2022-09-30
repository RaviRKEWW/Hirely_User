import React from 'react';
import StarRating from 'react-native-star-rating';
const HRStarRatingComponent = props => {
  return (
    <StarRating
      maxStars={5}
      rating={props.starCount}
      starSize={props.starSize}
      fullStarColor={'#FAB620'}
      disabled={props.disabled}
      animation={props.animation}
      buttonStyle={props.buttonStyle}
      starStyle={{marginHorizontal: 1}}
      selectedStar={props.selectingStar}
      containerStyle={props.containerStyle}
      emptyStarColor={props.emptyStarColor ?? ''}
    />
  );
};
export default HRStarRatingComponent;
