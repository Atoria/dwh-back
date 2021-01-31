const User = require('../modules/model').User;

isAdmin = function (req, res, next) {
  const user = req.user;
  if (user.dataValues.role !== User.getAdminRole()) {
    return res.send(401);
  }
  next();
}


module.exports = {
  isAdmin
}