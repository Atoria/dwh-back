const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const ExcelData = require('./../modules/model').ExcelData;
const Reports = require('./../modules/model').Reports;
const SessionLog = require('./../modules/model').SessionLog;


createEntry = async function (sessionId, reportId, userId, type) {
  return new Promise(async (resolve, reject) => {
    try {
      await SessionLog.create({
        TYPE: type,
        SESSION_ID: sessionId,
        REPORT_ID: reportId,
        USER_ID: userId,
        STATUS: SessionLog.getStatusPending(),
        CREATE_DATE: Date.now()
      })
      return resolve()
    } catch (e) {
      return reject()
    }
  })

}

updateEntryStatus = async function (data, sessionId) {
  return new Promise(async (resolve, reject) => {
    try {
      await SessionLog.update({
        ...data
      }, {
        where: {
          SESSION_ID: sessionId
        }
      })

      return resolve();
    } catch (e) {
      return reject();
    }
  })

}

module.exports = {
  createEntry,
  updateEntryStatus
}
