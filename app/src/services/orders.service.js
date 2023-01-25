'use strict';

const SocketManager = require('../utils/SocketManager');
const OrdersRepository = require('../repositories/orders.repository');
const { Order, User } = require('../sequelize/models');
const { sequelize } = require('../sequelize/models/index');

class OrdersService {
  ordersRepository = new OrdersRepository(Order, User);

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const transaction = await sequelize.transaction();
    try {
      const order = await this.ordersRepository.getOrdersDoing(ownerId);
      if (order.length > 0) {
        return { code: 401, message: '이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.' };
      }

      await this.ordersRepository.createOrder(transaction, { ownerId, kinds, details, pickup, imageUrl });
      const transferPoint = parseInt(process.env.ORDER_PRICE);
      await this.ordersRepository.decreasePoint(transaction, ownerId, transferPoint);

      await transaction.commit();

      SocketManager.alertNewOrder();
      return { code: 201, message: '주문에 성공하였습니다.' };
    } catch (err) {
      await transaction.rollback();
      return { code: 403, message: err.message };
    }
  };

  getOrdersWaiting = async (page) => {
    try {
      const getOrdersWaitingReturnValue = await this.ordersRepository.getOrdersWaiting(page);
      return { code: 200, data: getOrdersWaitingReturnValue };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  };

  updateStatus = async (orderId, userId, status_before, status_after) => {
    const transaction = await sequelize.transaction();
    try {
      await this.ordersRepository.updateStatus(transaction, { id: orderId, status_before, status_after });

      if ((status_before == 0 && status_after === 5) || (status_before == 3 && status_after === 4)) {
        const transferPoint = parseInt(process.env.ORDER_PRICE);
        await this.ordersRepository.increasePoint(transaction, userId, transferPoint);
      }

      await transaction.commit();

      return { code: 200, message: '주문 상태 변경 완료' };
    } catch (err) {
      await transaction.rollback();
      return { code: 403, message: err.message };
    }
  };

  takeOrder = async (orderId, userId, isAdmin) => {
    const transaction = await sequelize.transaction();
    try {
      if (!isAdmin) {
        return { code: 403, message: '권한이 없습니다.' };
      }

      const getOrdersDoingReturnValue = await this.ordersRepository.getOrdersDoing(userId, isAdmin);
      if (getOrdersDoingReturnValue.length > 0) {
        throw new Error('이미 접수하여 진행 중인 윤활 신청이 있습니다.');
      }
      await this.ordersRepository.takeOrder(transaction, { orderId, userId });

      await transaction.commit();

      return { code: 200, message: '윤활 신청 접수 완료' };
    } catch (err) {
      await transaction.rollback();
      return { code: 403, message: err.message };
    }
  };
}
module.exports = OrdersService;
