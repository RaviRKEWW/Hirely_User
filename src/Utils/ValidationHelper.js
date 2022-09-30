class ValidationHelper {
  emailValidation = value => {
    var email =
      /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    if (value.trim() == '') {
      return 'Please enter email address';
    } else if (!value.match(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  nameValidation = value => {
    var pattern = /^[a-zA-Z]{2,40}([a-zA-Z]{2,40})+$/;
    if (value.trim() == '') {
      return 'Please enter full name';
    } else if (value.length < 2) {
      return 'Full name should be minimum of 2 characters';
    }
    return '';
  };

  descriptionValidation = value => {
    if (value.trim() == '') {
      return 'Please enter description';
    } else if (value.length < 0 && value.length > 120) {
      return 'Description should be between 0-120 characters';
    }
    return '';
  };
  mobileValidation = (value, message) => {
    let phone = /^[0-9]{8,10}$/;
    if (value.trim() == '') {
      return 'Please enter mobile number';
    } else if (!value.match(phone)) {
      return 'Please enter valid mobile number';
    }
    return '';
  };
  zipCodeValidation = value => {
    if (value.trim() == '') {
      return 'Please enter postal code';
    } else if (value.trim().toString().length < 6) {
      return 'Please enter valid postal code';
    }
    return '';
  };

  isEmptyValidation = (value, message) => {
    if (value.trim() == '') {
      return message ?? 'Please select reason or subject';
    }
    return '';
  };

  isValidAmount = (value, message) => {
    let amount = /^((0?\.((0[1-9])|[1-9]\d))|([1-9]\d*(\.\d{2})?))$/;
    if (value.trim() == '') {
      return 'Please enter amount';
    } else if (!value.match(amount)) {
      return 'Please enter valid amount';
    }
    return '';
  };
}

export default ValidationHelper;
