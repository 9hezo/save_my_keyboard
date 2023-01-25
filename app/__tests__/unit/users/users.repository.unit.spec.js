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
      return { id: 1 };
    });

    const params = {
      email: 'email',
      password: 'password',
      name: 'name',
      phone: 'phone',
      address: 'address',
      isAdmin: false,
      point: 0,
    };
    const result = await usersRepository.createUser(
      params.email,
      params.password,
      params.name,
      params.phone,
      params.address,
      params.isAdmin,
      params.point
    );

    expect(result).toEqual(1);
    expect(mockUsersModel.create).toHaveBeenCalledTimes(1);
    expect(mockUsersModel.create).toHaveBeenCalledWith({
      email: params.email,
      password: params.password,
      name: params.name,
      phone: params.phone,
      address: params.address,
      isAdmin: params.isAdmin,
      point: params.point,
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
});
