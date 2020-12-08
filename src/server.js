const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');

const usersRouter = require('./routers/api/users');

// use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
require('../config/passport')(passport);

// connect db
require('./db/mongoose');

// use Routers
app.use('/api/users', usersRouter);

module.exports = app;
