import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {BlurView} from '@react-native-community/blur';
const HRPopupView = props => {
  const onRequestClose = () => {
    if (props?.onRequestClose !== undefined) {
      props?.onRequestClose();
    }
  };

  return (
    <Modal
      transparent={true}
      visible={props?.isVisible}
      onRequestClose={onRequestClose}
      animationType={props?.animationType}>
      <View style={[style.container, props?.style]}>
        <BlurView
          blurAmount={10}
          blurType={props?.blurType || 'light'}
          style={style.blurStyle}
          reducedTransparencyFallbackColor="white"
        />
        {props?.children}
      </View>
    </Modal>
  );
};

export default HRPopupView;
const style = StyleSheet.create({
  container: {
    flex: 1,
  },

  blurStyle: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
});
