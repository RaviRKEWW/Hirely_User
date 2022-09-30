import {
  SAVE_USER_DETAILS,
  SAVE_ADDRESS_LIST,
  SAVE_MESSAGE_COUNT,
  SAVE_REFERRAL_POINT,
  SAVE_FAVOURITE_LIST,
  SAVE_NOTIFICATION_COUNT,
  SAVE_NOTIFICATION_SETTING,
  SAVE_STRIPE_KEY,
} from '../Actions/User';

const InitialState = {
  userDetail: {},
  isNotification: true,
  notificationCount: 0,
  point: 0,
  messageCount: 0,
  favouriteList: [],
  addressList: [],
};
export function userOperation(state = InitialState, {type, ...rest}) {
  switch (type) {
    case SAVE_USER_DETAILS: {
      return {...state, ...rest};
    }
    case SAVE_STRIPE_KEY: {
      return {...state, ...rest};
    }

    case SAVE_NOTIFICATION_SETTING: {
      return {...state, ...rest};
    }

    case SAVE_NOTIFICATION_COUNT: {
      return {...state, ...rest};
    }

    case SAVE_REFERRAL_POINT: {
      return {...state, ...rest};
    }

    case SAVE_MESSAGE_COUNT: {
      return {...state, ...rest};
    }

    case SAVE_FAVOURITE_LIST: {
      return {...state, ...rest};
    }

    case SAVE_ADDRESS_LIST: {
      return {...state, ...rest};
    }

    default:
      return state;
  }
}
