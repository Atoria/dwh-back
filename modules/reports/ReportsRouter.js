const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');
const Reports = require('./../model').Reports;
const User = require('./../model').User;
const sequelize = require('./../model').sequelize;
const excelHelper = require('./../../helpers/excelHelper')
const sessionLogHelper = require('./../../helpers/sessionLogHelper')
const excel = require("exceljs");
const ReportAccess = require('./../model').ReportAccess;
const SessionLog = require('./../model').SessionLog;

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

router.post('/abort', async (req, res, next) => {
    try {

        await sessionLogHelper.updateEntryStatus({
            STATUS: SessionLog.getStatusAbort(),
            ABORT_DATE: Date.now()
        }, req.body.session_id)

        return res.send({success: true})
    } catch (e) {
        return res.send({success: false})
    }

});

router.post('/import', async (req, res, next) => {
    let user = req.user.dataValues;


    try {
        if (req.files.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
            return res.send({success: false, error: 'Incorrect file type'});
        }

        let isImporting = await SessionLog.findOne({
            where: {
                USER_ID: user.id,
                REPORT_ID: req.body.report_id,
                STATUS: SessionLog.getStatusPending()
            }
        })

        if (isImporting) {
            return res.send({success: false, error: 'You are already importing report.'})
        }


        await sessionLogHelper.createEntry(req.body.session_id, req.body.report_id, user.id, SessionLog.getTypeImport());

        excelHelper.parseExcel(req.files.file.data, user, req.body.report_id, req.body.session_id);
        return res.send({success: true})

        // let result = await excelHelper.parseExcel(req.files.file.data, user, req.body.report_id, req.body.session_id);
        //
        // console.log('RESULT', result);
        //
        // if (result.success) {
        //   console.log('SET COMPLETE');
        //   await sessionLogHelper.updateEntryStatus({
        //     STATUS: SessionLog.getStatusComplete(),
        //     COMPLETE_DATE: Date.now()
        //   }, req.body.session_id);
        // }
        //
        //
        // return res.send(result)

    } catch (e) {
        console.log(e);
        await sessionLogHelper.updateEntryStatus({
            STATUS: SessionLog.getStatusFailed()
        }, req.body.session_id);

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

router.post('/import-complete', async (req, res, next) => {
    let user = req.user.dataValues;
    try {
        await SessionLog.update({
            STATUS: SessionLog.getStatusComplete()
        }, {
            where: {
                USER_ID: user.id,
                SESSION_ID: req.body.session_id,
                STATUS: SessionLog.getStatusPending()
            }
        });

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

router.get('/import-pending', async (req, res, next) => {
    let user = req.user;

    try {

        let activeSession = await SessionLog.findOne({
            where: {
                REPORT_ID: req.query.report_id,
                USER_ID: user.dataValues.id,
                STATUS: SessionLog.getStatusPending()
            }
        })

        res.send({success: true, pending: activeSession ? activeSession.dataValues : null})
    } catch (e) {
        console.log(e);
        return res.send({success: false, error: e});
    }
})

router.get('/latest-complete-import', async (req, res, next) => {
    let user = req.user;

    try {

        let activeSession = await SessionLog.findOne({
            where: {
                REPORT_ID: req.query.report_id,
                USER_ID: user.dataValues.id,
                STATUS: SessionLog.getStatusComplete()
            },
            order: [
                ['ID', 'desc']
            ]
        })

        res.send({success: true, complete: activeSession ? activeSession.dataValues : null})
    } catch (e) {
        console.log(e);
        return res.send({success: false, error: e});
    }
})


router.get('/download-excel/:id/:session_id', async (req, res, next) => {
    try {
        let user = req.user;

        await sessionLogHelper.createEntry(req.params.session_id, null, user.id, SessionLog.getTypeGenerate());
        excelHelper.downloadExcel(user.dataValues.id, req.params.id, req.params.session_id);
        return res.send({success: true})
    } catch (e) {
        await sessionLogHelper.updateEntryStatus({
            STATUS: SessionLog.getStatusFailed()
        }, req.body.session_id);
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