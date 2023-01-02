const OrdersService = require('../services/orders.service');

class OrdersController{
    ordersService = new OrdersService();

    output_orders = (req, res) => {
        res.render('orders/order');
    };

    createOrder = async (req, res) => {
        const { ownerId, kinds, details, pickup, imageURL } = req.body;

        const response = await this.ordersService.createOrder(ownerId, kinds, details, pickup, imageURL);

        res.status(response.code).json({ message: response.message });
    };

    // getorders = async (req, res) => {
    //     const { id } = req.params;

    //     const response = await this.ordersService.findOrderById(orderId);

    //     res.status(response.code).json({ message: response.message });
    // };
}

module.exports = OrdersController;