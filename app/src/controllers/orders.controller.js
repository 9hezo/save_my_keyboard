const OrdersService = require('../services/orders.service');

class OrdersController{
    ordersService = new OrdersService();

    // getorders = async (req, res, next) => {
    //     const { order_id } = req.params;
    //     const ownesrOrder = await this.ordersService.findOrderById(order_id);

    //     res.status(200).json({ data: ownersOrder });
    // };

    createOrder = async (req, res, next) => {
        const { ownerId, kinds, details, pickup, imageURL } = req.body;
        const createOrderData = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageURL);

        res.status(201).json({ createOrderData });
        // res.status(response.code).json({ message: response.message });
    };
}

module.exports = OrdersController;