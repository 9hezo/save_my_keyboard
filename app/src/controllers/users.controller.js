'use strict';

const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  createUser = async (req, res) => {
    let { email, password, name, phone, address, isAdmin } = req.body;
    isAdmin = isAdmin || false;

    const registerResponse = await this.usersService.createUser(email, password, name, phone, address, isAdmin);
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
