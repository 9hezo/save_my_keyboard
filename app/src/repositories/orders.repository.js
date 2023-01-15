'use strict';

require('dotenv').config();
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../sequelize/models/index');

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

  createOrder = async ({ ownerId, kinds, details, pickup, imageUrl }) => {
    const transferPoint = process.env.ORDER_PRICE;

    const transaction = await sequelize.transaction();
    try {
      const userInfo = await this.usersModel.findOne(
        {
          attributes: ['id', 'point'],
          where: {
            id: ownerId,
          },
        },
        { transaction }
      );

      if (!userInfo) {
        throw new Error('유저가 존재하지 않습니다.');
      }

      await this.ordersModel.create(
        {
          ownerId,
          kinds,
          details,
          pickup,
          imageUrl,
        },
        { transaction }
      );

      userInfo.point -= transferPoint;
      if (userInfo.point < 0) {
        throw new Error('유저의 포인트가 부족합니다.');
      }
      await userInfo.save({ transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw new Error(err.message);
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

  updateStatus = async (id, status_before, status_after) => {
    return await this.ordersModel.update({ status: status_after }, { where: { id, status: status_before } });
  };

  orderlist = async (workerId) => {
    const data = await this.ordersModel.findAll({ where: { workerId: workerId } });
    return data;
  };

  // updateStatus2 = async (id, status_before, status_after) => {
  //   return await this.ordersModel.update({ status: status_after }, { where: { id, status: status_before } });
  // };

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
