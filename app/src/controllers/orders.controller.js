'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  createOrder = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    const { id } = res.locals.userInfo;
    const { kinds, details, pickup } = req.body;
    const imageUrl = req.files.length > 0 ? req.files[0].filename : null;

    const response = await this.ordersService.createOrder(id, kinds, details, pickup, imageUrl);
    res.status(response.code).json({ message: response.message });
  };

  getOrdersWaiting = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    const page = parseInt(req.query.p || 1);

    const response = await this.ordersService.getOrdersWaiting(page);
    res.status(response.code).json(response.data? { data: response.data } : { message: response.message });
  }

  updateStatus = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }

    const { id } = res.locals.userInfo;
    const { orderId } = req.params;
    const { status_before, status_after } = req.body;

    const response = await this.ordersService.updateStatus(orderId, id, status_before, status_after);
    res.status(response.code).json({ message: response.message });
  };

  takeOrder = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }

    const { id, isAdmin } = res.locals.userInfo;
    const { orderId } = req.params;

    const response = await this.ordersService.takeOrder(orderId, id, isAdmin);
    res.status(response.code).json({ message: response.message });
  }
}

module.exports = OrdersController;
