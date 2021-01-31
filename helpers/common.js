const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const ProductTypes = require('./../modules/model').ProductType;
const RestaurantType = require('./../modules/model').RestaurantType;
const Language = require('./../modules/model').Language
const LanguageRestaurantType = require('./../modules/model').LanguageRestaurantType
const LanguageRestaurantMenu = require('./../modules/model').LanguageRestaurantMenu
const LanguageProductType = require('./../modules/model').LanguageProductType
const jwt = require('jsonwebtoken');
const jwt_secret = require('./../config').jwt_secret


helpers = async function (params) {
  let promises = []
  for (let item of params) {
    if (item === 'managerUsers') {
      promises.push(managerUsers());
    } else if (item === 'adminUsers') {
      promises.push(adminUsers());
    } else if (item === 'regularUsers') {
      promises.push(regularUsers())
    } else if (item === 'productTypes') {
      promises.push(productTypes())
    } else if (item === 'restaurantTypes') {
      promises.push(restaurantTypes())
    } else if (item === 'language') {
      promises.push(languages())
    }
  }

  let data = {};
  let results = await Promise.all(promises);

  for (let result of results) {
    for (let key in result) {
      data[key] = result[key];
    }
  }


  return data;
}

async function languages() {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await Language.findAll();

      data = data.map((elem) => {
        return {id: elem.dataValues.id, text: elem.dataValues.name}
      });

      resolve({language: data})
    } catch (e) {
      reject(e)
    }

  })
}

async function restaurantTypes() {
  return new Promise(async (resolve, reject) => {
    try {
      let restaurantTypes = await RestaurantType.findAll({
        attributes: ['id', 'languages.name'],
        include: [
          {
            model: LanguageRestaurantType,
            as: 'languages',
            attributes:['name'],
            include: [{
              model: Language,
              as: 'language',
              required: true
            }]
          }
        ],
        where: {
          deleted_at: null,
          '$languages.language.code$': Language.getBaseCountry()
        }
      });
      let data = [];

      restaurantTypes.forEach((elem) => {
        data.push({id: elem.dataValues.id, text: elem.dataValues.languages[0].dataValues.name})
      })

      resolve({restaurantTypes: data});

    } catch (e) {
      reject(e);
    }
  })
}


async function productTypes() {
  return new Promise(async (resolve, reject) => {
    try {
      let productTypes = await ProductTypes.findAll({
        include: [
          {
            model: LanguageProductType,
            as: 'languageProductType',
            attributes: ['id', 'name'],
            include: [{
              model: Language,
              as: 'language',
              attributes:['name'],
              required: true
            }]
          }
        ],
        where: {
          deleted_at: null,
          '$languageProductType.language.code$': Language.getBaseCountry()
        }
      });
      let data = [];
      productTypes.forEach((elem) => {
        data.push({id: elem.dataValues.id, text:elem.dataValues.languageProductType[0].dataValues.name})
      })

      resolve({productTypes: data});

    } catch (e) {
      reject(e);
    }
  })
}


async function regularUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.findAll({where: {deleted_at: null, role: User.getUserRole()}});
      let data = [];

      for (let user of users) {
        data.push({id: user.dataValues.id, text: user.dataValues.first_name + ' ' + user.dataValues.last_name});
      }

      resolve({regularUsers: data});

    } catch (e) {
      reject(e)
    }
  })
}

async function adminUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.findAll({where: {deleted_at: null, role: User.getAdminRole()}});
      let data = [];

      for (let user of users) {
        data.push({id: user.dataValues.id, text: user.dataValues.first_name + ' ' + user.dataValues.last_name});
      }

      resolve({adminUsers: data});

    } catch (e) {
      reject(e)
    }
  })
}

async function managerUsers() {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await User.findAll({where: {deleted_at: null, role: User.getManagerRole()}});
      let data = [];

      for (let user of users) {
        data.push({id: user.dataValues.id, text: user.dataValues.first_name + ' ' + user.dataValues.last_name});
      }

      resolve({managerUsers: data});

    } catch (e) {
      reject(e)
    }
  })
}


module.exports = {
  helpers
}
