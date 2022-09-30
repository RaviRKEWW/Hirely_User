export const SAVE_USER_DETAILS = 'SAVE_USER_DETAILS';
export function saveUserDetails(data) {
  return {
    type: SAVE_USER_DETAILS,
    userDetail: data,
  };
}
export const SAVE_STRIPE_KEY = 'SAVE_STRIPE_KEY';
export function saveStripeKey(data) {
  return {
    type: SAVE_STRIPE_KEY,
    stripePk: data,
  };
}

export const SAVE_NOTIFICATION_SETTING = 'SAVE_NOTIFICATION_SETTING';
export function saveNotificationSetting(data) {
  return {
    type: SAVE_NOTIFICATION_SETTING,
    isNotification: data,
  };
}

export const SAVE_NOTIFICATION_COUNT = 'SAVE_NOTIFICATION_COUNT';
export function saveNotificationCount(data) {
  return {
    type: SAVE_NOTIFICATION_COUNT,
    notificationCount: data,
  };
}

export const SAVE_REFERRAL_POINT = 'SAVE_REFERRAL_POINT';
export function saveReferralPoint(data) {
  return {
    type: SAVE_REFERRAL_POINT,
    point: data,
  };
}

export const SAVE_MESSAGE_COUNT = 'SAVE_MESSAGE_COUNT';
export function saveMessageCount(data) {
  return {
    type: SAVE_MESSAGE_COUNT,
    messageCount: data,
  };
}

export const SAVE_FAVOURITE_LIST = 'SAVE_FAVOURITE_LIST';
export function saveFavouriteList(data) {
  return {
    type: SAVE_FAVOURITE_LIST,
    favouriteList: data,
  };
}

export const SAVE_ADDRESS_LIST = 'SAVE_ADDRESS_LIST';
export function saveAddressList(data) {
  return {
    type: SAVE_ADDRESS_LIST,
    addressList: data,
  };
}
