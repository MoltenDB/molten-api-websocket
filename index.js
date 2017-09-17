"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const queryHandler_1 = require("./lib/queryHandler");
const MoltenSocket = (options = {}) => {
    let server;
    if (!options.eventBaseName) {
        options.eventBaseName = 'molten:';
    }
    if (!options.socketServer) {
        server = socket_io_1.default(options.options);
        if (options.httpServer) {
            server.attach(options.httpServer);
        }
    }
    else {
        server = options.socketServer;
    }
    server.on('connection', (socket) => {
        socket.on(`${options.eventBaseName}query`, queryHandler_1.default(options.moltenInstance, options, socket));
    });
    if (!options.socketServer && options.httpServer) {
        server.listen();
    }
    return server;
};
exports.default = MoltenSocket;
//# sourceMappingURL=index.js.map