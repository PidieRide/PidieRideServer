"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Partner extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Partner.init(
        {
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            phone: DataTypes.STRING,
            address: DataTypes.STRING,
            logo: DataTypes.STRING,
            status: DataTypes.STRING,
            latitude: {
                type: DataTypes.DECIMAL(10, 8), // contoh: -6.20000000
                allowNull: true,
            },
            longitude: {
                type: DataTypes.DECIMAL(11, 8), // contoh: 106.81666667
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Partner",
        }
    );
    return Partner;
};
