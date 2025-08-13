'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActivityLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ActivityLog.init({
    userId: DataTypes.INTEGER,
    userType: DataTypes.STRING,
    action: DataTypes.STRING,
    description: DataTypes.TEXT,
    ipAddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ActivityLog',
  });
  return ActivityLog;
};