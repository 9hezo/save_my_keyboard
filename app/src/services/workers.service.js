const WorkersRepository = require('../repositories/workers.repository');

const { Order } = require('../sequelize/models');

class WorkersService {
  workersRepository = new WorkersRepository(Order);

  findOrderAllLists = async (id) => {
    const workerlists = await this.workersRepository.findOrderLists(id);

    return { imageUrl: workerlists.imageUrl, status: workerlists.status };
  };
}

module.exports = WorkersService;
