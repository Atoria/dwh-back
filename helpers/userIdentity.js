const jwt_secret = require('./../config').jwt_secret;
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const User = require('./../modules/model').User;

getCurrentUser = async function (token) {
  try {
    if (!token) {
      return null;
    } else {
      let user = await jwt.verify(token, jwt_secret);
      return await User.findOne({where:{id: user.id}});
    }
  } catch (e) {
    return null;
  }

}


module.exports = {
  getCurrentUser
};
