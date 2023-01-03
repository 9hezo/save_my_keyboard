'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  output_orders = (req, res) => {
    res.render('orders/order');
  };

  output_orderlists = (req, res) => {
    res.render('orders/orderlists');
  };

  getlists = async (req, res) => {
    const Order = await this.ordersService.findAllLists();

    res.status(201).json({ data: Order });
  };

  getorders = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo.id;

    const Order = await this.ordersService.findOrderById(ownerId);

    res.status(201).json({ data: Order });
  };

  createOrder = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo.id;

    const { kinds, details, pickup, imageUrl } = req.body;

    const response = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageUrl);

    res.status(response.code).json({ message: response.message });
  };
}

module.exports = OrdersController;
