'use strict';

const app = require('../app.js');
const SocketManager = require('../src/utils/SocketManager');
const socketManager = new SocketManager(app);

const models = require('../src/sequelize/models/index');
models.sequelize
  .sync()
  .then(() => {
    console.log('DB 연결 성공');
  })
  .catch((err) => {
    console.log('DB 연결 실패');
    console.log(err);
  });

const PORT = process.env.PORT || 3000;
socketManager.server.listen(PORT, () => {
  console.log(`server on :: ${PORT}`);
});
