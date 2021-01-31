const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config').db;
let sequelize = {};
let models = {};
config.operatorsAliases = Sequelize.Op;

sequelize = new Sequelize(config.database, config.username, config.password, config);

function syncModel(dirname) {
  fs.readdirSync(dirname)
    .filter(file => {
      return (file.indexOf('.') < 0) || (file.indexOf('Model.js') > 0)
    })
    .map((file) => {
      if ((file.indexOf('.') !== 0) && (file.slice(-3) === '.js')) {
        let modelName = file.split('.').slice(0, -1).join('.').replace('Model', '');
        let modelClass = require(dirname + '/' + file);
        models[modelName] = modelClass.init(sequelize, Sequelize)
      } else {
        syncModel(path.resolve(dirname + '/' + file))
      }
    });
}


syncModel(path.resolve(__dirname + '/../modules'));


Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize
};
module.exports = db;
