import React, {useState, useEffect} from 'react';
import HRColors from '../Utils/HRColors';
import {CMS_API} from '../Utils/HRConstant';
import {WebView} from 'react-native-webview';
import Toast from 'react-native-simple-toast';
import {ActivityIndicator} from 'react-native';
import {postApi} from '../Utils/ServiceManager';
import BaseContainer from '../Components/BaseContainer';
const CMSContainer = props => {
  const [cmsUrl, setCmsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);

  useEffect(() => {
    getCMSPage();
  }, []);

  const getCMSPage = () => {
    setIsLoading(true);
    let cmsParam = {
      url_type: props?.route?.params?.urlParam,
    };
    postApi(CMS_API, cmsParam, onSuccess, onFailure);
  };
  const onSuccess = success => {
    if (success.status) {
      setCmsUrl(success.url);
      setIsLoading(false);
      setNoInternet(false);
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
      setIsLoading(false);
    }
  };

  const onFailure = error => {
    Toast.show('Try again later!', Toast.LONG);
    setIsLoading(false);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    getCMSPage();
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      noInternet={noInternet}
      onInternetRefresh={onInternetRefresh}
      headerText={props?.route?.params?.headerTitle}>
      {isLoading ? (
        <ActivityIndicator color={HRColors.primary} size="large" />
      ) : (
        <WebView source={{uri: cmsUrl}} />
      )}
    </BaseContainer>
  );
};

export default CMSContainer;
