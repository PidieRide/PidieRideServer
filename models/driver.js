"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
    class Driver extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Driver.init(
        {
            fullName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            vehicleType: DataTypes.STRING,
            vehiclePlate: DataTypes.STRING,
            licenseNumber: DataTypes.STRING,
            status: DataTypes.STRING,
            profileImage: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Driver",
        }
    );
    Driver.beforeCreate(function (user) {
        user.password = hashPassword(user.password);
    });
    return Driver;
};
