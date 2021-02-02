'use strict';
const Sequelize = require('sequelize');


class ExcelDataModel extends Sequelize.Model {
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
      USER_ID: {
        type: DataTypes.INTEGER
      },
      ROW_TYPE: {
        type: DataTypes.INTEGER
      },
      FIELD1_VALUE: {
        type: DataTypes.STRING
      },
      FIELD2_VALUE: {
        type: DataTypes.STRING
      },
      FIELD3_VALUE: {
        type: DataTypes.STRING
      },
      FIELD4_VALUE: {
        type: DataTypes.STRING
      },
      FIELD5_VALUE: {
        type: DataTypes.STRING
      },
      FIELD6_VALUE: {
        type: DataTypes.STRING
      },
      FIELD7_VALUE: {
        type: DataTypes.STRING
      },
      FIELD8_VALUE: {
        type: DataTypes.STRING
      },
      FIELD9_VALUE: {
        type: DataTypes.STRING
      },
      FIELD10_VALUE: {
        type: DataTypes.STRING
      },
      SESSION_ID: {
        type: DataTypes.STRING
      },
      REPORT_ID: {
        type: DataTypes.INTEGER
      },
      IMPORT_DATE: {
        type: DataTypes.DATE
      }

    }
  }

  getJson() {
    return {
      user_id: this.dataValues.USER_ID,
      row_type: this.dataValues.ROW_TYPE,
      field1_value: this.dataValues.FIELD1_VALUE,
      field2_value: this.dataValues.FIELD2_VALUE,
      field3_value: this.dataValues.FIELD3_VALUE,
      field4_value: this.dataValues.FIELD4_VALUE,
      field5_value: this.dataValues.FIELD5_VALUE,
      field6_value: this.dataValues.FIELD6_VALUE,
      field7_value: this.dataValues.FIELD7_VALUE,
      field8_value: this.dataValues.FIELD8_VALUE,
      field9_value: this.dataValues.FIELD9_VALUE,
      field10_value: this.dataValues.FIELD10_VALUE,
    }
  }

  static getOptions(sequelize) {
    return {
      tableName: 'EXCEL_DATA',
      sequelize,
      timestamps: false
    }
  }

}

module.exports = ExcelDataModel;
