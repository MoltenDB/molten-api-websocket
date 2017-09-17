import test from 'ava';

import { newTestData, testCollection } from 'molten-core/dist/tests/lib/moltenTestInstance';

import { initiateServer } from '../lib/initiateServer';

test.beforeEach(async t => {
  Object.assign(t.context, await initiateServer());
});

test.cb('should return a 400 error object if the collection is not specified', t => {
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

test.cb('should return a 404 error object if the collection doesn\'t exist', t => {
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

test.cb('should return a 400 error object if no data is given', t => {
  const badCreate = {
    id: 'notThere',
    type: 'create',
    collection: testCollection.name
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, badCreate.id, 'Sent message ID');
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, badCreate);
});

test.cb('should return a results array with the ids of the created items on success', t => {
  const create = {
    id: 'create',
    type: 'create',
    collection: testCollection.name,
    data: newTestData
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, create.id, 'Sent message ID');
    t.is(message.code, 200);
    t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
    t.true(message.results instanceof Array);
    t.is(message.results.length, newTestData.length, 'number of new test data items');
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, create);
});
