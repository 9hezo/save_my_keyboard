'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  output_orders = (req, res) => {
    res.render('orders/order');
  };

  // 사장
  getlists = async (req, res) => {
    const order = await this.ordersService.findAllLists();
    res.render('orders/orderlists', { data: order })
  };

  // 손님
  getorders = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo.id;

    const order = await this.ordersService.findOrderById(ownerId);

    res.render('orders/mylists', { data: order });
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
