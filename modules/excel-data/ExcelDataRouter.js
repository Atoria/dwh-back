const express = require('express');
const router = express.Router();
const User = require('./../model').User;
const ExcelData = require('./../model').ExcelData;
const Sequelize = require('sequelize');
const moment = require('moment')
const auth = require('../../helpers/auth');

router.all('/*', auth.isAuthorized, (req, res, next) => {
  next();
})



router.get('/', async (req, res, next) => {
  let user = req.user;

  try {

    console.log(req.query);
    let header = await ExcelData.findOne({
      where: {
        SESSION_ID: req.query.session_id,
        ROW_TYPE: 1
      }
    })

    let excelData = await ExcelData.findAndCountAll({
      where: {
        SESSION_ID: req.query.session_id,
        ROW_TYPE: 2
      },
      offset: parseInt(req.query.offset),
      limit: parseInt(req.query.limit)
    })

    let rows = excelData.rows.map((elem) => {
      let dt = elem.dataValues
      dt._EDITING = false;
      return dt;
    })


    res.send({success: true, data: rows, total: excelData.count, header: header.dataValues})
  } catch (e) {
    console.log(e);
    return res.send({success: false, error: e});
  }
})

router.put('/', async (req, res, next) => {

  try {

    await ExcelData.update(req.body, {
      where: {
        ID: req.body.ID
      }
    })

    return res.send({success: true})

  } catch (e) {
    res.send({success: false, error: 'Could not delete user'})

  }

})


module.exports = router;
