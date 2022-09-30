import React from 'react';
let _navigation;
function setTopLevelNavigation(navigationRef) {
  _navigation = navigationRef;
}
function getTopLevelNavigation() {
  return _navigation;
}
function navigateToSingleRoute(routeName, params) {
  // console.log('Navigation :::::: ', routeName, '  :::::::  ', _navigation);

  _navigation.navigate(routeName, params ?? {});
}

function navigateToSpecificRoute(routeName) {
  console.log('Navigation :::::: ', routeName, '  :::::::  ', _navigation);

  _navigation.reset({
    routes: [{name: routeName}],
  });
}

function navigateToDoubleroot(routeName) {
  console.log('Navigation :::::: ', routeName, '  :::::::  ', _navigation);

  _navigation.reset({
    routes: [{name: 'home'}],
  });
  _navigation.navigate(routeName);
}

export default {
  setTopLevelNavigation,
  navigateToSpecificRoute,
  navigateToDoubleroot,
  navigateToSingleRoute,
  getTopLevelNavigation
};
