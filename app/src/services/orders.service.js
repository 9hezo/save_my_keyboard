'use strict';

require('dotenv').config();
const OrdersRepository = require('../repositories/orders.repository');
const { Order, User } = require('../sequelize/models');

class OrdersService {
  ordersRepository = new OrdersRepository(Order, User);

  findAllLists = async () => {
    const allLists = await this.ordersRepository.findAllLists();

    allLists.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allLists.map((orders) => {
      return {
        ownerId: orders.ownerId,
        kinds: orders.kinds,
        details: orders.details,
        status: orders.status,
        pickup: orders.pickup,
        imageUrl: orders.imageUrl,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      };
    });
  };

  alterStatus = async (ownerId, workerId) => {
    const changeStatus = await this.ordersRepository.updateStatusById(ownerId);

    changeStatus.status = 1;
    changeStatus.workerId = workerId;

    const statusNow = await this.ordersRepository.statusUpdate(changeStatus);
    return statusNow;
  };

  findOrderById = async (ownerId) => {
    const allordersById = await this.ordersRepository.findOrderById(ownerId);

    allordersById.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allordersById.map((orders) => {
      return {
        ownerId: orders.ownerId,
        kinds: orders.kinds,
        details: orders.details,
        status: orders.status,
        pickup: orders.pickup,
        imageUrl: orders.imageUrl,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
      };
    });
  };

  createOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const order = await this.ordersRepository.getOrderStatusZeroToThree(ownerId);
    if (order.length > 0) {
      return { code: 401, message: '이미 대기 중이거나 진행 중인 윤활 신청이 있습니다.' };
    }

    // 주문 요청과 포인트 차감 트랜잭션으로 묶기
    const createResult = await this.ordersRepository.createOrder(ownerId, kinds, details, pickup, imageUrl);
    if (createResult > 0) {
      const pointDeductResult = await this.ordersRepository.pointDeduct(ownerId, process.env.ORDER_PRICE);
      if (pointDeductResult) {
        return { code: 201, message: '주문에 성공하였습니다.' };
      }
    }
  };

  updateStatus = async (orderId, ownerId, status_before, status_after) => {
    if (!ownerId) {
      return { code: 401, message: '수정 권한이 없습니다. (로그인 필요)' };
    }

    // id=orderId, ownerId, status=status_before 에 해당하는 order가 존재하는지 체크

    // 존재할 시 update
    const result = await this.ordersRepository.updateStatus(orderId, status_before, status_after);

    // 0(대기 중) -> 5(취소 완료)일 경우 접속자(유저)에게 포인트 반환
    // 3(배송 중) -> 4(배송 완료)일 경우 접속자(사장)에게 포인트 추가

    if (result[0] > 0) {
      return { code: 200, message: '수정 완료' };
    } else {
      return { code: 500, message: '주문 상태 변경 실패' };
    }
  };

  orderlist = async (workerId) => {
    const orderlistdata = await this.ordersRepository.orderlist(workerId);
    return orderlistdata;
  };

  // updateStatus2 = async(orderId, ownerId, workerId, status_before, status_after) => {
  //   if (!workerId) {
  //     return { code: 401, message: '수정 권한이 없습니다. (로그인 필요)' };
  //   }

  //   const result = await this.ordersRepository.updateStatus2(orderId, ownerId, workerId, status_before, status_after);
  //   if (result[0] > 0) {
  //     return { code: 200, message: '수정 완료' };
  //   } else {
  //     return { code: 500, message: '주문 상태 변경 실패' };
  //   }
  // };

  addOrder = async (ownerId, kinds, details, pickup, imageUrl) => {
    const order = await this.ordersRepository.getStatuschange(ownerId);
    order.workerId = workerId;
    await this.ordersRepository.createOrder(ownerId, kinds, details, pickup, imageUrl);
    if (statusInductResult) {
      return { code: 201, message: '주문에 성공하였습니다.' };
    }
  };

  findOrderAllLists = async (id) => {
    const workerlists = await this.ordersRepository.findOrderLists(id);

    return { imageUrl: workerlists.imageUrl, status: workerlists.status };
  };
}
module.exports = OrdersService;
