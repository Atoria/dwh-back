const usersRouter = require('../modules/user/userRouter');
const excelDataRouter = require('../modules/excel-data/ExcelDataRouter');
const reportRouter = require('../modules/reports/ReportsRouter');
const reportAccess = require('../modules/report-access/ReportAccessRouter');

module.exports = function (app) {
  app.use('/user', usersRouter);
  app.use('/excel-data', excelDataRouter)
  app.use('/reports', reportRouter)
  app.use('/report-access', reportAccess)
}