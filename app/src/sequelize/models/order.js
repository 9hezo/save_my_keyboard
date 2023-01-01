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
      this.belongsTo(models.User, { foreignKey: 'ownerId' });
      this.belongsTo(models.User, { foreignKey: 'workerId' });
      this.hasOne(models.Reviews, { foreignKey: 'orderId' });

    }
  }
  Order.init({
    ownerId: DataTypes.INTEGER,
    workerId: DataTypes.INTEGER,
    kinds: DataTypes.STRING,
    details: DataTypes.TEXT,
    status: DataTypes.TINYINT,
    imageUrl: DataTypes.STRING,
    pickup: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};