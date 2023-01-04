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
}

module.exports = WorkersController;
