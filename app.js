const createError = require('http-errors');
const express = require('express');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const config = require('./config');

var corsOptions = {
  origin: function (origin, callback) {
    if (config.cors.whiteList.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(express.static('public/images'))
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});


//Routers
const routes = require('./routes')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
