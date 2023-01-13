'use strict';

const app = require('../app.js');
const SocketManager = require('../src/config/SocketManager');
const socketManager = new SocketManager(app);

const PORT = process.env.PORT || 3000;

socketManager.server.listen(PORT, () => {
  console.log(`server on :: ${PORT}`);
});
