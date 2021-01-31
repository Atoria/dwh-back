const jwt_secret = require('./../config').jwt_secret;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const User = require('./../modules/model').User;
const bcrypt = require('bcryptjs');
const sequelize = require('sequelize');

let auth = {};
auth.isAuthorized = passport.authenticate('jwt', {session: false});
auth.login = function (req, res, next) {

  passport.authenticate(
    'local', {
      session: false,
    }, (err, user, info) => {
      if (err || !user) {
        console.log(err);
        return res.json({code: 1, success: false});
      }
      req.login(user, {session: false}, (err) => {
        if (err) {
          res.send(err);
        }

        const token = jwt.sign(user.dataValues, jwt_secret, {expiresIn: '3000000m'});

        let returnData = {
          token: token,
          success: true,
          user: user.getJson()
        }

        return res.json(returnData);
      });
    }
  )(req, res, next);
};

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    //Case insensitive email match
    User.findOne({
      where: {
        email: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), email.toLowerCase()),
      }
    }).then(user => {
      if (!user) return done(null, false, {message: 'Incorrect username.'});
      bcrypt.compare(password, user.password_hash, (err, match) => {
        if (err) return err;
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, {message: 'Incorrect password.'});
        }
      });
    }).catch(err => {
      return done(err);
    });
  }
));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_secret,
  },
  async function (jwtPayload, cb) {
    //find the user in db if needed
    let user = await User.findOne({where: {id: jwtPayload.id}});

    if (user) {
      return cb(null, user)
    }

    return cb(null, false, {error: 'err'});
  }
));


module.exports = auth;
