'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.belongsTo(models.Order, { foreignKey: 'orderId' });
    }
  }
  Review.init(
    {
      orderId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      score: DataTypes.TINYINT,
      imageUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );

  return Review;
};
