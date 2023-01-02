'use strict';

const OrdersRepository = require('../repositories/orders.repository');
// const { Order } = require('../sequelize/models');
// const user = require('../sequelize/models/user');

class OrdersService {
    ordersRepository = new OrdersRepository();

    createOrder = async (ownerId, kinds, details, imageURL, pickup) => {
        const response = await this.ordersRepository.createOrder(ownerId, kinds, details, imageURL, pickup);
        // const createOrderData = await this.ordersRepository.createOrder(kinds, details, null, pickup);
        
        // return {
        //     id: createOrderData.null,
        //     ownerId:createOrderData.ownerId,
        //     kinds: createOrderData.kinds,
        //     details: createOrderData.details,
        //     pickup: createOrderData.pickup,
        //     createdAt: createOrderData.createdAt,
        //     updatedAt: createOrderData.updatedAt
        // };
        return {code:201, message: "주문에 성공하였습니다."}
    };
    
    // findOrderById = async (order_id) => {
    //     // const findOwnerData = await this.ordersRepository.findOrderById(order_id);

    
    // };  
}
module.exports = OrdersService;

