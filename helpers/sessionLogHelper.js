const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const ExcelData = require('./../modules/model').ExcelData;
const Reports = require('./../modules/model').Reports;
const SessionLog = require('./../modules/model').SessionLog;


createEntry = async function (sessionId, reportId, userId,type) {
  try {

    await SessionLog.create({
      TYPE: type,
      SESSION_ID: sessionId,
      REPORT_ID: reportId,
      USER_ID: userId,
      STATUS: SessionLog.getStatusPending(),
      CREATE_DATE: Date.now()
    })
    return true
  } catch (e) {
    return false
  }
}

updateEntryStatus = async function (data, sessionId) {
  try {
    await SessionLog.update({
      ...data
    }, {
      where: {
        SESSION_ID: sessionId
      }
    })

    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  createEntry,
  updateEntryStatus
}
