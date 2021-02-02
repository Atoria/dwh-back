'use strict';
const Sequelize = require('sequelize');
const UserRole = 'User';
const DeveloperRole = 'Developer';
const AdminRole = 'Admin'

const PendingStatus = 0;
const ActiveStatus = 1;
const DeleteStatus = 2;

const Roles = [UserRole, DeveloperRole, AdminRole];


class UserModel extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
  }

  static associate(models) {
  }


  static getAttributes(sequelize, DataTypes) {
    return {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING
      },
      first_name: {
        type: DataTypes.STRING
      },
      password_hash: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
      },
      DEL_FLAG: {
        type: DataTypes.INTEGER
      }
    }
  }

  getJson() {
    return {
      first_name: this.dataValues.first_name,
      last_name: this.dataValues.last_name,
      email: this.dataValues.email,
      role: this.dataValues.role,
      id: this.dataValues.id,
      del_flag: this.dataValues.DEL_FLAG
    }
  }

  static getOptions(sequelize) {
    return {
      tableName: 'user',
      sequelize,
      timestamps: false
    }
  }

  static getPendingStatus() {
    return PendingStatus;
  }

  static getActiveStatus() {
    return ActiveStatus;
  }

  static getDeleteStatus() {
    return DeleteStatus
  }

  static getRoles() {
    return Roles;
  }

  static getUserRole() {
    return UserRole;
  }

  static getDeveloperRole() {
    return DeveloperRole;
  }

  static getAdminRole() {
    return AdminRole;
  }
}

module.exports = UserModel;
