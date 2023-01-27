const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('Redis 연결 성공');
});
redisClient.on('error', () => {
  console.log('Redis 연결 실패');
});

redisClient.connect();

module.exports = redisClient;