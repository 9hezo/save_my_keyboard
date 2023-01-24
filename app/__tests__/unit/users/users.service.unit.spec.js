const UsersService = require('../../../src/services/users.service');
const TokenManager = require('../../../src/config/TokenManager');

const mockUsersRepository = {
  createUser: jest.fn(),
  findOneUser: jest.fn(),
  findUserById: jest.fn(),
};

const mockTokensRepository = {
  saveToken: jest.fn(),
};

const usersService = new UsersService();
usersService.usersRepository = mockUsersRepository;
usersService.tokensRepository = mockTokensRepository;

const params = {
  id: 1,
  email: 'test@gmail.com',
  password: 'password',
  name: 'name',
  phone: '01012345678',
  address: 'address',
  point: 0,
  isAdmin: false,
};

describe('users.service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('users.service findOneUser Method success', async () => {
    const findOneUserReturnValue = 'test';
    mockUsersRepository.findOneUser = jest.fn(() => {
      return findOneUserReturnValue;
    });
    const result = await usersService.findOneUser(params.email);

    expect(result).toEqual(findOneUserReturnValue);
    expect(mockUsersRepository.findOneUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneUser).toHaveBeenCalledWith(params.email);
  });

  test('users.service findUserById Method success', async () => {
    const findUserByIdReturnValue = 'test';
    mockUsersRepository.findUserById = jest.fn(() => {
      return findUserByIdReturnValue;
    });
    const result = await usersService.findUserById(params.id);

    expect(result).toEqual(findUserByIdReturnValue);
    expect(mockUsersRepository.findUserById).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(params.id);
  });

  test('users.service createUser Method Fail - already registed', async () => {
    const findOneUserReturnValue = 'test';
    mockUsersRepository.findOneUser = jest.fn(() => {
      return findOneUserReturnValue;
    });
    const response = await usersService.createUser(
      params.email,
      params.password,
      params.name,
      params.phone,
      params.address,
      params.isAdmin,
      params.point
    );

    expect(response).toEqual({ code: 401, message: '이미 가입된 이메일입니다.' });
  });

  test('users.service createUser Method Success', async () => {
    const findOneUserReturnValue = null;
    mockUsersRepository.findOneUser = jest.fn(() => {
      return findOneUserReturnValue;
    });

    const encryptPasswordReturnValue = 'encryptedPassword';
    usersService.encryptPassword = jest.fn(() => {
      return encryptPasswordReturnValue;
    });

    const result = 1;
    mockUsersRepository.createUser = jest.fn(() => {
      return result;
    });
    const response = await usersService.createUser(
      params.email,
      params.password,
      params.name,
      params.phone,
      params.address,
      params.isAdmin,
      params.point
    );

    expect(response).toEqual({ code: 201, message: '회원 가입에 성공하였습니다.' });
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(
      params.email,
      encryptPasswordReturnValue,
      params.name,
      params.phone,
      params.address,
      params.isAdmin,
      params.point
    );
  });

  test(`users.service login Method fail - user not found`, async () => {
    const findOneUserReturnValue = null;
    mockUsersRepository.findOneUser = jest.fn(() => {
      return findOneUserReturnValue;
    });
    const response = await usersService.login(params.email, params.password);

    expect(response).toEqual({ code: 401, message: '이메일 또는 비밀번호를 확인해주세요.' });
  });

  test(`users.service login Method fail - Incorrect password`, async () => {
    const findOneUserReturnValue = 'test';
    mockUsersRepository.findOneUser = jest.fn(() => {
      return findOneUserReturnValue;
    });
    const checkPasswordReturnValue = false;
    usersService.checkPassword = jest.fn(() => {
      return checkPasswordReturnValue;
    });

    const response = await usersService.login(params.email, params.password);

    expect(response).toEqual({ code: 401, message: '이메일 또는 비밀번호를 확인해주세요.' });
  });

  test(`users.service login Method success`, async () => {
    const user = { id: 1 };
    mockUsersRepository.findOneUser = jest.fn(() => {
      return user;
    });
    const checkPasswordReturnValue = true;
    usersService.checkPassword = jest.fn(() => {
      return checkPasswordReturnValue;
    });

    TokenManager.createAccessToken = jest.fn(() => {
      return 'accessToken';
    });
    TokenManager.createRefreshToken = jest.fn(() => {
      return 'refreshToken';
    });
    const accessToken = TokenManager.createAccessToken(params.id);
    const refreshToken = TokenManager.createRefreshToken();

    const result = 1;
    mockTokensRepository.saveToken = jest.fn(() => {
      return result;
    });
    const response = await usersService.login(params.email, params.password);

    expect(response).toEqual({ code: 200, accessToken, refreshToken, message: '로그인 되었습니다.' });
    expect(mockTokensRepository.saveToken).toHaveBeenCalledTimes(1);
    expect(mockTokensRepository.saveToken).toHaveBeenCalledWith(refreshToken, user.id);
  });

  test(`users.service encryptPassword Method success`, async () => {});
});
