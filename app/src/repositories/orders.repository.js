'use strict';

require('dotenv').config();
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../sequelize/models/index');

class OrdersRepository {
  constructor(ordersModel, usersModel) {
    this.ordersModel = ordersModel;
    this.usersModel = usersModel;
  }

  updateStatusById = async (ownerId) => {
    const keyboardbyid = await this.ordersModel.findOne({ where: { ownerId: ownerId } });
    return keyboardbyid;
  };

  statusUpdate = async (changeStatus) => {
    const statusNow = await changeStatus.save();
    return statusNow;
  };

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
    console.log('22');
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

    userInfo.point += transferPoint;
    await userInfo.save({ transaction });
  };

  updateStatus = async (transaction, { id, status_before, status_after }) => {
    console.log('11');
    console.log(id, status_before, status_after);
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

  getOrdersDoing = async (ownerId, admin) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status != 5 
                    AND status != 4 
                    AND ${admin ? 'workerId' : 'ownerId'} = ?
                  LIMIT 1
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };

  getOrdersDone = async (ownerId, admin, page) => {
    const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT);

    const query = `SELECT 
                    * FROM Orders 
                  WHERE (${!admin ? 'status = 5 OR ' : ''}status = 4)
                    AND ${admin ? 'workerId' : 'ownerId'} = ?
                  ORDER BY id DESC
                  LIMIT ?, ?
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId, (page - 1) * PAGE_LIMIT, PAGE_LIMIT],
    });
  };

  getOrdersDoneCountAll = async (ownerId, admin) => {
    const query = `SELECT 
                    COUNT(*) AS count_all 
                  FROM Orders 
                  WHERE (${!admin ? 'status = 5 OR ' : ''}status = 4)
                    AND ${admin ? 'workerId' : 'ownerId'} = ?
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };
}

module.exports = OrdersRepository;
