const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('connect', () => {
  console.log('redis connection success');
});
redisClient.on('error', (err) => {
  console.log('redis connection error');
  console.log(err);
});

redisClient.connect();

module.exports = redisClient;