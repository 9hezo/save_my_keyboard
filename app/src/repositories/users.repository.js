'use strict';

class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser = async (email, password, name, phone, address) => {
    const user = await this.usersModel.create();

    return user;
  };
}

module.exports = UsersRepository;
