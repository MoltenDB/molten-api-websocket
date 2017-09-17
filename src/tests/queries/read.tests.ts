import test from 'ava';

import { testData, testCollection } from 'molten-core/dist/tests/lib/moltenTestInstance';

import { initiateServer } from '../lib/initiateServer';

test.beforeEach(async t => {
  Object.assign(t.context, await initiateServer());
});

test.cb('should return a 400 error object if the collection is not specified', t => {
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

test.cb('should return a 404 error object if the collection doesn\'t exist', t => {
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

test.cb('should return a results array with the results on success', t => {
  const goodQuery = {
    id: 'good',
    type: 'read',
    collection: testCollection.name
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.log(`received response message:\n${JSON.stringify(message, null, 2)}`);
    t.is(message.id, goodQuery.id, 'Sent message ID');
    t.is(message.code, 200);
    t.true(message.results instanceof Array);
    t.is(message.results.length, testData.length);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});

test.cb('should return a results array with the filtered results on success', t => {
  const goodQuery = {
    id: 'good',
    type: 'read',
    collection: testCollection.name,
    filter: {
      field1: 'test1'
    }
  };

  const matchedData = testData.reduce((data, item) => {
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

test.cb('should return a results array based on the given options on success', t => {
  const goodQuery = {
    id: 'good',
    type: 'read',
    collection: testCollection.name,
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

test.cb('should return collection options with results if includeCollection true', t => {
  const goodQuery = {
    id: 'good',
    type: 'read',
    collection: testCollection.name,
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
    t.deepEqual(message.collection, testCollection);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, goodQuery);
});
