'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: 'ownerId' });
      this.hasMany(models.Order, { foreignKey: 'workerId' });
      this.hasMany(models.Token, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      point: DataTypes.INTEGER,
      isAdmin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
