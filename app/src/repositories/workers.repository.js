const { Order } = require('../sequelize/models');

class WorkersRepository {
  findOrderLists = async (id) => {
    const lists = await Order.findOne({
      where: { id, status: 0 },
      attributes: ['imageUrl','status'],
    });
    return lists;
  };

  getOrderStatusZeroToThree = async (ownerId) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status != 5 
                    AND status != 4 
                    AND ownerId = ?
                  LIMIT 1
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };

  getOrdersStatusEnd = async (ownerId) => {
    const query = `SELECT 
                    * FROM Orders 
                  WHERE status = 5 
                    OR status = 4 
                    AND ownerId = ?
                  ORDER BY id DESC
                  ;`;
    return await sequelize.query(query, {
      type: QueryTypes.SELECT,
      replacements: [ownerId],
    });
  };
}
module.exports = WorkersRepository;
