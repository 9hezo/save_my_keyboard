'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  // 안쓰이는듯
  // output_orderlists = (req, res) => {
  //   if (res.locals.userInfo) {
  //     const userInfo = res.locals.userInfo;
  //     res.render('orders/orderlists', { userInfo: { name: userInfo.name, point: userInfo.point } });
  //   } else {
  //     res.render('orders/orderlists');
  //   }
  // };

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

  orderlist = async (req, res) => {
    const workerId = res.locals.userInfo.id;
    const orderlistdata = await this.ordersService.orderlist(workerId);
    console.log(orderlistdata);
    res.status(200).json({ orderlistdata });
  };

  // updateStatus2 = async (req, res) => {
  //   const userInfo = res.locals.userInfo;
  //   const ownerId = userInfo ? userInfo.id : null;

  //   const { orderId } = req.params;
  //   const { status_before, status_after} = req.body;

  //   const response = await this.ordersService.updateStatus2( orderId, ownerId, workerId, status_before, status_after);
  //   res.status(response.code).json({ message: response.message });
  // };

  getorderlists = async (req, res, next) => {
    const id = res.locals.userInfo.id;

    const worklist = await this.ordersService.findOrderAllLists(id);
    // res.status(200).json({ data: worklist });
    res.render('orders/workerlists', { data: worklist });
  };

  statusupdate = async (req, res) => {
    const workerId = res.locals.userInfo.id;
    const { ownerId } = req.params;

    const changestatus = await this.ordersService.alterStatus(ownerId, workerId);
    res.render('users/admin', { data: changestatus });
  };

  // 손님
  getorders = async (req, res) => {
    const ownerId = res.locals.userInfo ? res.locals.userInfo.id : null;

    const order = await this.ordersService.findOrderById(ownerId);
    res.render('orders/mylists', { data: order });
  };
}

module.exports = OrdersController;
