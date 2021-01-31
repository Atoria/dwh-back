const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./../model').User;
const UserPhoneChange = require('./../model').UserPhoneChange;
const crypto = require('crypto');
const Sequelize = require('sequelize');
const auth = require('../../helpers/auth');
const jwt = require('jsonwebtoken');
const jwt_secret = require('./../../config').jwt_secret;
const userIdentityHelper = require('./../../helpers/userIdentity')
const userHelper = require('./../../helpers/user')
const sendSms = require('./../../helpers/sendSms')
const sendEmail = require('./../../helpers/sendEmail')
const constants = require('./../../helpers/constants')
const moment = require('moment')



module.exports = router;
