const UsersRepository = require('../../../src/repositories/users.repository');

const mockUsersModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
};

const usersRepository = new UsersRepository(mockUsersModel);

describe('users.repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock 초기화
  });

  test('users.repository createUser Method success', async () => {
    mockUsersModel.create = jest.fn(() => {
      return 'test';
    });

    const userInfo = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '010-1234-5678',
      address: 'address',
      isAdmin: false,
      point: 0,
    };
    await usersRepository.createUser(userInfo);

    expect(mockUsersModel.create).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.create).toHaveBeenCalledWith({
      email: userInfo.email,
      password: userInfo.password,
      name: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.address,
      isAdmin: userInfo.isAdmin,
      point: userInfo.point,
    });
  });

  test('users.repository findOneByEmail Method success', async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return 'test';
    });
    const result = await usersRepository.findOneByEmail('test@gmail.com');

    expect(result).toEqual('test');
    expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.findOne).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
  });

  test('users.repository findOneById Method success', async () => {
    mockUsersModel.findByPk = jest.fn(() => {
      return 'test';
    });
    const result = await usersRepository.findOneById(1);

    expect(result).toEqual('test');
    expect(mockUsersModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.findByPk).toHaveBeenCalledWith(1);
  });

  test('users.repository decreasePoint Method success', async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return { id: 1, point: 10000, save: () => {} };
    });

    await usersRepository.decreasePoint('transaction', 1, 10000);
    expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.findOne).toHaveBeenCalledWith(
      {
        attributes: ['id', 'point'],
        where: { id: 1 },
      },
      { transaction: 'transaction' }
    );
  });

  test(`users.repository decreasePoint Method fail - user not found`, async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return null;
    });

    try {
      await usersRepository.decreasePoint('transaction', 1, 10000);
    } catch (err) {
      expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersModel.findOne).toHaveBeenCalledWith(
        {
          attributes: ['id', 'point'],
          where: { id: 1 },
        },
        { transaction: 'transaction' }
      );
      expect(err.message).toEqual('유저가 존재하지 않습니다.');
    }
  });

  test(`users.repository decreasePoint Method fail - not enough point`, async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return { id: 1, point: 5000, save: () => {} };
    });

    try {
      await usersRepository.decreasePoint('transaction', 1, 10000);
    } catch (err) {
      expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersModel.findOne).toHaveBeenCalledWith(
        {
          attributes: ['id', 'point'],
          where: { id: 1 },
        },
        { transaction: 'transaction' }
      );
      expect(err.message).toEqual('유저의 포인트가 부족합니다.');
    }
  });

  test('users.repository increasePoint Method success', async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return { id: 1, point: 10000, save: () => {} };
    });

    await usersRepository.increasePoint('transaction', 1, 10000);
    expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.findOne).toHaveBeenCalledWith(
      {
        attributes: ['id', 'point'],
        where: { id: 1 },
      },
      { transaction: 'transaction' }
    );
  });

  test(`users.repository increasePoint Method fail - user not found`, async () => {
    mockUsersModel.findOne = jest.fn(() => {
      return null;
    });

    try {
      await usersRepository.increasePoint('transaction', 1, 10000);
    } catch (err) {
      expect(mockUsersModel.findOne).toHaveBeenCalledTimes(1);
      expect(mockUsersModel.findOne).toHaveBeenCalledWith(
        {
          attributes: ['id', 'point'],
          where: { id: 1 },
        },
        { transaction: 'transaction' }
      );
      expect(err.message).toEqual('유저가 존재하지 않습니다.');
    }
  });
});
