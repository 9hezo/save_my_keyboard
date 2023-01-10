'use strict';

class OrdersOutputController {
  request = (req, res) => {
    if (res.locals.userInfo) {
      const userInfo = res.locals.userInfo;
      res.render('index', {
        components: 'orderRequest',
        userInfo,
      });
    } else {
      res.render('index', {
        components: 'orderRequest',
      });
    }
  };

  // 사장
  getlists = async (req, res) => {
    const order = await this.ordersService.findAllLists();
    res.render('orders/orderlists', { data: order });
  };
}

module.exports = OrdersOutputController;
