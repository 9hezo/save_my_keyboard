'use strict';

require('dotenv').config();
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../sequelize/models/index');

class OrdersRepository {
  constructor(ordersModel, usersModel) {
    this.ordersModel = ordersModel;
    this.usersModel = usersModel;
  }

  createOrder = async (transaction, { ownerId, kinds, details, pickup, imageUrl }) => {
    await this.ordersModel.create({ ownerId, kinds, details, pickup, imageUrl }, { transaction });
  };

  decreasePoint = async (transaction, id, transferPoint) => {
    const userInfo = await this.usersModel.findOne(
      {
        attributes: ['id', 'point'],
        where: { id },
      },
      { transaction }
    );

    if (!userInfo) {
      const err = new Error('유저가 존재하지 않습니다.');
      throw err;
    }

    userInfo.point -= transferPoint;
    if (userInfo.point < 0) {
      throw new Error('유저의 포인트가 부족합니다.');
    }
    await userInfo.save({ transaction });
  };

  increasePoint = async (transaction, id, transferPoint) => {
    const userInfo = await this.usersModel.findOne(
      {
        attributes: ['id', 'point'],
        where: { id },
      },
      { transaction }
    );

    if (!userInfo) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    userInfo.point += transferPoint;
    await userInfo.save({ transaction });
  };

  takeOrder = async (transaction, { orderId, userId }) => {
    const orderInfo = await this.ordersModel.findOne(
      {
        where: {
          id: orderId,
          workerId: null,
          status: 0,
        },
      },
      { transaction }
    );

    if (!orderInfo) {
      throw new Error('윤활 신청 정보가 존재하지 않습니다.');
    }

    orderInfo.workerId = userId;
    orderInfo.status += 1;
    await orderInfo.save({ transaction });
  };

  updateStatus = async (transaction, { id, status_before, status_after }) => {
    const orderInfo = await this.ordersModel.findOne(
      {
        attributes: ['id', 'status'],
        where: { id, status: status_before },
      },
      { transaction }
    );

    if (!orderInfo) {
      throw new Error('요청한 상태의 주문이 존재하지 않습니다.');
    }

    orderInfo.status = status_after;
    await orderInfo.save({ transaction });
  };

  getOrdersWaiting = async (page) => {
    const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT);

    return await this.ordersModel.findAll({
      where: { status: 0 },
      order: [['id', 'ASC']],
      offset: (page - 1) * PAGE_LIMIT,
      limit: PAGE_LIMIT,
    });
  };

  getOrdersDoing = async (userId, isAdmin) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status != 5 
                    AND status != 4 
                    AND ${isAdmin ? 'workerId' : 'ownerId'} = ?
                  LIMIT 1
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId],
    });
  };

  getOrdersDone = async (userId, isAdmin, page) => {
    const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT);

    const query = `SELECT 
                    * FROM Orders 
                  WHERE (${!isAdmin ? 'status = 5 OR ' : ''}status = 4)
                    AND ${isAdmin ? 'workerId' : 'ownerId'} = ?
                  ORDER BY updatedAt DESC
                  LIMIT ?, ?
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId, (page - 1) * PAGE_LIMIT, PAGE_LIMIT],
    });
  };

  getOrdersDoneCountAll = async (userId, isAdmin) => {
    const query = `SELECT 
                    COUNT(*) AS count_all 
                  FROM Orders 
                  WHERE (${!isAdmin ? 'status = 5 OR ' : ''}status = 4)
                    AND ${isAdmin ? 'workerId' : 'ownerId'} = ?
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [userId],
    });
  };
}

module.exports = OrdersRepository;
