'use strict';

const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  createUser = async (req, res) => {
    let { email, password, name, phone, address, isAdmin } = req.body;
    isAdmin = isAdmin || false;
    const userInfo = { email, password, name, phone, address, isAdmin };

    const createUserResponse = await this.usersService.createUser(userInfo);
    if (createUserResponse.code !== 201) {
      return res.status(createUserResponse.code).json({ message: createUserResponse.message });
    }

    const loginResponse = await this.usersService.login(email, password);
    return res.status(createUserResponse.code).json({
      message: createUserResponse.message,
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
}

module.exports = UsersController;
