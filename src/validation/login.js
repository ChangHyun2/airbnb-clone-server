// https://blog.bitsrc.io/build-a-login-auth-app-with-mern-stack-part-1-c405048e3669

const validator = require('validator');
const isEmpty = require('is-empty');

// data : {email, password}
module.exports = function validateLoginInput(data) {
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
    }
  });

  return { error, isValid: isEmpty(error) };
};
