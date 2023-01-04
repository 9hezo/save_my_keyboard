'use strict';

const OrdersRepository = require('../repositories/orders.repository');
const { Order } = require('../sequelize/models');

class OrdersService {
  ordersRepository = new OrdersRepository(Order);

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
    const order = await this.ordersRepository.getOrderStatusZeroToThree(ownerId);
    if (order) {
      return { code: 401, message: '이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.' };
    }
    const response = await this.ordersRepository.createOrder(ownerId, kinds, details, pickup, imageUrl);

    return { code: 201, message: '주문에 성공하였습니다.' };
  };
}
module.exports = OrdersService;
