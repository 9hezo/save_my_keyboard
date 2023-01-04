const { Order, User } = require('../sequelize/models');

class WorkersRepository {
  findOrderLists = async (id) => {
    const lists = await Order.findOne({
      where: { id },
      attributes: ['imageUrl','status'],
    });
    return lists;
  };
}
module.exports = WorkersRepository;
