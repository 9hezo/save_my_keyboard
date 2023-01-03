'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {}
  }
  Order.init(
    {
      ownerId: DataTypes.INTEGER,
      workerId: DataTypes.INTEGER,
      kinds: DataTypes.STRING,
      details: DataTypes.TEXT,
      status: DataTypes.TINYINT,
      pickup: DataTypes.DATE,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
