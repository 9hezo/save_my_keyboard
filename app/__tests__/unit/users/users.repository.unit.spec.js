const UsersRepository = require('../../../src/repositories/users.repository');

let mockModel = {
  create: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
};

const usersRepository = new UsersRepository(mockModel);

describe('users.repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock 초기화
  });

  test('users.repository createUser Method success', async () => {
    mockModel.create = jest.fn(() => {
      return { id: 1 };
    });

    const params = {
      email: 'email',
      password: 'password',
      name: 'name',
      phone: 'phone',
      address: 'address',
      admin: false,
      point: 0,
    };
    const result = await usersRepository.createUser(
      params.email,
      params.password,
      params.name,
      params.phone,
      params.address,
      params.admin,
      params.point
    );

    expect(result).toEqual(1);
    expect(mockModel.create).toHaveBeenCalledTimes(1);
    expect(mockModel.create).toHaveBeenCalledWith({
      email: params.email,
      password: params.password,
      name: params.name,
      phone: params.phone,
      address: params.address,
      admin: params.admin,
      point: params.point,
    });
  });

  test('users.repository findOneUser Method success', async () => {
    mockModel.findOne = jest.fn(() => {
      return 'test'
    });
    const result = await usersRepository.findOneUser('test@gmail.com');

    expect(result).toEqual('test');
    expect(mockModel.findOne).toHaveBeenCalledTimes(1);
    expect(mockModel.findOne).toHaveBeenCalledWith({ where: { email: 'test@gmail.com' } });
  });

  test('users.repository findUserById Method success', async () => {
    mockModel.findByPk = jest.fn(() => {
      return 'test'
    });
    const result = await usersRepository.findUserById(1);

    expect(result).toEqual('test');
    expect(mockModel.findByPk).toHaveBeenCalledTimes(1);
    expect(mockModel.findByPk).toHaveBeenCalledWith(1);

  });

});
