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

  updateStatusById = async (ownerId) => {
    const keyboardbyid = await this.ordersModel.findOne({ where: { ownerId: ownerId } });
    return keyboardbyid;
  };

  statusUpdate = async (changeStatus) => {
    const statusNow = await changeStatus.save();
    return statusNow;
  };

  findOrderById = async (ownerId) => {
    return await this.ordersModel.findAll({ where: { ownerId: ownerId } });
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

  getOrdersStatusEnd = async (ownerId, page) => {
    const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT);

    const query = `SELECT 
                    * FROM Orders 
                  WHERE (status = 5 
                    OR status = 4)
                    AND ownerId = ?
                  ORDER BY id DESC
                  LIMIT ?, ?
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId, (page - 1) * PAGE_LIMIT, PAGE_LIMIT],
    });
  };

  getOrdersStatusEndCountAll = async (ownerId) => {
    const query = `SELECT 
                    COUNT(*) AS count_all 
                  FROM Orders 
                  WHERE (status = 5 
                    OR status = 4)
                    AND ownerId = ?
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

  updateStatus = async (id, status_before, status_after) => {
    return await this.ordersModel.update({ status: status_after }, { where: { id, status: status_before } });
  };

  orderlist = async (workerId) => {
    const data = await this.ordersModel.findAll({ where: { workerId: workerId } });
    return data;
  };

  statusInduct = async (ownerId, status) => {
    try {
      await this.ordersModel.increment({ status }, { where: { ownerId, workerId } });
      return true;
    } catch (err) {
      return false;
    }
  };

  findOrderLists = async (id) => {
    const lists = await Order.findOne({
      where: { id, status: 0 },
      attributes: ['imageUrl', 'status'],
    });
    return lists;
  };
}

module.exports = OrdersRepository;
