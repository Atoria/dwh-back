const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const ExcelData = require('./../modules/model').ExcelData;
const Reports = require('./../modules/model').Reports;
const xlsx = require('xlsx');
const sequelize = require('./../modules/model').sequelize;
const excel = require('exceljs');
const {QueryTypes} = require('sequelize');
require('sequelize-batches');


parseExcel = async function (buffer, user) {
  const t = await sequelize.transaction();
  try {
    ExcelData.removeAttribute('id');

    await ExcelData.destroy({
      where: {USER_ID: user.id}
    })

    console.log('Came');
    let wb = xlsx.read(buffer, {type: 'buffer'});
    console.log('Finished Reading');
    const wsname = wb.SheetNames[1];

    let savedHeader = false;
    let insertData = [];
    let headers = [];

    for (let sheetName of wb.SheetNames) {
      console.log('READING SHEET', sheetName);
      let ws = wb.Sheets[sheetName];
      let data = xlsx.utils.sheet_to_json(ws);

      for (let item of data) {
        //-------------SAVING HEADER---------------
        if (!savedHeader) {
          headers = Object.keys(item);

          if (headers.length > 10) {
            throw 'Excel Header count is more than 10';
          }

          let insertObj = {
            USER_ID: user.id,
            ROW_TYPE: 1
          };
          headers.forEach((header, index) => {
            insertObj[`FIELD${index + 1}_VALUE`] = header;
          })
          insertData.push(insertObj)
          savedHeader = true;
        }

        let dataObj = {
          USER_ID: user.id,
          ROW_TYPE: 2
        }

        headers.forEach((header, index) => {
          dataObj[`FIELD${index + 1}_VALUE`] = item[header];
        })
        insertData.push(dataObj);

        if (insertData.length > 1000) {
          console.log('EXEED INSERT');
          await ExcelData.bulkCreate(insertData, {transaction: t});
          insertData = [];
        }

      }
    }

    if (insertData.length > 0) {
      console.log('LAST INSERT');
      await ExcelData.bulkCreate(insertData, {transaction: t});
    }

    // console.log(insertData);

    console.log('FINISHED');

    await t.commit();
    return true;
  } catch (e) {
    console.log(e);
    await t.rollback();
    return false;
  }

}


downloadExcel = async function (user_id, report_id) {
  let sheetIndex = 1;
  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
  await workbook.xlsx.writeFile('test.xlsx');

  let report = await Reports.findOne({where: {ID: report_id}});

  let rawSelect = report.dataValues.REPORT_SELECT.replace("?", user_id);

  let countSelect = `SELECT count(*) as total from (${rawSelect}) as total`

  let total = await sequelize.query(countSelect, {
    type: QueryTypes.SELECT
  });

  total = total[0]['total'];
  let curr = 0;
  let limit = 1000;
  let sheetRowCount = 0;
  let isKeyMapped = false;


  while (curr < total) {
    console.log('--------------');
    workbook = new excel.Workbook();
    await workbook.xlsx.readFile('test.xlsx');
    worksheet = workbook.getWorksheet(`Sheet${sheetIndex}`);
    let beforeSelect = Date.now();

    console.log('BEFORE SELECT', beforeSelect);
    let currSelect = `${rawSelect} limit ${limit} offset ${curr}`
    let records = await sequelize.query(currSelect, {
      type: QueryTypes.SELECT
    });

    let afterSelect = Date.now();
    console.log('AFTER SELECT', afterSelect);
    console.log('SELECT DIFF=' + (afterSelect - beforeSelect))


    if (!isKeyMapped) {
      let header = records.length ? records[0] : {}
      let excelColumns = [];
      Object.keys(header).forEach((head) => {
        excelColumns.push({header: head, key: head, width: 30})
      })
      worksheet.columns = excelColumns;
    }

    console.log('BEFORE INSERT EXCEL', Date.now());
    let beforeInsert = Date.now();

    records.forEach((record) => {
      worksheet.addRow(record);
    })

    console.log('AFTER INSERT EXCEL', Date.now());
    let afterInsert = Date.now();

    console.log('INSERT EXCEL DIFF=' + (afterInsert - beforeInsert))


    sheetRowCount += limit;
    curr += limit;

    if (sheetRowCount > 100) {
      sheetIndex++;
      worksheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
      sheetRowCount = 0;
    }

    await workbook.xlsx.writeFile('test.xlsx');


    console.log('CURRENTLY ON', curr);

  }

  return await workbook.xlsx.writeBuffer()
}

module.exports = {
  parseExcel,
  downloadExcel
}
