'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'ownerId' });
      this.belongsTo(models.User, { foreignKey: 'workerId' });
      this.hasOne(models.Review, { foreignKey: 'orderId' });
    }
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
