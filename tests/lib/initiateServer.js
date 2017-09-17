"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
const moltenTestInstance_1 = require("molten-core/dist/tests/lib/moltenTestInstance");
const mock_socket_1 = require("mock-socket");
let oneUp = 0;
exports.initiateServer = () => __awaiter(this, void 0, void 0, function* () {
    const mdb = yield moltenTestInstance_1.makeTestMoltenInstance();
    const address = `http://localhost:${8000 + oneUp++}`;
    const socketServer = new mock_socket_1.Server(address);
    const clientSocket = mock_socket_1.SocketIO.connect(address);
    const options = {
        moltenInstance: mdb,
        eventBaseName: 'test:',
        socketServer: socketServer
    };
    const socket = yield index_1.default(options);
    yield new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
    });
    return {
        mdb,
        options,
        socket,
        clientSocket
    };
});
//# sourceMappingURL=initiateServer.js.map