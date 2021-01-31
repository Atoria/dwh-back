'use strict';
const Sequelize = require('sequelize');



class ReportAccessModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Reports, {foreignKey: 'REPORT_ID', as: 'report'})

    }


    static getAttributes(sequelize, DataTypes) {
        return {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            REPORT_ID: {
                type: DataTypes.INTEGER
            },
            USER_ID: {
                type: DataTypes.INTEGER
            },

        }
    }

    getJson() {
        return {
            id: this.dataValues.ID,
            folder_id: this.dataValues.REPORT_ID,
            user_id: this.dataValues.USER_ID
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'REPORT_ACCESS',
            sequelize,
            timestamps:false
        }
    }

}

module.exports = ReportAccessModel;
