const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const validateLoginInput = require('../../validation/login');
const validateRegisterInput = require('../../validation/register');

const User = require('../../models/User');

// @route POST api/users/registor
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  const { error, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(error);
  }

  const { name, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ errorMessage: 'Email already exits' });
    }

    const newUser = new User({ name, email });

    bcrypt.genSalt(8, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) throw err;

        newUser.password = hash;
        newUser
          .save()
          .then((user) => res.json(user))
          .catch((err) => console.log(err));
      });
    });
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post('/login', (req, res) => {
  const { error, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(error);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ errorMessage: 'Email not found' });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const { id, name } = user;

        const payload = { id, name };

        return jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 31556926 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer' + token,
            });
          }
        );
      }

      return res.status(400).json({ errorMessage: 'password incorrect' });
    });
  });
});

module.exports = router;
