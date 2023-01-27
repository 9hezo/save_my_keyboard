'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

const UsersRepository = require('../repositories/users.repository');
const { User } = require('../sequelize/models');

const TokenManager = require('../utils/TokenManager');
const redisClient = require('../utils/redis.util');

class UsersService {
  usersRepository = new UsersRepository(User);

  createUser = async (userInfo) => {
    try {
      const user = await this.findOneByEmail(userInfo.email);
      if (user) {
        return { code: 401, message: '이미 가입된 이메일입니다.' };
      }

      userInfo.point = userInfo.isAdmin ? 0 : 1000000;
      userInfo.password = await this.encryptPassword(userInfo.password);

      await this.usersRepository.createUser(userInfo);

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

      await redisClient.set(refreshToken, user.id);
      const TTL = parseInt(process.env.REDIS_REFRESH_TTL);
      await redisClient.expire(refreshToken, TTL);

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
}

module.exports = UsersService;
