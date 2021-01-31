const express = require('express');
const router = express.Router();
const User = require('./../model').User;
const ReportAccess = require('./../model').ReportAccess;
const auth = require('../../helpers/auth');
const Sequelize = require('sequelize');


router.all('/*', auth.isAuthorized, (req, res, next) => {
  next();
})

router.post('', async (req, res, next) => {
  let reportId = req.body.reportId;
  let permissions = req.body.permissions;
  ReportAccess.removeAttribute('ID');

  try {
    await ReportAccess.destroy({
      where: {
        REPORT_ID: reportId
      }
    })

    permissions = permissions.filter((permission) => {
      return permission.access
    })
      .map((permission) => {
        return {REPORT_ID: reportId, USER_ID: permission.user}
      })

    await ReportAccess.bulkCreate(permissions);

    return res.send({success: true})

  } catch (e) {
    console.log(e);
    return res.send({success: false})
  }

})


router.get('/by-report/:id', async (req, res, next) => {
  let accessData = await ReportAccess.findAll({
    where: {
      REPORT_ID: req.params.id
    }
  });

  let accessMap = {};

  accessData.forEach((item) => {
    accessMap[item.dataValues.USER_ID] = item.dataValues.REPORT_ID
  })


  let users = await User.findAll({
    where: {
      role: {[Sequelize.Op.eq]: User.getUserRole()}
    }
  });

  console.log('users', users);

  let returnData = {};
  users.forEach((user) => {
    returnData[user.dataValues.id] = false;
    console.log(user.dataValues.id);
    if (accessMap.hasOwnProperty(user.dataValues.id)) {
      returnData[user.dataValues.id] = true;
    }
  })

  console.log(accessMap);

  return res.send({success: true, data: returnData})

})


module.exports = router;
