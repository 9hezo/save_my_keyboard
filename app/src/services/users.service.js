'use strict';

require('dotenv').config();
const bcrypt = require('bcrypt');

const UsersRepository = require('../repositories/users.repository');
const { User } = require('../sequelize/models');

class UsersService {
  usersRepository = new UsersRepository(User);

  createUser = async (email, password, name, phone, address, admin, point) => {

    try {
      const findOneUserResult = await this.findOneUser(email);
      if (findOneUserResult) {
        return { code: 401, message: '이미 가입된 이메일입니다.' };
      }

      password = await this.encryptPassword(password);

      const createUserResult = await this.usersRepository.createUser(email, password, name, phone, address, admin, point);
      const response =
        createUserResult > 0
          ? { code: 201, message: '회원 가입에 성공하였습니다.' }
          : { code: 500, message: '회원 가입에 실패하였습니다.' };
      return response;

    } catch(err) {
      console.log('users.service error: ', err);
      return { code: 500, message: '회원 가입에 실패하였습니다.' };
    }
  };

  findOneUser = async (email) => {
    return await this.usersRepository.findOneUser(email);
  };

  encryptPassword = async (password) => {
    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }
}

module.exports = UsersService;
