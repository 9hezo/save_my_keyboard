'use strict';

require('dotenv').config();
const OrdersRepository = require('../repositories/orders.repository');
const { Order, User } = require('../sequelize/models');

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
    const order = await this.ordersRepository.getOrderStatusZeroToThree(ownerId);
    if (order.length > 0) {
      return { code: 401, message: '이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.' };
    }
    const createResult = await this.ordersRepository.createOrder(ownerId, kinds, details, pickup, imageUrl);
    if (createResult > 0) {
      const pointDeductResult = await this.ordersRepository.pointDeduct(ownerId, process.env.ORDER_PRICE);
      console.log('pointDeductResult: ', pointDeductResult);
      if (pointDeductResult) {
        return { code: 201, message: '주문에 성공하였습니다.' };
      }
    }
  };

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
