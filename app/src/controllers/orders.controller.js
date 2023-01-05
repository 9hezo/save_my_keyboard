'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  output_orders = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('orders/order', { userInfo: { name: userInfo.name, point: userInfo.point } });
    } else {
      res.render('orders/order');
    }
  };

  output_orderlists = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('orders/orderlists', { userInfo: { name: userInfo.name, point: userInfo.point } });
    } else {
      res.render('orders/orderlists');
    }
  };

  // 사장
  getlists = async (req, res) => {
    const order = await this.ordersService.findAllLists();
    res.render('orders/orderlists', { data: order });
  };

  createOrder = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo.id;

    const { kinds, details, pickup } = req.body;
    const imageUrl = req.files[0].filename;

    const response = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageUrl);

    res.status(response.code).json({ message: response.message });
  };
}

module.exports = OrdersController;
