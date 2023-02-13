const supertest = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../src/sequelize/models/index');

beforeAll(async () => {
  // 통합 테스트(Integration Test)를 진행하기에 앞서
  // Sequelize에 연결된 모든 테이블의 데이터를 삭제
  // 단, NODE_ENV가 test 환경으로 설정되어 있는 경우에만 데이터 삭제
  if (process.env.NODE_ENV === 'test') await sequelize.sync();
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});

describe('get orders Integration Test', () => {
  test('GET /api/orders/waiting API Integration Test Success', async () => {
    const response = await supertest(app).get('/api/orders/waiting').send();

    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      message: '권한이 없습니다.',
    });
  });

  test('GET /api/orders/doing API Integration Test Success', async () => {
    const response = await supertest(app).get('/api/orders/doing').send();

    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      message: '권한이 없습니다.',
    });
  });

  test('GET /api/orders/done API Integration Test Success', async () => {
    const response = await supertest(app).get('/api/orders/done').send();

    expect(response.status).toEqual(401);
    expect(response.body).toMatchObject({
      message: '권한이 없습니다.',
    });
  });
});

afterAll(async () => {
  // 통합 테스트가 완료되었을 경우 sequelize의 연결된 테이블들의 정보를 초기화(force: true)
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('NODE_ENV가 test 환경으로 설정되어 있지 않습니다.');
});
