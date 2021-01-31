const config = require('./config.json');
process.env.NODE_ENV = process.env.NODE_ENV || config.env;

module.exports = config[process.env.NODE_ENV];
