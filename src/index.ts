import SocketIO from 'socket.io';

import createQueryHandler from './lib/queryHandler';

const MoltenSocket = (options: MDB.MoltenSocketOptions = {}): MDB.MoltenSocketInstance => {
  let server: SocketIO.Server;
  if (!options.eventBaseName) {
    options.eventBaseName = 'molten:';
  }

  if (!options.socketServer) {
    server = SocketIO(options.options);

    if (options.httpServer) {
      server.attach(options.httpServer);
    }
  } else {
    server = options.socketServer;
  }

  server.on('connection', (socket) => {
    socket.on(`${options.eventBaseName}query`,
        createQueryHandler(options.moltenInstance, options, socket));
  });

  if (!options.socketServer && options.httpServer) {
    server.listen();
  }

  return server;
};
export default MoltenSocket;
