import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Platform,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  ADDRESS_LIST_API,
  DELETE_ADDRESS_API,
  SELECT_ADDRESS_API,
  getProportionalFontSize,
} from '../Utils/HRConstant';
import Assets from '../Assets/index';
import HRFonts from '../Utils/HRFonts';
import HRColors from '../Utils/HRColors';
import {Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {postApi} from '../Utils/ServiceManager';
import HRThemeBtn from '../Components/HRThemeBtn';
import HRPopupView from '../Components/HRPopView';
import {useSelector, useDispatch} from 'react-redux';
import HRListLoader from '../Components/HRListLoader';
import {saveAddressList} from '../redux/Actions/User';
import BaseContainer from '../Components/BaseContainer';
import {saveDataInAsync} from '../Utils/AsyncStorageHelper';
import NoDataComponent from '../Components/NoDataComponent';
const MyAddressContainer = props => {
  const dispatch = useDispatch();
  const [deleteData, setDeleteData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [noInternet, setNoInternet] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [disableTouch, setDisableTouch] = useState(false);
  let userData = useSelector(state => state.userOperation);

  useEffect(() => {
    setIsLoading(true);
    getAddressList();
    props.navigation.addListener('focus', () => {
      getAddressList();
    });
  }, []);

  const getAddressList = () => {
    let addressParam = {
      customer_id: userData.userDetail.id,
    };
    postApi(ADDRESS_LIST_API, addressParam, onSuccess, onFailure, userData);
  };
  const onSuccess = success => {
    if (success.status) {
      console.log('address', success.data.complete_address);
      setAddressList(success.data);
      let selectedAddress = success.data.filter(item => {
        return item.default_address == 1;
      });
      dispatch(saveAddressList(selectedAddress));
      saveDataInAsync(
        'addressList',
        selectedAddress,
        () => {},
        () => {},
      );
      setIsLoading(false);
    } else {
      setIsLoading(false);
      if (success.message.match(/network|internet/)) {
        setNoInternet(true);
      } else {
        Toast.show(success.message, Toast.LONG);
      }
    }
  };

  const onFailure = error => {
    setIsLoading(false);
  };

  const onEditAddress = item => {
    props.navigation.navigate('addAddress', {addressItem: item});
  };

  const onDeleteAddress = item => {
    setDeleteData(item);
    setDeleteModal(true);
  };

  const onClose = () => {
    setDeleteModal(false);
  };

  const onDeletePress = () => {
    let param = {
      address_id: deleteData.id,
      customer_id: userData.userDetail.id,
    };
    postApi(
      DELETE_ADDRESS_API,
      param,
      onDeleteSuccess,
      onDeleteFailure,
      userData,
    );
  };

  const onDeleteSuccess = success => {
    if (success.status) {
      getAddressList();
      setDeleteModal(false);
    }
  };

  const onDeleteFailure = error => {};

  const selectAddressItem = item => {
    setDisableTouch(true);
    let param = {address_id: item.id};
    postApi(
      SELECT_ADDRESS_API,
      param,
      onSelectSuccess,
      onSelectFailure,
      userData,
    );
  };

  const onSelectSuccess = success => {
    setDisableTouch(false);
    if (success.status) {
      getAddressList();
    }
  };

  const onSelectFailure = error => {
    setDisableTouch(false);
  };

  const onInternetRefresh = () => {
    setNoInternet(false);
    getAddressList();
    setDeleteModal(false);
  };

  const onBackPress = () => {
    props.navigation.goBack();
  };
  const renderAddressItem = ({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        disabled={disableTouch}
        onPress={() =>
          item.default_address == 0 ? selectAddressItem(item) : {}
        }
        style={[
          styles.mainItemStyle,
          {
            borderWidth: item.default_address == 1 ? 1 : 0,
          },
        ]}>
        <View style={styles.flexRowStyle}>
          <Text style={styles.addressTextStyle} numberOfLines={2}>
            {item.complete_address}
          </Text>
          <Icon
            size={20}
            name="edit"
            type="antDesign"
            color={HRColors.primary}
            style={styles.marginStart}
            onPress={() => onEditAddress(item)}
          />
          <Icon
            size={20}
            name="delete"
            type="materialIcons"
            color={HRColors.primary}
            style={styles.marginStart}
            onPress={() => onDeleteAddress(item)}
          />
        </View>

        <Text style={styles.cityTextStyle} numberOfLines={1}>
          {item.city}
          {'-' + item.zipcode}
        </Text>
        <Text style={styles.stateTextStyle} numberOfLines={1}>
          {item.state}
        </Text>

        <View style={styles.typeViewStyle}>
          <Text style={styles.typeTextStyle}>{item.address_type}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <BaseContainer
      isLeftIcon
      onPress={onBackPress}
      headerText={'My Address'}
      styles={{backgroundColor: '#F8F8F8'}}>
      <ScrollView style={styles.flex}>
        {isLoading ? (
          <HRListLoader style={styles.loaderStyle} isList />
        ) : (
          <FlatList
            data={addressList}
            renderItem={renderAddressItem}
            ListEmptyComponent={
              noInternet ? (
                <NoDataComponent
                  onPress={onInternetRefresh}
                  text={'No internet connection'}
                  noDataImage={Assets.noInternetIcon}
                />
              ) : (
                <NoDataComponent text={'No address found'} />
              )
            }
          />
        )}
      </ScrollView>
      <HRThemeBtn
        btnText={'Add Address'}
        style={styles.addBtnStyle}
        onPress={() =>
          props.navigation.navigate('addAddress', {addressItem: null})
        }
      />
      <HRPopupView isVisible={deleteModal} onRequestClose={onClose}>
        <TouchableOpacity
          onPress={onClose}
          activeOpacity={1.0}
          style={styles.modalViewStyle}>
          <View style={styles.commonViewStyle}>
            <Text style={styles.stateTextStyle}>
              Are you sure you want to delete your{`\n`}
              {deleteData.address_type} address ?
            </Text>
            <View style={styles.btnViewStyle}>
              <HRThemeBtn
                onPress={onClose}
                btnText={'Cancel'}
                style={styles.cancelBtnStyle}
                btnTextStyle={styles.bookTxtStyle}
              />
              <HRThemeBtn
                btnText={'Delete'}
                onPress={onDeletePress}
                style={styles.redeemBtnStyle}
              />
            </View>
          </View>
        </TouchableOpacity>
      </HRPopupView>
    </BaseContainer>
  );
};
export default MyAddressContainer;
const styles = StyleSheet.create({
  mainItemStyle: {
    borderRadius: 10,
    marginVertical: 5,
    paddingVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 1,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 1,
      },
    }),
  },

  flexRowStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  addressTextStyle: {
    flex: 1,
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
  },

  cityTextStyle: {
    flex: 1,
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
  },

  stateTextStyle: {
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(17),
  },

  typeViewStyle: {
    right: 0,
    bottom: 0,
    position: 'absolute',
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 8,
    backgroundColor: HRColors.primary,
  },

  typeTextStyle: {
    paddingVertical: 5,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: HRColors.white,
    textTransform: 'capitalize',
    fontFamily: HRFonts.AirBnb_Light,
    fontSize: getProportionalFontSize(12),
  },

  bookTxtStyle: {
    color: HRColors.primary,
    fontFamily: HRFonts.AirBnb_Bold,
    fontSize: getProportionalFontSize(16),
  },

  redeemBtnStyle: {
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },

  cancelBtnStyle: {
    borderWidth: 0.5,
    paddingVertical: 7,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    borderColor: HRColors.primary,
    backgroundColor: HRColors.white,
  },

  btnViewStyle: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  commonViewStyle: {
    padding: 10,
    width: '90%',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    backgroundColor: HRColors.white,
    ...Platform.select({
      ios: {
        shadowRadius: 1,
        shadowOpacity: 0.25,
        shadowColor: HRColors.black,
        shadowOffset: {width: 0, height: 0},
      },
      android: {
        elevation: 2,
      },
    }),
  },

  addBtnStyle: {
    marginVertical: 15,
    marginHorizontal: 20,
  },

  flex: {
    flex: 1,
  },

  loaderStyle: {
    height: 120,
    width: '90%',
    marginTop: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },

  marginStart: {
    marginStart: 5,
  },

  modalViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
});
