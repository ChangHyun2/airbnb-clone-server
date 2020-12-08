// https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669

const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegsiterInput(data) {
  let error = {};

  // validate each field
  Object.keys(data).forEach((key) => {
    const value = data[key];

    // empty field to empty string
    if (isEmpty(value)) {
      data[key] = '';
    }

    // validate empty
    if (validator.isEmpty(value)) {
      error[key] = `${
        key.charAt(0).toUppercase + key.slice(1)
      } field is required`;
    }

    switch (key) {
      case 'email': {
        if (!validator.isEmail(value)) {
          error.email = 'Email is invalid';
        }
      }
      case 'password': {
        if (!validator.isLength(value, { min: 6, max: 30 })) {
          error.password = 'Password must 6 ~ 30 characters';
        }
      }
    }
  });

  const { password, password2 } = data;

  if (!validator.equals(password, password2)) {
    error.password2 = 'passwords must match';
  }

  return { error, isValid: isEmpty(error) };
};
