'use strict';

const OrdersRepository = require('../repositories/orders.repository');
const UsersRepository = require('../repositories/users.repository');

const { Order, User } = require('../sequelize/models');
const { sequelize } = require('../sequelize/models/index');
const SocketManager = require('../utils/SocketManager');
const PaginationManager = require('../utils/PaginationManager');

class OrdersService {
  ordersRepository = new OrdersRepository(Order);
  usersRepository = new UsersRepository(User);

  createOrder = async (orderInfo) => {
    const transaction = await sequelize.transaction();
    try {
      const order = await this.ordersRepository.getOrdersDoing(orderInfo.ownerId);
      if (order.length > 0) {
        return { code: 401, message: '이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.' };
      }

      await this.ordersRepository.createOrder(transaction, orderInfo);
      const transferPoint = parseInt(process.env.ORDER_PRICE);
      await this.usersRepository.decreasePoint(transaction, orderInfo.ownerId, transferPoint);

      SocketManager.alertNewOrder();
      await transaction.commit();

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

  getOrdersDoing = async (userId, isAdmin) => {
    try {
      const data = await this.ordersRepository.getOrdersDoing(userId, isAdmin);
      return { code: 200, data: data[0] };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  };

  getOrdersDone = async (ownerId, isAdmin, page) => {
    const data = await this.ordersRepository.getOrdersDone(ownerId, isAdmin, page);
    const getOrdersDoneCountAllReturnValue = await this.ordersRepository.getOrdersDoneCountAll(ownerId, isAdmin);
    const count_all = getOrdersDoneCountAllReturnValue[0].count_all;

    const paginationManager = new PaginationManager(page, count_all);

    return { code: 200, data, pagination: paginationManager.render() };
  };

  updateStatus = async (orderId, userId, status_before, status_after) => {
    const transaction = await sequelize.transaction();
    try {
      await this.ordersRepository.updateStatus(transaction, { id: orderId, status_before, status_after });

      if ((status_before == 0 && status_after === 5) || (status_before == 3 && status_after === 4)) {
        const transferPoint = parseInt(process.env.ORDER_PRICE);
        await this.usersRepository.increasePoint(transaction, userId, transferPoint);
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
