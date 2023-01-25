'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

const UsersRepository = require('../repositories/users.repository');
const TokensRepository = require('../repositories/tokens.repository');
const OrdersRepository = require('../repositories/orders.repository');
const TokenManager = require('../utils/TokenManager');
const PaginationManager = require('../utils/PaginationManager');
const { User, Token, Order } = require('../sequelize/models');

class UsersService {
  usersRepository = new UsersRepository(User);
  tokensRepository = new TokensRepository(Token);
  ordersRepository = new OrdersRepository(Order);

  createUser = async (email, password, name, phone, address, isAdmin) => {
    try {
      const user = await this.findOneByEmail(email);
      if (user) {
        return { code: 401, message: '이미 가입된 이메일입니다.' };
      }

      const point = isAdmin ? 0 : 1000000;
      password = await this.encryptPassword(password);

      await this.usersRepository.createUser(email, password, name, phone, address, isAdmin, point);

      return { code: 201, message: '회원 가입에 성공하였습니다.' };
    } catch (err) {
      console.log(err.message);
      return { code: 500, message: '회원 가입에 실패하였습니다.' };
    }
  };

  login = async (email, password) => {
    try {
      const user = await this.findOneByEmail(email);
      if (!user) {
        return { code: 400, message: '이메일 또는 비밀번호를 확인해주세요.' };
      }

      if (!(await this.checkPassword(password, user.password))) {
        return { code: 400, message: '이메일 또는 비밀번호를 확인해주세요.' };
      }

      const accessToken = await TokenManager.createAccessToken(user.id);
      const refreshToken = await TokenManager.createRefreshToken();

      await this.tokensRepository.saveToken(refreshToken, user.id);

      return { code: 200, accessToken, refreshToken, message: '로그인 되었습니다.' };
    } catch (err) {
      console.log(err.message);
      return { code: 500, message: '로그인에 실패하였습니다.' };
    }
  };

  findOneByEmail = async (email) => {
    return await this.usersRepository.findOneByEmail(email);
  };

  findOneById = async (id) => {
    return await this.usersRepository.findOneById(id);
  };

  encryptPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    return await bcrypt.hash(password, saltRounds);
  };

  checkPassword = async (beforePassword, afterPassword) => {
    return await bcrypt.compare(beforePassword, afterPassword);
  };

  getOrdersDoing = async (userId, isAdmin) => {
    try {
      const data = await this.ordersRepository.getOrdersDoing(userId, isAdmin);
      return { code: 200, data: data[0] };
    } catch (err) {
      return { code: 500, message: err.message };
    }
  };

  getOrdersDone = async (ownerId, isAdmin, page) => {
    const data = await this.ordersRepository.getOrdersDone(ownerId, isAdmin, page);
    const getOrdersDoneCountAllReturnValue = await this.ordersRepository.getOrdersDoneCountAll(ownerId, isAdmin);
    const count_all = getOrdersDoneCountAllReturnValue[0].count_all;

    const paginationManager = new PaginationManager(page, count_all);

    return { code: 200, data, pagination: paginationManager.render() };
  };
}

module.exports = UsersService;
