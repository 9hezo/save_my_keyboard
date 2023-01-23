'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  createOrder = async (req, res) => {
    const ownerId = res.locals.userInfo ? res.locals.userInfo.id : null;

    const { kinds, details, pickup } = req.body;
    const imageUrl = req.files.length > 0 ? req.files[0].filename : null;

    const response = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageUrl);
    res.status(response.code).json({ message: response.message });
  };

  updateStatus = async (req, res) => {
    const userId = res.locals.userInfo ? res.locals.userInfo.id : null;

    const { orderId } = req.params;
    const { status_before, status_after } = req.body;

    const response = await this.ordersService.updateStatus(orderId, userId, status_before, status_after);
    res.status(response.code).json({ message: response.message });
  };

  statusupdate = async (req, res) => {
    const workerId = res.locals.userInfo.id;
    const { ownerId } = req.params;

    const changestatus = await this.ordersService.alterStatus(ownerId, workerId);
    res.render('users/admin', { data: changestatus });
  };
}

module.exports = OrdersController;
