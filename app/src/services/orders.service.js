'use strict';

const SocketManager = require('../config/SocketManager');
const OrdersRepository = require('../repositories/orders.repository');
const { Order, User } = require('../sequelize/models');
const { sequelize } = require('../sequelize/models/index');

class OrdersService {
  ordersRepository = new OrdersRepository(Order, User);

  findAllLists = async () => {
    const allLists = await this.ordersRepository.findAllLists();

    allLists.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allLists.map((orders) => {
      return {
        ownerId: orders.ownerId,
        kinds: orders.kinds,
        details: orders.details,
        status: orders.status,
        pickup: orders.pickup,
        imageUrl: orders.imageUrl,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      };
    });
  };

  alterStatus = async (ownerId, workerId) => {
    const changeStatus = await this.ordersRepository.updateStatusById(ownerId);

    changeStatus.status = 1;
    changeStatus.workerId = workerId;

    const statusNow = await this.ordersRepository.statusUpdate(changeStatus);
    return statusNow;
  };

  findOrderById = async (ownerId) => {
    const allordersById = await this.ordersRepository.findOrderById(ownerId);

    allordersById.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allordersById.map((orders) => {
      return {
        ownerId: orders.ownerId,
        kinds: orders.kinds,
        details: orders.details,
        status: orders.status,
        pickup: orders.pickup,
        imageUrl: orders.imageUrl,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      };
    });
  };

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const transaction = await sequelize.transaction();
    try {
      const order = await this.ordersRepository.getOrderStatusZeroToThree(ownerId);
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

  updateStatus = async (orderId, userId, status_before, status_after) => {
    const transaction = await sequelize.transaction();
    try {
      if (!userId) {
        return { code: 401, message: '수정 권한이 없습니다. (로그인 필요)' };
      }

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

  orderlist = async (workerId) => {
    const orderlistdata = await this.ordersRepository.orderlist(workerId);
    return orderlistdata;
  };

  // updateStatus2 = async(orderId, ownerId, workerId, status_before, status_after) => {
  //   if (!workerId) {
  //     return { code: 401, message: '수정 권한이 없습니다. (로그인 필요)' };
  //   }

  //   const result = await this.ordersRepository.updateStatus2(orderId, ownerId, workerId, status_before, status_after);
  //   if (result[0] > 0) {
  //     return { code: 200, message: '수정 완료' };
  //   } else {
  //     return { code: 500, message: '주문 상태 변경 실패' };
  //   }
  // };

  // 안쓰는 함수
  addOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const order = await this.ordersRepository.getStatuschange(ownerId);
    order.workerId = workerId;
    await this.ordersRepository.createOrder(ownerId, kinds, details, pickup, imageUrl);
    if (statusInductResult) {
      return { code: 201, message: '주문에 성공하였습니다.' };
    }
  };

  findOrderAllLists = async (id) => {
    const workerlists = await this.ordersRepository.findOrderLists(id);

    return { imageUrl: workerlists.imageUrl, status: workerlists.status };
  };
}
module.exports = OrdersService;
