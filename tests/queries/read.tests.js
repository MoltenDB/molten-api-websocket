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
        type: 'read'
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
        type: 'read',
        collection: 'noExist'
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.is(message.id, nonExistentCollection.id, 'Sent message ID');
        t.is(message.code, 404);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, nonExistentCollection);
});
ava_1.default.cb('should return a results array with the results on success', t => {
    const goodQuery = {
        id: 'good',
        type: 'read',
        collection: moltenTestInstance_1.testCollection.name
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
        t.is(message.id, goodQuery.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, moltenTestInstance_1.testData.length);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});
ava_1.default.cb('should return a results array with the filtered results on success', t => {
    const goodQuery = {
        id: 'good',
        type: 'read',
        collection: moltenTestInstance_1.testCollection.name,
        filter: {
            field1: 'test1'
        }
    };
    const matchedData = moltenTestInstance_1.testData.reduce((data, item) => {
        if (item.field1 === 'test1') {
            data.push(item);
        }
        return data;
    }, []);
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
        t.is(message.id, goodQuery.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, matchedData.length);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});
ava_1.default.cb('should return a results array based on the given options on success', t => {
    const goodQuery = {
        id: 'good',
        type: 'read',
        collection: moltenTestInstance_1.testCollection.name,
        options: {
            limit: 1
        }
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
        t.is(message.id, goodQuery.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, 1, 'only one item');
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});
ava_1.default.cb('should return collection options with results if includeCollection true', t => {
    const goodQuery = {
        id: 'good',
        type: 'read',
        collection: moltenTestInstance_1.testCollection.name,
        options: {
            limit: 1
        },
        includeCollection: true
    };
    t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
        t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
        t.is(message.id, goodQuery.id, 'Sent message ID');
        t.is(message.code, 200);
        t.true(message.results instanceof Array);
        t.is(message.results.length, 1, 'only one item');
        t.deepEqual(message.collection, moltenTestInstance_1.testCollection);
        t.end();
    });
    t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});
//# sourceMappingURL=read.tests.js.map