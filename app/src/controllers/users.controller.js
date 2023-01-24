'use strict';

const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  createUser = async (req, res) => {
    let { email, password, name, phone, address, isAdmin } = req.body;
    isAdmin = isAdmin || false;

    // 손님일 경우 point: 1000000 설정
    // isAdmin: false일 경우(전달값 없을 경우) 손님, isAdmin: true일 경우 사장님
    const point = isAdmin ? 0 : 1000000;

    // 값 체크
    // email, password, name, phone, address 빈 값 x
    // email 형식 체크
    // password 자릿수 체크(너무 길지 않게 -> 몇자리까지 암호화 안전한지?)
    // phone 숫자만인지, 자리수 맞는지
    // address 최대글자 확인

    const registerResponse = await this.usersService.createUser(email, password, name, phone, address, isAdmin, point);
    if (registerResponse.code !== 201) {
      return res.status(registerResponse.code).json({ message: registerResponse.message });
    }

    const loginResponse = await this.usersService.login(email, password);
    return res.status(registerResponse.code).json({
      message: registerResponse.message,
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
    });
  };

  login = async (req, res) => {
    let { email, password } = req.body;

    const response = await this.usersService.login(email, password);

    if (response.code !== 200) {
      return res.status(response.code).json({ message: response.message });
    }

    return res.status(response.code).json({
      message: response.message,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  };

  logout = async (req, res) => {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(200).json({ message: '로그아웃 되었습니다.' });
  };

  getOrdersDoing = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(403).json({ message: '권한이 없습니다.' });
    }
    const { id, isAdmin } = res.locals.userInfo;

    const response = await this.usersService.getOrdersDoing(id, isAdmin);
    if (response.data) {
      return res.status(response.code).json({ data: response.data });
    } else {
      return res.status(response.code).json({ message: response.message });
    }
  };

  getOrdersDone = async (req, res) => {
    if (!res.locals.userInfo) {
      return res.status(401).json({ message: '권한이 없습니다.' });
    }
    const { id, isAdmin } = res.locals.userInfo;
    const page = parseInt(req.query.p || 1);

    const response = await this.usersService.getOrdersDone(id, isAdmin, page);
    if (response.data) {
      return res.status(response.code).json({ data: response.data, pagination: response.pagination });
    } else {
      return res.status(response.code).json({ message: response.message });
    }
  };
}

module.exports = UsersController;
