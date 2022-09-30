import React from 'react';
import Assets from '../Assets/index';
import HRColors from '../Utils/HRColors';
import NoDataComponent from './NoDataComponent';
import HRHeaderComponent from './HRHeaderComponent';
import SafeAreaView from 'react-native-safe-area-view';
import {View, StatusBar, StyleSheet} from 'react-native';
const BaseContainer = props => {
  return (
    <SafeAreaView
      forceInset={{top: 'always'}}
      style={[styles.safeViewStyle, props.styles]}>
      <View style={styles.flex}>
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={'transparent'}
        />
        <HRHeaderComponent
          onPress={props.onPress}
          isLeftIcon={props.isLeftIcon}
          headerText={props.headerText}
          onFavPress={props.onFavPress}
          isChatIcon={props.isChatIcon}
          detailsIcon={props.detailsIcon}
          isRightIcon={props.isRightIcon}
          onChatPress={props.onChatPress}
          filterComponent={props.filterComponent}
          isTitleComponent={props.isTitleComponent}
        />
        {props.noInternet ? (
          <NoDataComponent
            text={'No internet connection'}
            onPress={props.onInternetRefresh}
            noDataImage={Assets.noInternetIcon}
          />
        ) : (
          props.children
        )}
      </View>
    </SafeAreaView>
  );
};

export default BaseContainer;
const styles = StyleSheet.create({
  safeViewStyle: {
    flex: 1,
    backgroundColor: HRColors.white,
  },

  flex: {
    flex: 1,
  },
});
