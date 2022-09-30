import React, {useEffect, useState, useCallback} from 'react';
import Assets from '../Assets/index';
import {getApi} from '../Utils/ServiceManager';
import {CHAT_LIST_API} from '../Utils/HRConstant';
import {useSelector, useDispatch} from 'react-redux';
import HRListLoader from '../Components/HRListLoader';
import {saveMessageCount} from '../redux/Actions/User';
import BaseContainer from '../Components/BaseContainer';
import NoDataComponent from '../Components/NoDataComponent';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import HRChatComponent from '../Components/HRChatComponent';
import {FlatList, StyleSheet, RefreshControl, Platform} from 'react-native';
import Toast from 'react-native-simple-toast';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

let endReached = true;
let pageCount = 1;
const ChatListContainer = props => {
  const dispatch = useDispatch();
  const [chatList, setChatList] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  let userData = useSelector(state => state.userOperation);
  const [isLastLoading, setIsLastLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    props.navigation.addListener('focus', () => {
      getChatList();
    });
  }, []);
  useEffect(() => {
    const foregroundMessage = messaging().onMessage(async remoteMessage => {
      getChatList();
    });
    return foregroundMessage;
  }, []);
  const getChatList = () => {
    // dispatch(saveMessageCount(0));
    // saveDataInAsync(
    //   'messageCount',
    //   0,
    //   () => {},
    //   () => {},
    // );
    getApi(
      CHAT_LIST_API + userData.userDetail.id,
      onSuccess,
      onFailure,
      userData,
    );
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      Platform.OS === 'ios'
        ? PushNotificationIOS?.removeAllDeliveredNotifications()
        : PushNotification?.cancelAllLocalNotifications();
      setChatList(successResponse.data);
      stopAllLoaders();

      let unreadMessage = successResponse.data.some(
        item => item.unread_messages >= 1,
      );

      if (!unreadMessage) {
        dispatch(saveMessageCount(0));
        saveDataInAsync(
          'messageCount',
          0,
          () => {},
          () => {},
        );
      }
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      stopAllLoaders();
    }
  };

  const onFailure = error => {
    stopAllLoaders();
  };

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      pageCount = 1;
      getChatList();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const stopAllLoaders = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  const onPressOnItem = item => {
    props.navigation.navigate('messageList', {
      name: item.name,
      image: item.image,
      senderId: item.id,
    });
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getChatList();
  };
  const renderChatItem = ({item, index}) => {
    return (
      <HRChatComponent
        item={item}
        index={index}
        onPress={() => onPressOnItem(item)}
      />
    );
  };

  return (
    <BaseContainer isLeftIcon onPress={onBackPress} headerText={'Chat'}>
      {isLoading ? (
        <HRListLoader style={styles.loaderStyle} isList />
      ) : (
        <FlatList
          windowSize={10}
          data={chatList}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          legacyImplementation={true}
          onEndReachedThreshold={0.5}
          renderItem={renderChatItem}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            noInternet ? (
              <NoDataComponent
                onPress={onInternetRefresh}
                text={'No internet connection'}
                noDataImage={Assets.noInternetIcon}
              />
            ) : (
              <NoDataComponent />
            )
          }
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
          }
          // ListFooterComponent={() => {
          //   return isLastLoading ? (
          //     <HRListLoader style={styles.loaderStyle} />
          //   ) : null;
          // }}

          onEndReached={({distanceFromEnd}) => {
            if (endReached) {
              setIsLastLoading(true);
              pageCount = pageCount + 1;
              getChatList();
            }
          }}
        />
      )}
    </BaseContainer>
  );
};
export default ChatListContainer;
const styles = StyleSheet.create({
  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },
});
