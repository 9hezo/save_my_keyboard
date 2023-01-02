'use strict';

const { Order } = require('../sequelize/models');

class OrdersRepository {
    createOrder = async (ownerId, kinds, details, imageURL, pickup) => {
      const response = await Order.create({ownerId, kinds, details, imageURL, pickup});

      return response;
    }

    // findOrderById = async () => {
    //   const order = await Order.findOrderById();
  
    //   return order;
    // }
}

module.exports = OrdersRepository;