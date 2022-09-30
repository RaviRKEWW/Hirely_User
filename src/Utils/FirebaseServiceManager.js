import messaging from '@react-native-firebase/messaging';

export const checkFirebaseServices = async (
  onSuccessFirebaseHandler,
  onFailureFirebaseHandler,
) => {
  requestPermission(
    token => {
      onSuccessFirebaseHandler(token);
    },
    error => {
      onFailureFirebaseHandler(error);
    },
  );
};

async function requestPermission(
  onSuccessPermissionHandler,
  onFailurePermissionHandler,
) {
  await messaging()
    .requestPermission()
    .then(() => {
      getToken(
        token => {
          onSuccessPermissionHandler(token);
        },
        error => {
          onFailurePermissionHandler(error);
        },
      );
    })
    .catch(error => {
      onFailurePermissionHandler(error);
    });
}

async function getToken(onSuccessTokenHandler, onFailureTokenHandler) {
  await messaging()
    .getToken()
    .then(token => {
      onSuccessTokenHandler(token);
    })
    .catch(error => {
      onFailureTokenHandler(error);
    });
}
