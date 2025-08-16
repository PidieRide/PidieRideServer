'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    customerId: DataTypes.INTEGER,
    driverId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    totalPrice: DataTypes.DECIMAL,
    deliveryAddress: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    latitude: {
      type: DataTypes.DECIMAL(10, 8), // akurat sampai cm
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8), // akurat sampai cm
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};