require('dotenv').config();
const bcrypt = require('bcrypt');

const UsersService = require('../../../src/services/users.service');
const TokenManager = require('../../../src/utils/TokenManager');
const redisClient = require('../../../src/utils/redis.util');

const mockUsersRepository = {
  createUser: jest.fn(),
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
};

const usersService = new UsersService();
usersService.usersRepository = mockUsersRepository;

const mockUserInfo = {
  id: 1,
  email: 'test@gmail.com',
  password: 'password',
  name: 'name',
  phone: '01012345678',
  address: 'address',
  isAdmin: false,
};

describe('users.service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('users.service createUser Method Fail - already registered', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = 'test';
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    const response = await usersService.createUser(userInfo);

    expect(response).toEqual({ code: 401, message: '이미 가입된 이메일입니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test('users.service createUser Method Success - isAdmin: false', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = null;
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    const response = await usersService.createUser(userInfo);

    expect(response).toEqual({ code: 201, message: '회원 가입에 성공하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(userInfo);
  });

  test('users.service createUser Method Success - isAdmin: true', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = null;
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    userInfo.isAdmin = true;
    const response = await usersService.createUser(userInfo);

    expect(response).toEqual({ code: 201, message: '회원 가입에 성공하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(userInfo);
  });

  test('users.service createUser Method fail - DB error (1)', async () => {
    const userInfo = { ...mockUserInfo };

    mockUsersRepository.findOneByEmail = jest.fn(() => {
      throw new Error('test');
    });

    const response = await usersService.createUser(userInfo);

    expect(response).toEqual({ code: 500, message: '회원 가입에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(0);
  });

  test('users.service createUser Method fail - DB error (2)', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = null;
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    mockUsersRepository.createUser = jest.fn(() => {
      throw new Error('test');
    });

    const response = await usersService.createUser(userInfo);

    expect(response).toEqual({ code: 500, message: '회원 가입에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
    expect(mockUsersRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.createUser).toHaveBeenCalledWith(userInfo);
  });

  test(`users.service login Method fail - user not found`, async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = null;
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 400, message: '이메일 또는 비밀번호를 확인해주세요.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - Incorrect password`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    const response = await usersService.login(userInfo.email, userInfo.password + 'wrong');

    expect(response).toEqual({ code: 400, message: '이메일 또는 비밀번호를 확인해주세요.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method success`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    TokenManager.createAccessToken = jest.fn(() => {
      return 'accessToken';
    });
    TokenManager.createRefreshToken = jest.fn(() => {
      return 'refreshToken';
    });
    const accessToken = TokenManager.createAccessToken(userInfo.id);
    const refreshToken = TokenManager.createRefreshToken();

    redisClient.set = jest.fn(() => {});
    redisClient.expire = jest.fn(() => {});

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 200, accessToken, refreshToken, message: '로그인 되었습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - error (1)`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    TokenManager.createAccessToken = jest.fn(() => {
      return 'accessToken';
    });
    TokenManager.createRefreshToken = jest.fn(() => {
      return 'refreshToken';
    });

    redisClient.set = jest.fn(() => {});
    redisClient.expire = jest.fn(() => { throw new Error(); });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 500, message: '로그인에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - error (2)`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    TokenManager.createAccessToken = jest.fn(() => {
      return 'accessToken';
    });
    TokenManager.createRefreshToken = jest.fn(() => {
      return 'refreshToken';
    });

    redisClient.set = jest.fn(() => { throw new Error(); });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 500, message: '로그인에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - error (3)`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });
    
    TokenManager.createAccessToken = jest.fn(() => {
      return 'accessToken';
    });
    TokenManager.createRefreshToken = jest.fn(() => {
      throw new Error();
    });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 500, message: '로그인에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - error (4)`, async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const findOneByEmailReturnValue = { id: 1, password: afterPassword };
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });

    TokenManager.createAccessToken = jest.fn(() => {
      throw new Error();
    });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 500, message: '로그인에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test(`users.service login Method fail - error (5)`, async () => {
    const userInfo = { ...mockUserInfo };

    mockUsersRepository.findOneByEmail = jest.fn(() => {
      throw new Error();
    });

    const response = await usersService.login(userInfo.email, userInfo.password);

    expect(response).toEqual({ code: 500, message: '로그인에 실패하였습니다.' });
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test('users.service findOneByEmail Method success', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByEmailReturnValue = 'test';
    mockUsersRepository.findOneByEmail = jest.fn(() => {
      return findOneByEmailReturnValue;
    });
    const result = await usersService.findOneByEmail(userInfo.email);

    expect(result).toEqual(findOneByEmailReturnValue);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneByEmail).toHaveBeenCalledWith(userInfo.email);
  });

  test('users.service findOneById Method success', async () => {
    const userInfo = { ...mockUserInfo };

    const findOneByIdReturnValue = 'test';
    mockUsersRepository.findOneById = jest.fn(() => {
      return findOneByIdReturnValue;
    });
    const result = await usersService.findOneById(userInfo.id);

    expect(result).toEqual(findOneByIdReturnValue);
    expect(mockUsersRepository.findOneById).toHaveBeenCalledTimes(1);
    expect(mockUsersRepository.findOneById).toHaveBeenCalledWith(userInfo.id);
  });

  test('users.service encryptPassword Method success', async () => {
    const userInfo = { ...mockUserInfo };

    const afterPassword = await usersService.encryptPassword(userInfo.password);
    const result = await bcrypt.compare(userInfo.password, afterPassword);

    expect(result).toEqual(true);
  });

  test('users.service checkPassword Method success - correct password', async () => {
    const userInfo = { ...mockUserInfo };

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const afterPassword = await bcrypt.hash(userInfo.password, saltRounds);

    const result = await usersService.checkPassword(userInfo.password, afterPassword);

    expect(result).toEqual(true);
  });

  test('users.service checkPassword Method success - incorrect password', async () => {
    const userInfo = { ...mockUserInfo };

    const saltRounds = parseInt(process.env.BCRYPT_SALT);
    const afterPassword = await bcrypt.hash(userInfo.password+'wrong', saltRounds);

    const result = await usersService.checkPassword(userInfo.password, afterPassword);

    expect(result).toEqual(false);
  });
});