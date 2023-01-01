'use strict';

const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  output_register = (req, res) => {
    res.render('users/register');
  };

  output_login = (req, res) => {
    res.render('users/login');
  };

  createUser = async (req, res) => {
    let { email, password, name, phone, address, admin } = req.body;
    admin = admin || false;

    // 손님일 경우 point: 1000000 설정
    // admin: false일 경우(전달값 없을 경우) 손님, admin: true일 경우 사장님
    const point = admin ? 0 : 1000000;

    // 값 체크
    // email, password, name, phone, address 빈 값 x
    // email 형식 체크
    // password 자릿수 체크(너무 길지 않게 -> 몇자리까지 암호화 안전한지?)
    // phone 숫자만인지, 자리수 맞는지
    // address 최대글자 확인

    const response = await this.usersService.createUser(email, password, name, phone, address, admin, point);
    res.status(response.code).json({ message: response.message });
  };

  login = async (req, res) => {
    let { email, password } = req.body;

    const response = await this.usersService.login(email, password);
    if (response.code == 200) {
      res.cookie('accessToken', response.accessToken);
      res.cookie('refreshToken', response.refreshToken);
    }
    res.status(response.code).json({ message: response.message });
  };

  logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  };
}

module.exports = UsersController;
