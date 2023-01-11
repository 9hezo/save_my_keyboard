'use strict';

const OrdersService = require('../services/orders.service');

class OrdersOutputController {
  ordersService = new OrdersService();

  request = (req, res) => {
    if (res.locals.userInfo) {
      if(res.locals.userInfo.admin == 0) {
        const userInfo = res.locals.userInfo;
        res.render('index', { components: 'orderRequest', userInfo });
      }
      else {
        res.render('index');
        // res.status(401).json({ message: '권한이 없습니다.' });
      }
    
    } else {
      res.render('index', { components: 'orderRequest' });
    }
  };

  // 사장
  getlists = async (req, res) => {
    const order = await this.ordersService.findAllLists();
    res.render('orders/orderlists', { data: order });
  };
}

module.exports = OrdersOutputController;
