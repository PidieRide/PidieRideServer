"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Customer.init(
        {
            fullName: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            profileImage: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Customer",
        }
    );
    Customer.beforeCreate(async function (user) {
        user.password = await hashPassword(user.password);
    });
    return Customer;
};
