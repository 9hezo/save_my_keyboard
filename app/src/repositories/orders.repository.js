'use strict';

const { Order } = require('../sequelize/models');

class OrdersRepository {
  constructor(Model) {
    this.Model = Model;
  }

  findAllLists = async () => {
    const orderlists = await this.Model.findAll();

    return orderlists;
  };

  findOrderById = async (ownerId) => {
    const orders = await this.Model.findAll({ where: { ownerId: ownerId } });

    return orders;
  };

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const response = await Order.create({ ownerId, kinds, details, pickup, imageUrl });

    return response;
  };
}

module.exports = OrdersRepository;
