import SocketIO = require('socket.io');

import QueryHandler from './lib/queryHandler';

const MoltenSocket =
    (options: MDB.MoltenSocketOptions): MDB.MoltenSocketInstance => {
  let socket: SocketIO.instance;
  
  if (!options.socket) {
    socket = SocketIO();
    if (options.path) {
      socket.path(options.path);
    }
    if (options.server) {
      socket.attach(options.server);
    }
  } else {
    socket = options.socket;
  }

  // Attach listeners to socket
  socket.on(`${options.eventBaseName || ''}query`, QueryHandler);

  return socket;
};
export default MoltenSocket;
