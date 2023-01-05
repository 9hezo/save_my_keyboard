const WorkersService = require('../services/workers.service');

class WorkersController {
  workersService = new WorkersService();

  getorderlists = async (req, res, next) => {
    const userInfo = res.locals.userInfo;
    const id = userInfo.id;

    const worklist = await this.workersService.findOrderAllLists(id);
    // res.status(200).json({ data: worklist });
    res.render('orders/workerlists', { data: worklist });
  };

  getOrderStatusZeroToThree = async (req, res) => {
    const ownerId = res.locals.userInfo.id;

    const response = await this.usersService.getOrderStatusZeroToThree(ownerId);
    if (response.data) {
      return res.status(response.code).json({ data: response.data });
    } else {
      return res.status(response.code).json({ message: response.message });
    }
  };

  getOrdersStatusEnd = async (req, res) => {
    const ownerId = res.locals.userInfo.id;

    const response = await this.usersService.getOrdersStatusEnd(ownerId);
    if (response.data) {
      return res.status(response.code).json({ data: response.data });
    } else {
      return res.status(response.code).json({ message: response.message });
    }
  };
}

module.exports = WorkersController;
