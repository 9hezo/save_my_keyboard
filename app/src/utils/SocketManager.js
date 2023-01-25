const http = require('http');
const SocketIO = require('socket.io');

class SocketManager {
  constructor(app) {
    this.server = http.createServer(app);
    SocketManager.wsServer = SocketIO(this.server);
    this.load();
  }
  static wsServer;

  load = () => {
    SocketManager.wsServer.on('connection', (socket) => {});
  };

  static alertNewOrder = () => {
    SocketManager.wsServer.sockets.emit('newOrder', true);
  };
}

module.exports = SocketManager;