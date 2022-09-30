import React, {useState, useEffect} from 'react';
import Assets from '../Assets/index';
import {useSelector} from 'react-redux';
import Toast from 'react-native-simple-toast';
import {getApi} from '../Utils/ServiceManager';
import BaseContainer from '../Components/BaseContainer';
import {View, StyleSheet, Alert} from 'react-native';
import NoDataComponent from '../Components/NoDataComponent';
import HRCategoryComponent from '../Components/HRCategoryComponent';
import {ScrollView} from 'react-native';
const SubCategoryListContainer = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [noInternet, setNoInternet] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  let userData = useSelector(state => state.userOperation);
  const [subCategoryData, setSubCategoryData] = useState(
    props?.route?.params?.subCategoryArray ?? [],
  );
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState(0);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);

  useEffect(() => {
    // setIsLoading(true);
    // getCategories();
    console.log('subcategoryyy', props.route.params.subCategoryArray);
  }, []);

  const getCategories = () => {
    getApi(
      'Provider/sub_category/' + props.route.params.categoryName,
      onSuccess,
      onFailure,
      userData,
    );
  };
  const onSuccess = successResponse => {
    if (successResponse.status) {
      setCategoryData(successResponse.category_data);
      if (successResponse.category_data.length > 0) {
        if (successResponse.category_data[0]?.sub_category.length > 0) {
          setSelectedCategory(0);
          setSubCategoryData(successResponse.category_data[0]?.sub_category);
          setIsSubCategoryOpen(true);
        }
      }
      setNoInternet(false);
      setIsLoading(false);
    } else {
      if (successResponse.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(successResponse.message, Toast.LONG);
      }
      setIsLoading(false);
    }
  };

  const onFailure = error => {
    setIsLoading(false);
  };
  const onChatPress = () => {
    if (userData.userDetail?.id) {
      props.navigation.navigate('chatList');
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('login')},
      ]);
    }
  };
  const onFavPress = () => {
    if (userData.userDetail?.id) {
      props.navigation.navigate('favorite');
    } else {
      Alert.alert('Hirely', 'Please login to access this section', [
        {
          text: 'Cancel',
          onPress: () => props.navigation.navigate('Home'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => props.navigation.navigate('login')},
      ]);
    }
  };

  const openSubCategory = (item, index) => {
    setSelectedCategory(index);
    setSubCategoryData(item?.sub_category);
    setIsSubCategoryOpen(true);
    if (item?.sub_category?.length < 0) {
      setIsSubCategoryOpen(false);
    }
  };

  const selectCategory = (item, index) => {
    setSelectedCategory(index);
    console.log('CATEGORY::: ', item);
    setIsSubCategoryOpen(false);
    props.navigation.navigate('search', {
      isFromHome: true,
      categoryId: item?.category_id,
      subCategoryId: item.id,
      lat: props?.route?.params?.lat,
      long: props?.route?.params?.long,
    });
  };
  const selectCategoryNavigateSearch = (item, index) => {
    console.log('selectCategoryNavigateSearch', item);
    // if (item?.sub_category?.length > 0) {
    //   openSubCategory(item, index);
    // } else {
    selectCategory(item, index);
    // }
  };

  const selectSubCategoryNavigateSearch = (item, index) => {
    console.log('item::', item);
    setSelectedSubCategory(index);
    props.navigation.navigate('search', {
      isFromHome: false,
      subCategoryId: item?.id,
      categoryId: item.category_id,
      lat: props?.route?.params?.lat,
      long: props?.route?.params?.long,
    });
  };

  const onBackPress = () => {
    props.navigation.goBack();
    return true;
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    getCategories();
  };
  const renderCategoryData = ({index, item}) => {
    return (
      <HRCategoryComponent
        item={item}
        index={index}
        selectedCategoryIndex={selectedCategory}
        selectCategory={() => selectCategoryNavigateSearch(item, index)}
      />
    );
  };
  const renderSubCategoryData = ({item, index}) => {
    return (
      <HRCategoryComponent
        item={item}
        index={index}
        style={styles.categoryItemStyle}
        selectedCategoryIndex={selectedSubCategory}
        selectCategory={() => selectSubCategoryNavigateSearch(item, index)}
      />
    );
  };

  return (
    <BaseContainer
      isLeftIcon
      isRightIcon
      onPress={onBackPress}
      onFavPress={onFavPress}
      onChatPress={onChatPress}
      headerText={props.route.params.categoryName ?? 'Sub Categories'}>
      {/* {isLoading ? (
        <HRCategoryListLoader />
      ) : ( */}
      <>
        <View style={styles.listContainerStyle}>
          {/* <FlatList
              numColumns={3}
              data={subCategoryData}
              renderItem={renderSubCategoryData}
              //   showsVerticalScrollIndicator={false}
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
              keyExtractor={(item, index) => index + item.id.toString()}

            /> */}

          {subCategoryData.length !== 0 ? (
            <>
              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {subCategoryData?.map((item, index) => {
                  return (
                    <HRCategoryComponent
                      item={item}
                      index={index}
                      selectedCategoryIndex={selectedCategory}
                      selectCategory={() =>
                        selectCategoryNavigateSearch(item, index)
                      }
                    />
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <NoDataComponent noDataImage={Assets.noimg} text={'COMING SOON'} />
          )}
          {/* {noInternet ? (
              <NoDataComponent
                onPress={onInternetRefresh}
                text={'No internet connection'}
                noDataImage={Assets.noInternetIcon}
              />
            ) : (
              <NoDataComponent />
            )} */}
        </View>
        {/* {isSubCategoryOpen ? (
            <View style={styles.subCatViewStyle}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={subCategoryData}
                renderItem={renderSubCategoryData}
                keyExtractor={(item, index) => index + item.id.toString()}
              />
            </View>
          ) : null} */}
      </>
      {/* )} */}
    </BaseContainer>
  );
};
export default SubCategoryListContainer;
const styles = StyleSheet.create({
  listContainerStyle: {
    flex: 1,
    paddingHorizontal: 10,
  },

  subCatViewStyle: {
    paddingVertical: 15,
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
  },

  categoryItemStyle: {
    marginHorizontal: 10,
  },
});
