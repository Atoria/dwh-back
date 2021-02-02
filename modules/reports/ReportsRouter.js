const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');
const Reports = require('./../model').Reports;
const User = require('./../model').User;
const sequelize = require('./../model').sequelize;
const excelHelper = require('./../../helpers/excelHelper')
const excel = require("exceljs");
const ReportAccess = require('./../model').ReportAccess;

router.all('/*', auth.isAuthorized, (req, res, next) => {
  next();
})

router.delete('/:id', async (req, res, next) => {
  let user = req.user;

  if (user.dataValues.role === User.getUserRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }

  let report = await Reports.findOne({
    where: {
      ID: req.params.id
    }
  });

  report.DELETE_DATE = Date.now()
  report.DELETE_USER_ID = user.dataValues.id


  await report.save()


  return res.send({success: true})


})

router.post('/', async (req, res, next) => {
  let user = req.user;


  if (user.dataValues.role === User.getUserRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }

  const t = await sequelize.transaction();
  try {
    let reportData = {
      REPORT_NAME: req.body.report_name,
      REPORT_COLOR: req.body.report_color,
      REPORT_SELECT: req.body.report_select,
      FIELD_CNT: req.body.column_number,
      REPORT_DESCR: req.body.report_descr
    };
    let index = 1;
    for (let field of req.body.fields) {
      reportData[`FIELD${index}_NAME`] = field.field_name;
      reportData[`FIELD${index}_TYPE`] = field.field_type;
      reportData[`FIELD${index}_EXTENSION`] = field.field_default;
      index++;
    }

    let report;
    reportData['UPDATE_DATE'] = Date.now()
    reportData['UPDATE_USER_ID'] = user.dataValues.id

    if (req.body.id) {
      await Reports.update(reportData, {
        where: {
          ID: req.body.id
        }
      }, {transaction: t});
      report = await Reports.findOne({where: {ID: req.body.id}})
    } else {
      reportData['CREATE_DATE'] = Date.now()
      reportData['CREATE_USER_ID'] = user.dataValues.id
      report = await Reports.create(reportData, {transaction: t});
    }


    await t.commit();

    res.send({success: true, data: report.getJson()})
  } catch (e) {
    console.log(e);
    await t.rollback();
    return res.send({success: false, error: e});
  }
})

router.post('/import', async (req, res, next) => {
  let user = req.user.dataValues;


  try {
    if (req.files.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return res.send({success: false, error: 'Incorrect file type'});
    }
    let result = await excelHelper.parseExcel(req.files.file.data, user, req.body.report_id);

    if (!result.success) {
      return res.send({success: false, error: 'Could not parse file'})
    }


    return res.send(result)

  } catch (e) {
    console.log(e);
    return res.send({success: false, error: 'Error occurred'});
  }
})

router.post('/trigger-del', async (req, res, next) => {
  let user = req.user.dataValues;

  if (user.role === User.getUserRole()) {
    return res.send({success: false, error: 'You dont have permission'})
  }

  try {
    let report = await Reports.findOne({where: {ID: req.body.id}});

    if (!report) {
      return res.send({success: false, error: 'Report Not found'});
    }

    report.DEL_FLAG = !report.DEL_FLAG;

    await report.save();


    return res.send({success: true})


  } catch (e) {
    console.log(e);
    return res.send({success: false, error: 'Error occurred'});
  }
})

router.get('/', async (req, res, next) => {
  let user = req.user;

  try {

    let reports = [];
    if (user.dataValues.role !== User.getUserRole()) {
      reports = await Reports.findAll({
        where: {
          DELETE_DATE: null
        }
      });

    } else {
      reports = await Reports.findAll({
        include: {
          model: ReportAccess,
          required: true,
          as: 'reportAccess',
          where: {
            USER_ID: user.dataValues.id,
          }
        },
        where: {
          DEL_FLAG: 0,
          DELETE_DATE: null
        }
      });
    }

    let data = reports.map((report) => report.getJson());

    res.send({success: true, data})
  } catch (e) {
    console.log(e);
    return res.send({success: false, error: e});
  }
})

router.get('/download-excel/:id/:session_id', async (req, res, next) => {
  try {
    let user = req.user;
    let buffer = await excelHelper.downloadExcel(user.dataValues.id, req.params.id, req.params.session_id);
    return res.send({success: true, buffer})
  } catch (e) {
    console.log(e);
    res.send({success: false})
  }
})

router.get('/:id', async (req, res, next) => {
  let user = req.user;

  try {

    let report = null;
    if (user.dataValues.role !== User.getUserRole()) {
      report = await Reports.findOne({
        where:
          {
            id: req.params.id,
            DELETE_DATE: null
          }
      });
    } else {
      report = await Reports.findOne({
        where:
          {
            id: req.params.id,
            DELETE_DATE: null
          },
        include: {
          model: ReportAccess,
          required: true,
          as: 'reportAccess',
        }
      });
    }


    res.send({success: true, data: report ? report.getJson() : null})
  } catch (e) {
    console.log(e);
    return res.send({success: false, error: e});
  }
})

module.exports = router;