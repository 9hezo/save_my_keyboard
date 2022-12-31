'use strict';

class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser = async (email, password, name, phone, address, admin, point) => {
    try {
      const result = await this.usersModel.create({ email, password, name, phone, address, admin, point });
      return result.id; // 생성된 유저의 id값
    } catch (err) {
      console.log(err);
      return -1;
    }
  };

  findOneUser = async (email) => {
    try {
      return await this.usersModel.findOne({ where: { email } });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = UsersRepository;
