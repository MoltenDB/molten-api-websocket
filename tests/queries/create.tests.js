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
const moltenTestInstance_1 = require("molten-core/dist/tests/lib/moltenTestInstance");
const initiateServer_1 = require("../lib/initiateServer");
ava_1.default.beforeEach((t) => __awaiter(this, void 0, void 0, function* () {
    Object.assign(t.context, yield initiateServer_1.initiateServer());
}));
ava_1.default.cb('should return a 400 error object if the collection is not specified', t => {
    const noCollection = {
        id: 'noCollection',
        type: 'create'
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, noCollection.id, 'Sent message ID');
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, noCollection);
});
ava_1.default.cb('should return a 404 error object if the collection doesn\'t exist', t => {
    const nonExistentCollection = {
        id: 'notThere',
        type: 'create',
        collection: 'noExist'
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, nonExistentCollection.id, 'Sent message ID');
        t.is(message.code, 404);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, nonExistentCollection);
});
ava_1.default.cb('should return a 400 error object if no data is given', t => {
    const badCreate = {
        id: 'notThere',
        type: 'create',
        collection: moltenTestInstance_1.testCollection.name
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, badCreate.id, 'Sent message ID');
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, badCreate);
});
ava_1.default.cb('should return a results array with the ids of the created items on success', t => {
    const create = {
        id: 'create',
        type: 'create',
        collection: moltenTestInstance_1.testCollection.name,
        data: moltenTestInstance_1.newTestData
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, create.id, 'Sent message ID');
        t.is(message.code, 200);
        t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
        t.true(message.results instanceof Array);
        t.is(message.results.length, moltenTestInstance_1.newTestData.length, 'number of new test data items');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, create);
});
//# sourceMappingURL=create.tests.js.map