const UsersController = require('../../../src/controllers/users.controller');

const mockUsersService = {
  createUser: jest.fn(),
  login: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const usersController = new UsersController();
usersController.usersService = mockUsersService;

describe('users.controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockResponse.status = jest.fn(() => {
      return mockResponse;
    });
  });

  test('users.controller createUser Method success - isAdmin: false', async () => {
    const createUserBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
    };
    mockRequest.body = createUserBodyParams;

    const userInfo = {
      email: createUserBodyParams.email,
      password: createUserBodyParams.password,
      name: createUserBodyParams.name,
      phone: createUserBodyParams.phone,
      address: createUserBodyParams.address,
      isAdmin: createUserBodyParams.isAdmin || false,
    }
    const createUserResponse = { 
      code: 201, 
      message: '회원 가입에 성공하였습니다.' 
    };
    mockUsersService.createUser = jest.fn(() => {
      return createUserResponse;
    });

    const loginResponse = { 
      code: 200, 
      accessToken: 'accessToken', 
      refreshToken: 'refreshToken', 
      message: '로그인 되었습니다.' 
    };
    mockUsersService.login = jest.fn(() => {
      return loginResponse
    });

    await usersController.createUser(mockRequest, mockResponse);

    expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(userInfo);
    expect(mockUsersService.login).toHaveBeenCalledTimes(1);
    expect(mockUsersService.login).toHaveBeenCalledWith(
      createUserBodyParams.email,
      createUserBodyParams.password,
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(createUserResponse.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: createUserResponse.message,
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
    });
  });

  test('users.controller createUser Method success - isAdmin: true', async () => {
    const createUserBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
      isAdmin: true,
    };
    mockRequest.body = createUserBodyParams;

    const userInfo = {
      email: createUserBodyParams.email,
      password: createUserBodyParams.password,
      name: createUserBodyParams.name,
      phone: createUserBodyParams.phone,
      address: createUserBodyParams.address,
      isAdmin: createUserBodyParams.isAdmin || false,
    }
    const createUserResponse = { 
      code: 201, 
      message: '회원 가입에 성공하였습니다.' 
    };
    mockUsersService.createUser = jest.fn(() => {
      return createUserResponse;
    });

    const loginResponse = { 
      code: 200, 
      accessToken: 'accessToken', 
      refreshToken: 'refreshToken', 
      message: '로그인 되었습니다.' 
    };
    mockUsersService.login = jest.fn(() => {
      return loginResponse
    });

    await usersController.createUser(mockRequest, mockResponse);

    expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(userInfo);
    expect(mockUsersService.login).toHaveBeenCalledTimes(1);
    expect(mockUsersService.login).toHaveBeenCalledWith(
      createUserBodyParams.email,
      createUserBodyParams.password,
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(createUserResponse.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: createUserResponse.message,
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
    });
  });

  test('users.controller createUser Method fail - already registered', async () => {
    const createUserBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
    };
    mockRequest.body = createUserBodyParams;

    const userInfo = {
      email: createUserBodyParams.email,
      password: createUserBodyParams.password,
      name: createUserBodyParams.name,
      phone: createUserBodyParams.phone,
      address: createUserBodyParams.address,
      isAdmin: createUserBodyParams.isAdmin || false,
    }
    const createUserResponse = { 
      code: 401, 
      message: '이미 가입된 이메일입니다.' 
    };
    mockUsersService.createUser = jest.fn(() => {
      return createUserResponse;
    });

    await usersController.createUser(mockRequest, mockResponse);

    expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(userInfo);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(createUserResponse.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: createUserResponse.message,
    });
  });

  test('users.controller login Method success', async () => {
    const loginBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
    };
    mockRequest.body = loginBodyParams;

    const response = { 
      code: 200, 
      accessToken: 'accessToken', 
      refreshToken: 'refreshToken', 
      message: '로그인 되었습니다.',
    };
    mockUsersService.login = jest.fn(() => {
      return response;
    });

    await usersController.login(mockRequest, mockResponse);

    expect(mockUsersService.login).toHaveBeenCalledTimes(1);
    expect(mockUsersService.login).toHaveBeenCalledWith(loginBodyParams.email, loginBodyParams.password);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(response.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: response.message,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    });
  });

  test('users.controller login Method fail - wrong id, pw', async () => {
    const loginBodyParams = {
      email: 'test@gmail.com',
      password: 'wrong',
    };
    mockRequest.body = loginBodyParams;

    const response = { code: 400, message: '이메일 또는 비밀번호를 확인해주세요.' };
    mockUsersService.login = jest.fn(() => {
      return response;
    });

    await usersController.login(mockRequest, mockResponse);

    expect(mockUsersService.login).toHaveBeenCalledTimes(1);
    expect(mockUsersService.login).toHaveBeenCalledWith(loginBodyParams.email, loginBodyParams.password);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(response.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      message: response.message,
    });
  });
});
