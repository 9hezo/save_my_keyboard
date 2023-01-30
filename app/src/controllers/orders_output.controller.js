'use strict';
const OrdersService = require('../services/orders.service');

class OrdersOutputController {
  ordersService = new OrdersService();

  request = (req, res) => {
    res.render('index', {
      components: 'orders/request',
      userInfo: res.locals.userInfo ?? null,
    });
  };

  list = async (req, res) => {
    res.render('index', {
      components: 'orders/list',
      userInfo: res.locals.userInfo ?? null,
    });
  };
}

module.exports = OrdersOutputController;
