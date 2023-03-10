'use strict';

class UsersRepository {
  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser = async (userInfo) => {
    await this.usersModel.create({
      email: userInfo.email,
      password: userInfo.password,
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
      isAdmin: userInfo.isAdmin,
      point: userInfo.point,
    });
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
      throw new Error('유저가 존재하지 않습니다.');
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
