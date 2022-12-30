'use strict';

const UsersService = require('../services/users.service');

class UsersController {
  usersService = new UsersService();

  output_login = (req, res) => {
    res.render('users/login');
  }

  createUser = async (req, res) => {
    // const { email, password, name, phone, address } = req.body;

    // const createUserData = await this.usersService.createUser(
    //   email,
    //   password,
    //   name,
    //   phone,
    //   address
    // );

    console.log('controller test');
    console.log(req.body);
    res.status(201).json({ data: req.body });
  };
}

module.exports = UsersController;
