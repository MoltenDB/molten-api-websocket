import test from 'ava';

import { testData, newTestData, testCollection } from 'molten-core/dist/tests/lib/moltenTestInstance';

import { initiateServer } from '../lib/initiateServer';

test.beforeEach(async t => {
  Object.assign(t.context, await initiateServer());
});

test.afterEach(async t => {
  await t.context.socket.close();
});

test.cb('should return a 400 error object if the collection is not specified', t => {
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

test.cb('should return a 404 error object if the collection doesn\'t exist', t => {
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

test.cb('should return a 400 error object if no data is given', t => {
  const update = {
    id: 'notThere',
    type: 'update',
    collection: testCollection.name,
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a 400 error object if no filter is given with update data', t => {
  const update = {
    id: 'notThere',
    type: 'update',
    collection: testCollection.name,
    data: {
      [testCollection.fields[0]]: 'newValue'
    }
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a 400 error object if filter is given with data items', t => {
  const update = {
    id: 'notThere',
    type: 'update',
    collection: testCollection.name,
    data: newTestData,
    filter: {
      [testCollection.fields[0]]: 'newValue'
    }
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 400);
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a results array on successful update of all items', t => {
  const update = {
    id: 'notThere',
    type: 'update',
    collection: testCollection.name,
    data: {
      [testCollection.fields[0]]: 'newValue'
    },
    filter: null
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 200);
    t.true(message.results instanceof Array);
    t.is(message.results.length, testData.length, 'all data updated');
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a results array on successful update of filtered items', t => {
  const update = {
    id: 'notThere',
    type: 'update',
    collection: testCollection.name,
    data: {
      [testCollection.fields[0]]: 'newValue'
    },
    filter: {
      field1: 'test1'
    }
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 200);
    t.true(message.results instanceof Array);
    t.is(message.results.length, testData.length, 'all data updated');
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a results array with the ids of the upated (new) items on success', t => {
  const update = {
    id: 'update',
    type: 'update',
    collection: testCollection.name,
    data: newTestData
  };

  t.context.clientSocket.on(`${t.context.options.eventBaseName}result`, (message) => {
    t.is(message.id, update.id, 'Sent message ID');
    t.is(message.code, 200);
    t.true(message.results instanceof Array);
    t.is(message.results.length, newTestData.length, 'number of new test data items');
    t.end();
  });

  t.context.clientSocket.emit(`${t.context.options.eventBaseName}query`, update);
});

test.cb('should return a results array with the ids of the update items on successful update', t => {
  const update = {
    id: 'update',
    type: 'update',
    collection: testCollection.name,
    data: [
      {
        _id: testData[0]._id,
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

test.cb('should return a results array with the ids of the replaced items on successful replace', t => {
  const update = {
    id: 'update',
    type: 'update',
    collection: testCollection.name,
    data: [
      {
        _id: testData[0]._id,
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
