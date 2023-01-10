'use strict';

const app = require('../app.js');
const PORT = process.env.PORT || 3000;

const http = require('http').createServer(app);
const { Server } = require('socket.io');
// const io = new Server(http);

http.listen(PORT, () => {
  console.log(`server on :: ${PORT}`);
});
