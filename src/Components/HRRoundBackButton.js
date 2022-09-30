import React from 'react';
import {Icon} from 'react-native-elements';
import {StyleSheet, TouchableOpacity} from 'react-native';
const HRRoundBackButton = props => {
  const onBackHandler = () => {
    if (props.onPress !== undefined) {
      props.onPress();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1.0}
      onPress={onBackHandler}
      style={[styles.backIconStyle, props.style]}>
      <Icon name="arrowleft" type={'antdesign'} size={25} />
    </TouchableOpacity>
  );
};
export default HRRoundBackButton;
const styles = StyleSheet.create({
  backIconStyle: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 15,
    borderColor: '#D4D9D9',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});
