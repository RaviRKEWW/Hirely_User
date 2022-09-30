'useStript';
import {
  STATUS,
  BASE_URL,
  LOGIN_API,
  SEND_OTP_API,
  GET_MESSAGE_API,
} from '../Utils/HRConstant';
import axios from 'axios';
import {Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
const instance = axios.create({
  baseURL: BASE_URL,
});
instance.defaults.headers.common['Accept'] = 'application/json';
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';
export const postApi = async (
  url,
  params,
  onSuccess,
  onFailure,
  getPropsForHeader,
) => {
  const formData = new FormData();
  const chatData = new URLSearchParams();
  if (getPropsForHeader?.userDetail?.id !== undefined) {
    instance.defaults.headers.common['x-api-key'] =
      getPropsForHeader.userDetail.api_key;
  }
  if (url == GET_MESSAGE_API) {
    instance.defaults.baseURL = BASE_URL;
    instance.defaults.headers.common['Content-Type'] =
      'application/x-www-form-urlencoded';
    Object.keys(params || {}).map(keyToCheck => {
      if (keyToCheck !== 'image' && keyToCheck !== `images[]`) {
        chatData.append(keyToCheck, params[keyToCheck]);
      }
    });
  } else {
    Object.keys(params || {}).map(keyToCheck => {
      if (keyToCheck !== 'image' && keyToCheck !== `images[]`) {
        formData.append(keyToCheck, params[keyToCheck]);
      }
    });
  }

  if (
    (params.image !== undefined &&
      params.image.path !== undefined &&
      params.image.path !== null) ||
    params['images[]'] instanceof Array
  ) {
    const imageDetails = params?.image ?? params['images[]'];
    if (imageDetails instanceof Array) {
      imageDetails.map((item, index) => {
        let uriParts = item.path
          ? item?.path?.split('.')
          : item?.image?.split('.');
        let strURIToUse =
          Platform.OS === 'ios'
            ? (item.path || item.image).replace('file:/', '')
            : item.path || item.image;
        let finalImageDetails = {};
        if (item.image) {
          finalImageDetails['uri'] = strURIToUse;
          (finalImageDetails['name'] =
            Math.round(new Date().getTime() / 1000) +
            '.' +
            uriParts[uriParts.length - 1]),
            (finalImageDetails['type'] = item.mime || 'jpg/jpeg');
        } else {
          finalImageDetails['uri'] = strURIToUse;
          (finalImageDetails['name'] =
            Math.round(new Date().getTime() / 1000) +
            '.' +
            uriParts[uriParts.length - 1]),
            (finalImageDetails['type'] = item.mime);
        }
        formData.append('images[]', finalImageDetails);
      });
    } else {
      const uriParts = imageDetails.fileName
        ? imageDetails.fileName.split('.')
        : imageDetails.path.split('.');
      const strURIToUse =
        Platform.OS === 'ios'
          ? imageDetails.path.replace('file:/', '')
          : imageDetails.path;

      const finalImageDetails = {
        uri: strURIToUse,
        name:
          imageDetails.fileName ||
          Math.round(new Date().getTime() / 1000) +
            '.' +
            uriParts[uriParts.length - 1],
        type: imageDetails.mime,
      };
      formData.append('image', finalImageDetails);
    }
  }
  console.log('formData :::: ', formData);
  await NetInfo.fetch().then(state => {
    if (state.isConnected) {
      instance
        .post(url, url == GET_MESSAGE_API ? chatData : formData)
        .then(response => {
          if (response.status == STATUS.success) {
            onSuccess(response.data);
          } else {
            onSuccess(response.data);
          }
        })
        .catch(error => {
          console.log('POST ERROR===>', error, instance.defaults.headers);
          onFailure(error);
        });
    } else {
      if (url == SEND_OTP_API || url == LOGIN_API) {
        onSuccess({status: false, error: 'Check your internet connection!'});
      } else {
        onSuccess({status: false, message: 'Check your internet connection!'});
      }
    }
  });
};

export const getApi = async (url, onSuccess, onFailure, getPropsForHeader) => {
  instance.defaults.baseURL = BASE_URL;
  if (getPropsForHeader?.userDetail?.id !== undefined) {
    instance.defaults.headers.common['x-api-key'] =
      getPropsForHeader.userDetail.api_key;
  }
  await NetInfo.fetch().then(state => {
    if (state.isConnected) {
      instance
        .get(url)
        .then(response => {
          if (response.status == STATUS.success) {
            onSuccess(response.data);
          } else {
            onSuccess(response.data);
          }
        })
        .catch(error => {
          console.log('GET ERROR===>', error);
          onFailure(error);
        });
    } else {
      onSuccess({status: false, message: 'Check your internet connection!'});
    }
  });
};
