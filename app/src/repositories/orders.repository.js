const { Order } = require('../sequelize/models');

class OrdersRepository {
    findOrderById = async () => {
      const order = await Order.findOrderById();
  
      return order;
    }
  
    createOrder = async (ownerId, kinds, details, imageURL, pickup) => {
      const createOrderData = await Order.create({ownerId, kinds, details, imageURL, pickup});
  
      return createOrderData;
    }
}

module.exports = OrdersRepository;