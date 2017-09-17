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
ava_1.default.afterEach((t) => __awaiter(this, void 0, void 0, function* () {
    yield t.context.socket.close();
}));
ava_1.default.cb('should return a 400 error object if the collection is not specified', t => {
    const noCollection = {
        id: 'noCollection',
        type: 'update'
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
        type: 'update',
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
    const update = {
        id: 'notThere',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a 400 error object if no filter is given with update data', t => {
    const update = {
        id: 'notThere',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: {
            [moltenTestInstance_1.testCollection.fields[0]]: 'newValue'
        }
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a 400 error object if filter is given with data items', t => {
    const update = {
        id: 'notThere',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: moltenTestInstance_1.newTestData,
        filter: {
            [moltenTestInstance_1.testCollection.fields[0]]: 'newValue'
        }
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 400);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a results array on successful update of all items', t => {
    const update = {
        id: 'notThere',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: {
            [moltenTestInstance_1.testCollection.fields[0]]: 'newValue'
        },
        filter: null
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, moltenTestInstance_1.testData.length, 'all data updated');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a results array on successful update of filtered items', t => {
    const update = {
        id: 'notThere',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: {
            [moltenTestInstance_1.testCollection.fields[0]]: 'newValue'
        },
        filter: {
            field1: 'test1'
        }
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, moltenTestInstance_1.testData.length, 'all data updated');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a results array with the ids of the upated (new) items on success', t => {
    const update = {
        id: 'update',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: moltenTestInstance_1.newTestData
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, moltenTestInstance_1.newTestData.length, 'number of new test data items');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a results array with the ids of the update items on successful update', t => {
    const update = {
        id: 'update',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: [
            {
                _id: moltenTestInstance_1.testData[0]._id,
                field1: 'newValue'
            }
        ]
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, 1, 'number of new test data items');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
ava_1.default.cb('should return a results array with the ids of the replaced items on successful replace', t => {
    const update = {
        id: 'update',
        type: 'update',
        collection: moltenTestInstance_1.testCollection.name,
        data: [
            {
                _id: moltenTestInstance_1.testData[0]._id,
                field1: 'newValue'
            }
        ],
        replace: true
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, update.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, 1, 'number of new test data items');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});
//# sourceMappingURL=update.tests.js.map