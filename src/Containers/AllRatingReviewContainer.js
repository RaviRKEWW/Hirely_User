import React, {useState, useEffect, useCallback} from 'react';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRListLoader from '../Components/HRListLoader';
import BaseContainer from '../Components/BaseContainer';
import NoDataComponent from '../Components/NoDataComponent';
import HRStarRatingComponent from '../Components/HRStarRatingComponent';
import {getProportionalFontSize, VIEW_RATING_API} from '../Utils/HRConstant';
import {Text, View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import HRReviewDetailsComponent from '../Components/HRReviewDetailsComponent';
let pageCount = 1;
let endReached = true;
const AllRatingReviewContainer = props => {
  const [avgRating, setAVGRating] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  const [isLastLoading, setIsLastLoading] = useState(false);

  useEffect(() => {
    pageCount = 1;
    setIsLoading(true);
    getReviewList();
  }, []);

  const getReviewList = () => {
    let reviewBodyParam = {
      page: pageCount,
      provider_id: props?.route?.params?.providerId,
    };
    postApi(VIEW_RATING_API, reviewBodyParam, onRatingSuccess, onRatingFailure);
  };
  const onRatingSuccess = success => {
    if (success.status) {
      setAVGRating(success.data.avg_rating);
      if (pageCount == 1) {
        setReviewData(success.data.my_review);
        stopAllLoader();
        endReached = success.data.my_review.length < 10 ? false : true;
      } else if (success.data.my_review.length < 10) {
        endReached = false;
        setReviewData([...reviewData, ...success.data.my_review]);
        stopAllLoader();
      } else if (success.data.my_review?.length !== 0) {
        setReviewData([...reviewData, ...success.data.my_review]);
        stopAllLoader();
      }
      setNoInternet(false);
    } else {
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
      stopAllLoader();
    }
  };

  const onRatingFailure = error => {
    stopAllLoader();
  };

  const onRefresh = useCallback(() => {
    setIsRefresh(true);
    wait(1000).then(() => {
      pageCount = 1;
      getReviewList();
    });
  }, []);
  const wait = timeout => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  };

  const stopAllLoader = () => {
    setIsLoading(false);
    setIsRefresh(false);
    setIsLastLoading(false);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    setIsLoading(true);
    getReviewList();
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  const lineSeparator = () => {
    return <View style={styles.dividerStyle} />;
  };
  const listHeaderComponent = () => {
    return (
      <>
        <View style={styles.headerStyle}>
          <Text style={styles.commonTitleStyle}>Reviews</Text>
          <HRStarRatingComponent
            disabled
            starSize={13}
            starCount={avgRating}
            buttonStyle={styles.starBtnStyle}
            emptyStarColor={HRColors.grayBorder}
            containerStyle={styles.starContainerStyle}
          />
        </View>
        {lineSeparator()}
      </>
    );
  };
  const renderReviewItem = ({item, index}) => {
    return (
      <HRReviewDetailsComponent
        item={item}
        index={index}
        viewStyle={styles.reviewItemStyle}
      />
    );
  };
  return (
    <BaseContainer isLeftIcon onPress={onBackPress} headerText={'Reviews'}>
      {isLoading ? (
        <View style={styles.flex}>
          <HRListLoader style={styles.loaderStyle} isList />
        </View>
      ) : (
        <>
          {reviewData.length < 0 ? listHeaderComponent() : null}
          <FlatList
            windowSize={10}
            bounces={false}
            data={reviewData}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            legacyImplementation={true}
            onEndReachedThreshold={0.5}
            removeClippedSubviews={true}
            renderItem={renderReviewItem}
            showsVerticalScrollIndicator={false}
            keyExtractor={({item, index}) => index}
            ListHeaderComponent={listHeaderComponent}
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
            onEndReached={({distanceFromEnd}) => {
              if (endReached) {
                setIsLastLoading(true);
                pageCount = pageCount + 1;
                getReviewList();
              }
            }}
            ListFooterComponent={
              isLastLoading ? <HRListLoader style={styles.loaderStyle} /> : null
            }
            refreshControl={
              <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
            }
          />
        </>
      )}
    </BaseContainer>
  );
};

export default AllRatingReviewContainer;
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  headerStyle: {
    marginVertical: 10,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },

  starBtnStyle: {
    marginHorizontal: 2,
  },

  starContainerStyle: {
    marginHorizontal: 10,
  },

  dividerStyle: {
    borderWidth: 0.2,
    borderColor: HRColors.grayBorder,
  },

  loaderStyle: {
    height: 60,
    width: '90%',
    marginTop: 10,
    alignSelf: 'center',
  },

  reviewItemStyle: {
    marginVertical: 10,
    marginHorizontal: 20,
  },

  commonTitleStyle: {
    fontFamily: HRFonts.Poppins_SemiBold,
    fontSize: getProportionalFontSize(15),
  },
});
