'use strict';
const OrdersService = require('../services/orders.service');

class OrdersOutputController {
  ordersService = new OrdersService();

  request = (req, res) => {
    res.render('index', {
      components: 'orderRequest',
      userInfo: res.locals.userInfo ? res.locals.userInfo : null,
    });
  };

  // 사장
  getlists = async (req, res) => {
    const order = await this.ordersService.findAllLists();
    res.render('orders/orderlists', { data: order });
  };
}

module.exports = OrdersOutputController;
