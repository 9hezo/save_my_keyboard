'use strict';

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../sequelize/models/index');
const Sequelize = require('sequelize');
const op = Sequelize.Op;

class OrdersRepository {
  constructor(ordersModel) {
    this.ordersModel = ordersModel;
  }

  findAllLists = async () => {
    return await this.ordersModel.findAll();
  };

  findOrderById = async (ownerId) => {
    return await this.ordersModel.findAll({ where: { ownerId: ownerId } });
  };

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    return await this.ordersModel.create({ ownerId, kinds, details, pickup, imageUrl });
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
}

module.exports = OrdersRepository;
