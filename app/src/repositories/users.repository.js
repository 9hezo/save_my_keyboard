'use strict';

class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser = async (email, password, name, phone, address, isAdmin, point) => {
    return await this.usersModel.create({ email, password, name, phone, address, isAdmin, point });
  };

  findOneByEmail = async (email) => {
    return await this.usersModel.findOne({ where: { email } });
  };

  findOneById = async (id) => {
    return await this.usersModel.findByPk(id);
  };
}

module.exports = UsersRepository;
