import {Platform} from 'react-native';
import {PERMISSIONS, check, RESULTS, request} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
let paramPermission =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION;
export async function requestLocationPermission(onSuccess, onFailure) {
  request(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}
export async function checkLocationPermission(onSuccess, onFailure) {
  check(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        requestLocationPermission(paramPermission, onSuccess, onFailure);
        break;
      case RESULTS.DENIED:
        requestLocationPermission(paramPermission, onSuccess, onFailure);
        break;
      case RESULTS.GRANTED:
        requestLocationPermission(paramPermission, onSuccess, onFailure);
        break;
      case RESULTS.BLOCKED:
        requestLocationPermission(paramPermission, onSuccess, onFailure);
        break;
    }
  });
}

export async function checkPermission(onSuccess, onFailure) {
  check(paramPermission).then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        onFailure(result);
        break;
      case RESULTS.DENIED:
        onFailure(result);
        break;
      case RESULTS.GRANTED:
        onSuccess(result);
        break;
      case RESULTS.BLOCKED:
        onFailure(result);
        break;
    }
  });
}

export async function getCurrentPosition(onSuccess, onFailure) {
  Geolocation.getCurrentPosition(
    info => {
      onSuccess(info);
    },
    error => {
      onFailure(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 200000,
      maximumAge: 1000,
    },
  );
}
