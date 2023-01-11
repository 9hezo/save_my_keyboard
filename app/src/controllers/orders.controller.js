'use strict';

const OrdersService = require('../services/orders.service');

class OrdersController {
  ordersService = new OrdersService();

  // 윤활 신청
  createOrder = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo ? userInfo.id : null;

    const { kinds, details, pickup } = req.body;
    const imageUrl = req.files.length > 0 ? req.files[0].filename : null;

    const response = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageUrl);
    res.status(response.code).json({ message: response.message });
  };

  // 주문 상태 변경
  updateStatus = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo ? userInfo.id : null;

    const { orderId } = req.params;
    const { status_before, status_after } = req.body;

    const response = await this.ordersService.updateStatus(orderId, ownerId, status_before, status_after);
    res.status(response.code).json({ message: response.message });
  };

  // 사장 마이페이지
  orderlist = async (req, res) => {
    const workerId = res.locals.userInfo.id;
    const orderlistdata = await this.ordersService.orderlist(workerId);
    console.log(orderlistdata);
    res.status(200).json({orderlistdata});
  };

  // 윤활 신청 목록 페이지
  getorderlists = async (req, res, next) => {
    const userInfo = res.locals.userInfo;
    const id = userInfo.id;

    const worklist = await this.ordersService.findOrderAllLists(id);
    // res.status(200).json({ data: worklist });
    res.render('orders/workerlists', { data: worklist });
  };

  // 손님 마이페이지
  getorders = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const ownerId = userInfo ? userInfo.id : null;

    const order = await this.ordersService.findOrderById(ownerId);

    res.render('orders/mylists', { data: order });
  };

  // 상태 업데이트
  statusupdate = async (req, res) => {
    const userInfo = res.locals.userInfo;
    const workerId = userInfo.id;
    const { ownerId } = req.params;

    const changestatus = await this.ordersService.alterStatus(ownerId, workerId);

    res.render('users/admin', { data: changestatus });
  };
}

module.exports = OrdersController;
