'use strict';

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../sequelize/models/index');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

class OrdersRepository {
  constructor(ordersModel, usersModel) {
    this.ordersModel = ordersModel;
    this.usersModel = usersModel;
  }

  findAllLists = async () => {
    return await this.ordersModel.findAll();
  };

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    try {
      const result = await this.ordersModel.create({ ownerId, kinds, details, pickup, imageUrl });
      return result.id;
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  getOrderStatusZeroToThree = async (ownerId) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status != 5 
                    AND status != 4 
                    AND ownerId = ?
                  LIMIT 1
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };

  getOrdersStatusEnd = async (ownerId) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status = 5 
                    OR status = 4 
                    AND ownerId = ?
                  ORDER BY id DESC
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };

  pointDeduct = async (id, point) => {
    try {
      await this.usersModel.decrement({ point }, { where: { id } });
      return true;
    } catch (err) {
      return false;
    }
  };
}

module.exports = OrdersRepository;
