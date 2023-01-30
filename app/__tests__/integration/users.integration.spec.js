const supertest = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../src/sequelize/models/index');
const redisClient = require('../../src/utils/redis.util');

beforeAll(async () => {
  // 통합 테스트(Integration Test)를 진행하기에 앞서
  // Sequelize에 연결된 모든 테이블의 데이터를 삭제
  // 단, NODE_ENV가 test 환경으로 설정되어 있는 경우에만 데이터 삭제
  if (process.env.NODE_ENV === 'test') await sequelize.sync();
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');

  redisClient.set = jest.fn(() => {});
  redisClient.expire = jest.fn(() => {});
});

describe('Users Domain Integration Test', () => {
  test('POST /api/users/register API Integration Test Success', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
    };

    const response = await supertest(app).post('/api/users/register').send(requestBody);

    expect(response.status).toEqual(201);
    expect(response.body).toMatchObject({
      message: '회원 가입에 성공하였습니다.',
      accessToken: expect.anything(),
      refreshToken: expect.anything(),
    });
  });

  test('POST /api/users/register API Integration Test Fail - already registered', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'password',
      name: 'name',
      phone: '01012345678',
      address: 'address',
    };

    const response = await supertest(app).post('/api/users/register').send(requestBody);

    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      message: '이미 가입된 이메일입니다.',
    });
  });

  test('POST /api/users/login API Integration Test Success', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'password',
    };

    const response = await supertest(app).post('/api/users/login').send(requestBody);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      message: '로그인 되었습니다.',
      accessToken: expect.anything(),
      refreshToken: expect.anything(),
    });
  });

  test('POST /api/users/login API Integration Test Fail - wrong id', async () => {
    const requestBody = {
      email: 'wrong@gmail.com',
      password: 'password',
    };

    const response = await supertest(app).post('/api/users/login').send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      message: '이메일 또는 비밀번호를 확인해주세요.',
    });
  });

  test('POST /api/users/login API Integration Test Fail - wrong pw', async () => {
    const requestBody = {
      email: 'test@gmail.com',
      password: 'wrong',
    };

    const response = await supertest(app).post('/api/users/login').send(requestBody);

    expect(response.status).toEqual(400);
    expect(response.body).toMatchObject({
      message: '이메일 또는 비밀번호를 확인해주세요.',
    });
  });
});

afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화(force: true)
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
