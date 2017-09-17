import MoltenSocket from '../../index';

import { makeTestMoltenInstance } from 'molten-core/dist/tests/lib/moltenTestInstance';

import { SocketIO, Server } from 'mock-socket';

let oneUp = 0;

export const initiateServer = async () => {
  const mdb = await makeTestMoltenInstance();

  const address = `http://localhost:${8000 + oneUp++}`;

  const socketServer = new Server(address);
  const clientSocket = SocketIO.connect(address);

  const options = {
    moltenInstance: mdb,
    eventBaseName: 'test:',
    socketServer: socketServer
  };

  const socket = await MoltenSocket(options);

  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });

  return {
    mdb,
    options,
    socket,
    clientSocket
  };
};
