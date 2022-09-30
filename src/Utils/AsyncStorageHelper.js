import AsyncStorage from '@react-native-async-storage/async-storage';
export function saveDataInAsync(Key, data, onSuccess, onFailure) {
  AsyncStorage.setItem(Key, JSON.stringify(data))
    .then(response => {
      onSuccess(response);
    })
    .catch(error => {
      onFailure(error);
    });
}

export async function getDataFromAsync(Key, onSuccess, onFailure) {
  await AsyncStorage.getItem(Key)
    .then(response => {
      if (response !== undefined && response !== null && response !== '') {
        onSuccess(JSON.parse(response));
      } else {
        onFailure(response);
      }
    })
    .catch(error => {
      onFailure(error);
    });
}

export async function clearDataFromAsync(Key, onSuccess, onFailure) {
  await AsyncStorage.removeItem(Key, response => {
    onSuccess(response);
  }).catch(error => {
    onFailure(error);
  });
}

export async function clearAllDataFromAsync(onSuccess, onFailure) {
  await AsyncStorage.clear(response => {
    onSuccess(response);
  }).catch(error => {
    onFailure(error);
  });
}
