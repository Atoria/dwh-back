'use strict';
const Sequelize = require('sequelize');


const TYPE_IMPORT = 1;
const TYPE_GENERATE = 2;

const STATUS_PENDING = 1;
const STATUS_COMPLETE = 2;
const STATUS_FAILED = 3;
const STATUS_ABORT = 4;

const ABORT_LOG_FILE = 'cache/log.json'

class SessionLogModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
  }

  static associate(models) {
  }

  static getAttributes(sequelize, DataTypes) {
    return {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      TYPE: {
        type: DataTypes.INTEGER
      },
      SESSION_ID: {
        type: DataTypes.STRING
      },
      REPORT_ID: {
        type: DataTypes.INTEGER
      },
      USER_ID: {
        type: DataTypes.INTEGER
      },
      STATUS: {
        type: DataTypes.INTEGER
      },
      CREATE_DATE: {
        type: DataTypes.DATE
      },
      COMPLETE_DATE: {
        type: DataTypes.DATE
      },
      ABORT_DATE: {
        type: DataTypes.DATE
      }


    }
  }

  static getOptions(sequelize) {
    return {
      tableName: 'SESSION_LOG',
      sequelize,
      timestamps: false
    }
  }

  static getTypeImport() {
    return TYPE_IMPORT;
  }

  static getTypeGenerate() {
    return TYPE_GENERATE;
  }

  static getStatusPending() {
    return STATUS_PENDING;
  }

  static getStatusComplete() {
    return STATUS_COMPLETE;
  }

  static getStatusFailed() {
    return STATUS_FAILED;
  }

  static getStatusAbort() {
    return STATUS_ABORT;
  }

  static getLogFilePath() {
    return appRoot + '/' + ABORT_LOG_FILE;
  }

}

module.exports = SessionLogModel;
