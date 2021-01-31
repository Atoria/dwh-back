'use strict';
const Sequelize = require('sequelize');


class ReportsModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
  }

  static associate(models) {
    this.hasMany(models.ReportAccess, {foreignKey: 'REPORT_ID', as: 'reportAccess'})
  }


  static getAttributes(sequelize, DataTypes) {
    return {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      REPORT_NAME: {
        type: DataTypes.STRING
      },
      REPORT_COLOR: {
        type: DataTypes.STRING
      },
      REPORT_SELECT: {
        type: DataTypes.STRING
      },
      FIELD_CNT: {
        type: DataTypes.INTEGER
      },
      FIELD1_TYPE: {
        type: DataTypes.STRING
      },
      FIELD2_TYPE: {
        type: DataTypes.STRING
      },
      FIELD3_TYPE: {
        type: DataTypes.STRING
      },
      FIELD4_TYPE: {
        type: DataTypes.STRING
      },
      FIELD5_TYPE: {
        type: DataTypes.STRING
      },
      FIELD6_TYPE: {
        type: DataTypes.STRING
      },
      FIELD7_TYPE: {
        type: DataTypes.STRING
      },
      FIELD8_TYPE: {
        type: DataTypes.STRING
      },
      FIELD9_TYPE: {
        type: DataTypes.STRING
      },
      FIELD10_TYPE: {
        type: DataTypes.STRING
      },
      FIELD1_NAME: {
        type: DataTypes.STRING
      },
      FIELD2_NAME: {
        type: DataTypes.STRING
      },
      FIELD3_NAME: {
        type: DataTypes.STRING
      },
      FIELD4_NAME: {
        type: DataTypes.STRING
      },
      FIELD5_NAME: {
        type: DataTypes.STRING
      },
      FIELD6_NAME: {
        type: DataTypes.STRING
      },
      FIELD7_NAME: {
        type: DataTypes.STRING
      },
      FIELD8_NAME: {
        type: DataTypes.STRING
      },
      FIELD9_NAME: {
        type: DataTypes.STRING
      },
      FIELD10_NAME: {
        type: DataTypes.STRING
      },
      FIELD1_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD2_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD3_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD4_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD5_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD6_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD7_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD8_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD9_DEFAULT: {
        type: DataTypes.STRING
      },
      FIELD10_DEFAULT: {
        type: DataTypes.STRING
      },
      DEL_FLAG: {
        type: DataTypes.INTEGER
      }

    }
  }

  getJson() {
    return {
      id: this.dataValues.ID,
      report_name: this.dataValues.REPORT_NAME,
      report_color: this.dataValues.REPORT_COLOR,
      report_select: this.dataValues.REPORT_SELECT,
      field_cnt: this.dataValues.FIELD_CNT,
      field1_type: this.dataValues.FIELD1_TYPE,
      field2_type: this.dataValues.FIELD2_TYPE,
      field3_type: this.dataValues.FIELD3_TYPE,
      field4_type: this.dataValues.FIELD4_TYPE,
      field5_type: this.dataValues.FIELD5_TYPE,
      field6_type: this.dataValues.FIELD6_TYPE,
      field7_type: this.dataValues.FIELD7_TYPE,
      field8_type: this.dataValues.FIELD8_TYPE,
      field9_type: this.dataValues.FIELD9_TYPE,
      field10_type: this.dataValues.FIELD10_TYPE,
      field1_name: this.dataValues.FIELD1_NAME,
      field2_name: this.dataValues.FIELD2_NAME,
      field3_name: this.dataValues.FIELD3_NAME,
      field4_name: this.dataValues.FIELD4_NAME,
      field5_name: this.dataValues.FIELD5_NAME,
      field6_name: this.dataValues.FIELD6_NAME,
      field7_name: this.dataValues.FIELD7_NAME,
      field8_name: this.dataValues.FIELD8_NAME,
      field9_name: this.dataValues.FIELD9_NAME,
      field10_name: this.dataValues.FIELD10_NAME,
      field1_default: this.dataValues.FIELD1_DEFAULT,
      field2_default: this.dataValues.FIELD2_DEFAULT,
      field3_default: this.dataValues.FIELD3_DEFAULT,
      field4_default: this.dataValues.FIELD4_DEFAULT,
      field5_default: this.dataValues.FIELD5_DEFAULT,
      field6_default: this.dataValues.FIELD6_DEFAULT,
      field7_default: this.dataValues.FIELD7_DEFAULT,
      field8_default: this.dataValues.FIELD8_DEFAULT,
      field9_default: this.dataValues.FIELD9_DEFAULT,
      field10_default: this.dataValues.FIELD10_DEFAULT,
      del_flag: this.dataValues.DEL_FLAG
    }
  }

  static getOptions(sequelize) {
    return {
      tableName: 'REPORTS',
      sequelize,
      timestamps: false
    }
  }

}

module.exports = ReportsModel;
