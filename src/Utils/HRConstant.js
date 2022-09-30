import React from 'react';
import {Dimensions, Platform} from 'react-native';
export function debugLog() {
  for (var i = 0; i < arguments.length; i++) {
    console.log(arguments[i]);
  }
}

export const BASE_URL = 'https://hirely.sg/api/';
export const INIT_API = 'Auth/init/android_customer/';
export const CHAT_BASE_URL = 'https://hirely.sg:3000';
export const LOGIN_API = 'auth/login';
export const CMS_API = 'Customer/url';
export const HOME_API = 'Customer/home';
export const LOGOUT_API = 'auth/logout/';
export const SEND_OTP_API = 'auth/send_otp';
export const GET_MESSAGE_API = 'Customer/chat_history';
export const ORDER_PLACE_API = 'Customer/order';
export const FAVOURITE_API = 'Customer/wishlist';
export const FILTER_LIST_API = 'Customer/filter';
export const REGISTER_API = '/auth/user_register';
export const SEARCH_API = 'customer/service_search';
export const CHAT_LIST_API = 'Customer/chat_list/';
export const ADD_RATING_API = 'Customer/add_rating';
export const VIEW_RATING_API = 'Customer/my_review';
export const REWARD_LIST_API = 'customer/promocode/';
export const POINT_MALL_ONE_API = 'Customer/voucher';
export const ADD_ADDRESS_API = 'Customer/add_address';
export const ADDRESS_LIST_API = 'Customer/my_address';
export const STRIPE_ORDER_PAY_API = 'Customer/stripe';
export const EDIT_PROFILE_API = 'Customer/edit_profile';
export const EDIT_ADDRESS_API = 'Customer/edit_address';
export const CATEGORY_API = 'Customer/category_view_all';
export const ORDER_HISTORY_API = 'Customer/order_history';
export const ORDER_DETAILS_API = 'Customer/order_details';
export const APPLY_VOUCHER_API = 'Customer/voucher_apply';
export const PAY_REMAINING_API = 'Customer/pay_remaining';
export const MOBILE_API = 'Customer/search_mobile_number';
export const PAY_HISTORY_API = 'Customer/hirepay_history';
export const STRIPE_PAY_TO_WALLET_API = 'Customer/hirepay';
export const VIEW_ALL_SERVICE = 'Customer/service_view_all';
export const DELETE_ADDRESS_API = 'Customer/delete_address';
export const SELECT_ADDRESS_API = 'Customer/default_address';
export const NOTIFICATION_LIST_API = 'customer/notification';
export const SERVICE_DETAILS_API = 'Customer/service_details';
export const CURRENT_VOUCHER_API = 'Customer/current_voucher';
export const STRIPE_HIRELY_PAY_API = 'Customer/hirepay_stripe';
export const ADD_REMOVE_FAV_API = 'customer/add_remove_wishlist';
export const SUBJECT_HELP_CANCEL_CLAIM = 'customer/subject_for/';
export const HELP_CLAIM_CANCEL_API = 'customer/help_claim_cancel';
export const FAV_LIST_API = 'Customer/wishlist_without_pagination';
export const NOTIFICATION_SEEN_API = 'customer/read_notification/';
export const STRIPE_PAY_REMAINING = 'Customer/pay_remaining_stripe';
export const VALIDATE_PROMO_CODE_API = 'Customer/validate_promocode';
export const NOTIFICATION_SETTING_API = 'customer/notification_setting';
export const DATE_WISE_SLOT = 'Customer/date_wise_slot';
export const DELETE_ACCOUNT = 'Customer/delete_account';
export const SEND_IMAGES_CHAT = 'Customer/send_images_chat';
export const IMAGE_PREVIEW_CHAT = 'Customer/image_preview';
export const ORDER_COMPLETE_API = 'Customer/order_complete'

export const STATUS = {
  success: 200,
};
export const GOOGLE_MAP_KEY = 'AIzaSyDN9gn9xMYWNVIGLaSXUHOfB6L-dr5_XEI';

const {width, height} = Dimensions.get('window');
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 760;
const scale = size => (width / guidelineBaseWidth) * size;
const verticalScale = size => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// CHANGE FONT SIZE IN ANDROID
export function getProportionalFontSize(baseFontSize) {
  var initialFontSize = baseFontSize || 14;
  var fontSizeToReturnModerate = moderateScale(initialFontSize);
  var fontSizeToReturnVertical = verticalScale(initialFontSize);
  return Platform.OS == 'ios'
    ? fontSizeToReturnModerate
    : fontSizeToReturnVertical;
}
