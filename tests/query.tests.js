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
const ava_1 = require("ava");
const initiateServer_1 = require("./lib/initiateServer");
ava_1.default.beforeEach((t) => __awaiter(this, void 0, void 0, function* () {
    Object.assign(t.context, yield initiateServer_1.initiateServer());
}));
ava_1.default.cb('should return an error object if the data is not an object', t => {
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, 'blah');
});
ava_1.default.cb('should return a 400 error object if the query is not known', t => {
    const badQuery = {
        id: 'bad',
        type: 'bad'
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, badQuery.id);
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, badQuery);
});
//# sourceMappingURL=query.tests.js.map