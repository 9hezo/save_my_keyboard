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

  decreasePoint = async (transaction, id, transferPoint) => {
    const userInfo = await this.usersModel.findOne(
      {
        attributes: ['id', 'point'],
        where: { id },
      },
      { transaction }
    );

    if (!userInfo) {
      const err = new Error('유저가 존재하지 않습니다.');
      throw err;
    }

    userInfo.point -= transferPoint;
    if (userInfo.point < 0) {
      throw new Error('유저의 포인트가 부족합니다.');
    }
    await userInfo.save({ transaction });
  };

  increasePoint = async (transaction, id, transferPoint) => {
    const userInfo = await this.usersModel.findOne(
      {
        attributes: ['id', 'point'],
        where: { id },
      },
      { transaction }
    );

    if (!userInfo) {
      throw new Error('유저가 존재하지 않습니다.');
    }

    userInfo.point += transferPoint;
    await userInfo.save({ transaction });
  };
}

module.exports = UsersRepository;
