const UsersController = require('../../../src/controllers/users.controller');

const mockUsersService = {
  createUser: jest.fn(),
  login: jest.fn(),
  findOneUser: jest.fn(),
  findUserById: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
  render: jest.fn(),
  locals: jest.fn(),
  cookie: jest.fn(),
  clearCookie: jest.fn(),
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

  test('users.controller output_register Method success - userInfo exist', async () => {
    const localsUserInfoValue = { name: 'name', point: 0 };
    mockResponse.locals.userInfo = localsUserInfoValue;

    usersController.output_register(mockRequest, mockResponse);

    const path = 'users/register';
    expect(mockResponse.render).toHaveBeenCalledWith(path, { userInfo: localsUserInfoValue });
  });

  test('users.controller output_register Method success - userInfo not exist', async () => {
    const localsUserInfoValue = null;
    mockResponse.locals.userInfo = localsUserInfoValue;

    usersController.output_register(mockRequest, mockResponse);

    const path = 'users/register';
    expect(mockResponse.render).toHaveBeenCalledWith(path);
  });

  test('users.controller output_login Method success - userInfo exist', async () => {
    const localsUserInfoValue = { name: 'name', point: 0 };
    mockResponse.locals.userInfo = localsUserInfoValue;

    usersController.output_login(mockRequest, mockResponse);

    const path = 'users/login';
    expect(mockResponse.render).toHaveBeenCalledWith(path, { userInfo: localsUserInfoValue });
  });

  test('users.controller output_login Method success - userInfo not exist', async () => {
    const localsUserInfoValue = null;
    mockResponse.locals.userInfo = localsUserInfoValue;

    usersController.output_login(mockRequest, mockResponse);

    const path = 'users/login';
    expect(mockResponse.render).toHaveBeenCalledWith(path);
  });

  test('users.controller createUser Method success', async () => {
    const createUserBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
      isAdmin: false,
    };
    mockRequest.body = createUserBodyParams;

    const response = { code: 201, message: 'message' };
    mockUsersService.createUser = jest.fn(() => {
      return response;
    });

    await usersController.createUser(mockRequest, mockResponse);

    expect(mockUsersService.createUser).toHaveBeenCalledTimes(1);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(
      createUserBodyParams.email,
      createUserBodyParams.password,
      createUserBodyParams.name,
      createUserBodyParams.phone,
      createUserBodyParams.address,
      createUserBodyParams.isAdmin,
      createUserBodyParams.isAdmin ? 0 : 1000000
    );
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(response.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: response.message });
  });

  test('users.controller login Method success', async () => {
    const loginBodyParams = {
      email: 'test@gmail.com',
      password: 'password',
    };
    mockRequest.body = loginBodyParams;

    const response = { code: 200, message: 'message', accessToken: 'accessToken', refreshToken: 'refreshToken' };
    mockUsersService.login = jest.fn(() => {
      return response;
    });

    await usersController.login(mockRequest, mockResponse);

    expect(mockUsersService.login).toHaveBeenCalledTimes(1);
    expect(mockUsersService.login).toHaveBeenCalledWith(loginBodyParams.email, loginBodyParams.password);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(response.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: response.message });
  });

  test('users.controller logout Method success', async () => {
    const response = { code: 200, message: '로그아웃 되었습니다.' };

    await usersController.logout(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(response.code);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: response.message });
  });
});
